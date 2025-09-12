import { useState } from "react";
import { Button } from "@/components/ui/button";

const DncUpload = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-4">DNC List Upload</h1>
      <label
        htmlFor="dnc-file"
        className={[
          "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer",
          "bg-muted/50 hover:bg-muted",
        ].join(" ")}
      >
        <input
          id="dnc-file"
          type="file"
          className="hidden"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        {fileName ? (
          <span className="text-sm">{fileName}</span>
        ) : (
          <span className="text-sm text-muted-foreground">
            Drag and drop or click to upload CSV/XLSX
          </span>
        )}
      </label>
      {fileName && <Button className="mt-4">Process File</Button>}
    </div>
  );
};

export default DncUpload;

