import { useCallback, useState } from "react"
import Papa from "papaparse"
import * as XLSX from "xlsx"

import { toast } from "@/components/ui/sonner"
import { getSupabaseBrowserClient } from "@/lib/supabaseClient"

const CHUNK_SIZE = 500
const MAX_SAFE_TEXT_LOAD_BYTES = 15 * 1024 * 1024 // 15 MB guardrail for pre-counting rows

export type UploadStage = "idle" | "preparing" | "uploading" | "success" | "error"

interface UploadState {
  stage: UploadStage
  fileName: string | null
  ingestionId: string | null
  processedRows: number
  totalRows: number | null
  errorMessage: string | null
}

interface LeadInsertPayload {
  ingestion_id: string
  source_filename: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  hashed_phone: string | null
  raw_payload: Record<string, unknown>
}

const FIRST_NAME_KEYS = ["first_name", "firstname", "first", "givenname"]
const LAST_NAME_KEYS = ["last_name", "lastname", "last", "surname", "familyname"]
const EMAIL_KEYS = ["email", "email_address", "emailaddress", "primaryemail"]
const PHONE_KEYS = ["phone", "phone_number", "phonenumber", "mobile", "mobilephone", "contactnumber", "cell"]
const COMPANY_KEYS = ["company", "company_name", "organization", "organisation", "org", "brand", "employer"]

const NORMALIZE_KEY_REGEX = /[^a-z0-9]/g

const INITIAL_STATE: UploadState = {
  stage: "idle",
  fileName: null,
  ingestionId: null,
  processedRows: 0,
  totalRows: null,
  errorMessage: null,
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(NORMALIZE_KEY_REGEX, "")
}

function sanitizeRow(row: Record<string, unknown>): Record<string, unknown> {
  return Object.entries(row).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const trimmedKey = key.trim()

    if (typeof value === "string") {
      const cleaned = value.replace(/\uFEFF/g, "").trim()
      acc[trimmedKey] = cleaned.length > 0 ? cleaned : null
      return acc
    }

    if (typeof value === "number") {
      acc[trimmedKey] = Number.isFinite(value) ? value : null
      return acc
    }

    if (value instanceof Date) {
      acc[trimmedKey] = value.toISOString()
      return acc
    }

    acc[trimmedKey] = value ?? null
    return acc
  }, {})
}

function isRowEmpty(row: Record<string, unknown>) {
  return Object.values(row).every((value) => {
    if (value === null || value === undefined) return true
    if (typeof value === "string") return value.trim().length === 0
    return false
  })
}

function buildKeyLookup(row: Record<string, unknown>) {
  return Object.keys(row).reduce<Map<string, string>>((map, key) => {
    const normalized = normalizeKey(key)
    if (!map.has(normalized)) {
      map.set(normalized, key)
    }
    return map
  }, new Map<string, string>())
}

function extractField(
  row: Record<string, unknown>,
  lookup: Map<string, string>,
  candidates: string[],
): string | null {
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeKey(candidate)
    const originalKey = lookup.get(normalizedCandidate)
    if (!originalKey) continue

    const value = row[originalKey]
    if (value === null || value === undefined) return null

    if (typeof value === "string") {
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    }

    return String(value)
  }

  return null
}

async function sha256(value: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function normalizePhone(value: string | null) {
  if (!value) return null
  const digitsOnly = value.replace(/\D/g, "")
  if (!digitsOnly) return null
  return digitsOnly
}

async function transformRows(
  rows: Record<string, unknown>[],
  ingestionId: string,
  fileName: string,
): Promise<LeadInsertPayload[]> {
  const transformed: LeadInsertPayload[] = []

  for (const rawRow of rows) {
    const sanitized = sanitizeRow(rawRow)
    if (isRowEmpty(sanitized)) continue

    const lookup = buildKeyLookup(sanitized)
    const firstName = extractField(sanitized, lookup, FIRST_NAME_KEYS)
    const lastName = extractField(sanitized, lookup, LAST_NAME_KEYS)
    const email = extractField(sanitized, lookup, EMAIL_KEYS)
    const phone = normalizePhone(extractField(sanitized, lookup, PHONE_KEYS))
    const company = extractField(sanitized, lookup, COMPANY_KEYS)

    const hashedPhone = phone ? await sha256(phone.replace(/\D/g, "")) : null

    transformed.push({
      ingestion_id: ingestionId,
      source_filename: fileName,
      first_name: firstName,
      last_name: lastName,
      email: email ? email.toLowerCase() : null,
      phone,
      company,
      hashed_phone: hashedPhone,
      raw_payload: sanitized,
    })
  }

  return transformed
}

async function estimateCsvRowCount(file: File) {
  if (file.size > MAX_SAFE_TEXT_LOAD_BYTES) {
    return null
  }

  const text = await file.text()
  const lines = text.split(/\r\n|\n|\r/g).filter((line) => line.trim().length > 0)
  if (lines.length <= 1) {
    return Math.max(0, lines.length - 1)
  }

  return lines.length - 1
}

async function readXlsxRows(file: File) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return []
  const worksheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: null,
    blankrows: false,
  })
}

function chunkArray<T>(items: T[], chunkSize: number) {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }
  return chunks
}

export function useLeadIngestion() {
  const [uploadState, setUploadState] = useState<UploadState>(INITIAL_STATE)

  const reset = useCallback(() => {
    setUploadState(INITIAL_STATE)
  }, [])

  const handleFileUpload = useCallback(
    async (file: File) => {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        toast.error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable uploads.")
        setUploadState({
          ...INITIAL_STATE,
          stage: "error",
          errorMessage: "Supabase credentials are missing.",
          fileName: file.name,
        })
        return
      }

      setUploadState({
        stage: "preparing",
        fileName: file.name,
        ingestionId: null,
        processedRows: 0,
        totalRows: null,
        errorMessage: null,
      })

      const extension = file.name.split(".").pop()?.toLowerCase()
      if (!extension || !["csv", "xlsx", "xls"].includes(extension)) {
        const message = "Unsupported file type. Upload a CSV or XLSX file."
        toast.error(message)
        setUploadState({
          stage: "error",
          fileName: file.name,
          ingestionId: null,
          processedRows: 0,
          totalRows: null,
          errorMessage: message,
        })
        return
      }

      let totalRows: number | null = null
      if (extension === "csv") {
        totalRows = await estimateCsvRowCount(file)
      }

      let ingestionId: string | null = null
      let processedRows = 0

      try {
        const { data: ingestion, error: ingestionError } = await supabase
          .from("lead_ingestions")
          .insert({
            filename: file.name,
            status: "processing",
            total_rows: totalRows,
            processed_rows: 0,
          })
          .select("id")
          .single()

        if (ingestionError) throw ingestionError
        const confirmedIngestionId = ingestion.id as string
        ingestionId = confirmedIngestionId

        setUploadState((prev) => ({
          ...prev,
          ingestionId,
          totalRows,
          stage: "uploading",
        }))

        const persistProgress = async (rowsProcessed: number, inferredTotal?: number) => {
          const updatePayload: Record<string, unknown> = { processed_rows: rowsProcessed }
          if (typeof inferredTotal === "number" && inferredTotal > 0) {
            updatePayload.total_rows = inferredTotal
          }
          const { error: progressError } = await supabase
            .from("lead_ingestions")
            .update(updatePayload)
            .eq("id", confirmedIngestionId)
          if (progressError) {
            console.warn("Failed to persist ingestion progress", progressError)
          }
        }

        if (extension === "csv") {
          await new Promise<void>((resolve, reject) => {
            Papa.parse<Record<string, unknown>>(file, {
              header: true,
              skipEmptyLines: true,
              worker: true,
              chunkSize: CHUNK_SIZE,
              chunk: async (results, parser) => {
                parser.pause()
                try {
                  const transformed = await transformRows(results.data, ingestionId!, file.name)
                  if (transformed.length > 0) {
                    const { error: insertError } = await supabase.from("leads").insert(transformed)
                    if (insertError) throw insertError
                    processedRows += transformed.length
                    setUploadState((prev) => ({
                      ...prev,
                      processedRows,
                    }))
                    await persistProgress(processedRows)
                  }
                  parser.resume()
                } catch (chunkError) {
                  parser.abort()
                  reject(chunkError)
                }
              },
              complete: async () => {
                if (totalRows === null) {
                  totalRows = processedRows
                  setUploadState((prev) => ({
                    ...prev,
                    totalRows,
                  }))
                  await persistProgress(processedRows, totalRows)
                }
                resolve()
              },
              error: (error) => {
                reject(error)
              },
            })
          })
        } else {
          const rows = await readXlsxRows(file)
          if (!totalRows) {
            totalRows = rows.length
          }

          for (const chunk of chunkArray(rows, CHUNK_SIZE)) {
            const transformed = await transformRows(chunk, ingestionId, file.name)
            if (transformed.length === 0) continue

            const { error: insertError } = await supabase.from("leads").insert(transformed)
            if (insertError) throw insertError

            processedRows += transformed.length
            setUploadState((prev) => ({
              ...prev,
              processedRows,
              totalRows,
            }))
            await persistProgress(processedRows, totalRows)
          }
        }

        const completedAt = new Date().toISOString()
        await supabase
          .from("lead_ingestions")
          .update({
            status: "succeeded",
            processed_rows: processedRows,
            total_rows: totalRows ?? processedRows,
            completed_at: completedAt,
          })
          .eq("id", ingestionId)

        setUploadState((prev) => ({
          ...prev,
          stage: "success",
          processedRows,
          totalRows: totalRows ?? processedRows,
        }))
        toast.success(`Ingested ${processedRows.toLocaleString()} lead records from ${file.name}`)
      } catch (error) {
        console.error("Lead ingestion failed", error)
        const errorMessage =
          error instanceof Error ? error.message : "Lead ingestion failed. Check console for more details."

        if (ingestionId) {
          await supabase
            .from("lead_ingestions")
            .update({
              status: "failed",
              error: errorMessage,
              processed_rows: processedRows,
            })
            .eq("id", ingestionId)
        }

        toast.error(errorMessage)
        setUploadState((prev) => ({
          ...prev,
          stage: "error",
          errorMessage,
        }))
      }
    },
    [],
  )

  return {
    uploadState,
    isUploading: uploadState.stage === "preparing" || uploadState.stage === "uploading",
    handleFileUpload,
    reset,
  }
}
