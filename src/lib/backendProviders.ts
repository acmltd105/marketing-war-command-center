/**
 * Catalog of backends the onboarding wizard recognizes.
 * Browser apps cannot open raw TCP to most databases — sync runs through
 * a gateway (Supabase PostgREST, Azure Functions, Neon HTTP proxy, etc.).
 */

export type BackendProtocol =
  | "postgresql"
  | "https-json"
  | "cosmos-sql"
  | "mssql"
  | "mysql"
  | "mongodb-wire"
  | "warehouse-sql"
  | "document"
  | "wide-column"
  | "search"
  | "vector"
  | "time-series";

export type BackendCategory =
  | "postgres-family"
  | "azure-microsoft"
  | "aws"
  | "gcp"
  | "multi-cloud-warehouse"
  | "nosql-document"
  | "nosql-wide-column"
  | "analytics-ts"
  | "search-vector-cache";

export type BackendProviderDefinition = {
  id: string;
  name: string;
  vendor: string;
  category: BackendCategory;
  /** How data is usually reached from a static SPA */
  protocol: BackendProtocol;
  /** Short hint for gateway / connection pattern */
  syncHint: string;
  documentationUrl?: string;
};

export const BACKEND_CATEGORIES: Record<
  BackendCategory,
  { label: string; description: string }
> = {
  "postgres-family": {
    label: "Postgres & serverless SQL",
    description: "Managed PostgreSQL, serverless drivers, and compatible pools.",
  },
  "azure-microsoft": {
    label: "Microsoft Azure",
    description: "SQL Database, Fabric, and Cosmos DB APIs.",
  },
  aws: {
    label: "Amazon Web Services",
    description: "RDS, Aurora, Redshift, DynamoDB, and analytics.",
  },
  gcp: {
    label: "Google Cloud",
    description: "Cloud SQL, Spanner, BigQuery, and Firestore.",
  },
  "multi-cloud-warehouse": {
    label: "Warehouses & lakehouses",
    description: "Snowflake, Databricks, and cross-cloud SQL warehouses.",
  },
  "nosql-document": {
    label: "Document stores",
    description: "MongoDB-compatible and document APIs.",
  },
  "nosql-wide-column": {
    label: "Wide-column & distributed",
    description: "Cassandra-class and high-scale row stores.",
  },
  "analytics-ts": {
    label: "Analytics & time series",
    description: "ClickHouse-class engines and time-series clouds.",
  },
  "search-vector-cache": {
    label: "Search, vector, and cache",
    description: "Elasticsearch, vector DBs, and in-memory caches.",
  },
};

/** Curated list: Supabase + Neon + Cosmos + SQL Azure + 30+ other common targets */
export const BACKEND_PROVIDERS: readonly BackendProviderDefinition[] = [
  {
    id: "supabase",
    name: "Supabase",
    vendor: "Supabase",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "PostgREST + Edge Functions (native in this app).",
    documentationUrl: "https://supabase.com/docs",
  },
  {
    id: "neon",
    name: "Neon",
    vendor: "Neon",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "Serverless Postgres; use Neon HTTP/Data API or a small sync worker.",
    documentationUrl: "https://neon.tech/docs",
  },
  {
    id: "azure-sql",
    name: "Azure SQL Database",
    vendor: "Microsoft",
    category: "azure-microsoft",
    protocol: "mssql",
    syncHint: "Expose read models via Azure Functions / API Management — no raw TDS in the browser.",
    documentationUrl: "https://learn.microsoft.com/azure/azure-sql/",
  },
  {
    id: "azure-sql-managed-instance",
    name: "Azure SQL Managed Instance",
    vendor: "Microsoft",
    category: "azure-microsoft",
    protocol: "mssql",
    syncHint: "Same as SQL Database: gateway with managed identity.",
    documentationUrl: "https://learn.microsoft.com/azure/azure-sql/managed-instance/",
  },
  {
    id: "cosmos-sql",
    name: "Azure Cosmos DB (SQL / Core API)",
    vendor: "Microsoft",
    category: "azure-microsoft",
    protocol: "cosmos-sql",
    syncHint: "Cosmos REST SDK or Azure Functions with RBAC — sync from Change Feed.",
    documentationUrl: "https://learn.microsoft.com/azure/cosmos-db/",
  },
  {
    id: "cosmos-mongodb",
    name: "Azure Cosmos DB (Mongo API)",
    vendor: "Microsoft",
    category: "azure-microsoft",
    protocol: "document",
    syncHint: "Mongo driver in a backend worker; surface JSON to the SPA.",
    documentationUrl: "https://learn.microsoft.com/azure/cosmos-db/mongodb-introduction",
  },
  {
    id: "cosmos-cassandra",
    name: "Azure Cosmos DB (Cassandra API)",
    vendor: "Microsoft",
    category: "azure-microsoft",
    protocol: "wide-column",
    syncHint: "Cassandra drivers are server-side only; use a gateway.",
    documentationUrl: "https://learn.microsoft.com/azure/cosmos-db/cassandra-introduction",
  },
  {
    id: "fabric-sql",
    name: "Microsoft Fabric / OneLake SQL",
    vendor: "Microsoft",
    category: "azure-microsoft",
    protocol: "warehouse-sql",
    syncHint: "Warehouse endpoints via Entra ID — backend token exchange required.",
    documentationUrl: "https://learn.microsoft.com/fabric/",
  },
  {
    id: "vercel-postgres",
    name: "Vercel Postgres",
    vendor: "Vercel",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "@vercel/postgres or HTTP from Vercel/Edge — not from a static SPA alone.",
    documentationUrl: "https://vercel.com/docs/storage/vercel-postgres",
  },
  {
    id: "timescale",
    name: "Timescale Cloud",
    vendor: "Timescale",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "Postgres wire; sync worker recommended.",
    documentationUrl: "https://docs.timescale.com/",
  },
  {
    id: "cockroach-serverless",
    name: "CockroachDB Serverless",
    vendor: "Cockroach Labs",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "Postgres-compatible; use server-side pooler.",
    documentationUrl: "https://www.cockroachlabs.com/docs/",
  },
  {
    id: "yugabyte-managed",
    name: "YugabyteDB Managed",
    vendor: "Yugabyte",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "YSQL over gateway service.",
    documentationUrl: "https://docs.yugabyte.com/",
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    vendor: "PlanetScale",
    category: "postgres-family",
    protocol: "mysql",
    syncHint: "Serverless driver — integrate via backend API.",
    documentationUrl: "https://planetscale.com/docs",
  },
  {
    id: "tidb-cloud",
    name: "TiDB Cloud",
    vendor: "PingCAP",
    category: "postgres-family",
    protocol: "mysql",
    syncHint: "MySQL protocol; use TiDB Cloud HTTP or worker.",
    documentationUrl: "https://docs.pingcap.com/tidbcloud",
  },
  {
    id: "railway-postgres",
    name: "Railway Postgres",
    vendor: "Railway",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "Private URL + sync worker on Railway.",
    documentationUrl: "https://docs.railway.app/databases/postgresql",
  },
  {
    id: "render-postgres",
    name: "Render Postgres",
    vendor: "Render",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "Internal URL from Render services only.",
    documentationUrl: "https://render.com/docs/databases",
  },
  {
    id: "digitalocean-postgres",
    name: "DigitalOcean Managed Postgres",
    vendor: "DigitalOcean",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "VPC + App Platform worker for sync.",
    documentationUrl: "https://docs.digitalocean.com/products/databases/postgresql/",
  },
  {
    id: "aiven-postgres",
    name: "Aiven for PostgreSQL",
    vendor: "Aiven",
    category: "postgres-family",
    protocol: "postgresql",
    syncHint: "Kafka + Postgres patterns common; gateway for reads.",
    documentationUrl: "https://aiven.io/docs/products/postgresql",
  },
  {
    id: "alloydb",
    name: "AlloyDB for PostgreSQL",
    vendor: "Google",
    category: "gcp",
    protocol: "postgresql",
    syncHint: "GCP private IP; AlloyDB Auth Proxy on server.",
    documentationUrl: "https://cloud.google.com/alloydb/docs",
  },
  {
    id: "cloud-sql-postgres",
    name: "Cloud SQL for PostgreSQL",
    vendor: "Google",
    category: "gcp",
    protocol: "postgresql",
    syncHint: "Cloud SQL Auth Proxy + Cloud Run sync.",
    documentationUrl: "https://cloud.google.com/sql/docs/postgres",
  },
  {
    id: "cloud-sql-mysql",
    name: "Cloud SQL for MySQL",
    vendor: "Google",
    category: "gcp",
    protocol: "mysql",
    syncHint: "Same proxy pattern as Postgres.",
    documentationUrl: "https://cloud.google.com/sql/docs/mysql",
  },
  {
    id: "spanner",
    name: "Google Cloud Spanner",
    vendor: "Google",
    category: "gcp",
    protocol: "https-json",
    syncHint: "gRPC/REST from service account — never in browser.",
    documentationUrl: "https://cloud.google.com/spanner/docs",
  },
  {
    id: "bigquery",
    name: "Google BigQuery",
    vendor: "Google",
    category: "gcp",
    protocol: "warehouse-sql",
    syncHint: "OAuth SA on backend; expose aggregates via API.",
    documentationUrl: "https://cloud.google.com/bigquery/docs",
  },
  {
    id: "firestore",
    name: "Cloud Firestore",
    vendor: "Google",
    category: "gcp",
    protocol: "document",
    syncHint: "Firebase rules + limited client reads; heavy sync in Cloud Functions.",
    documentationUrl: "https://firebase.google.com/docs/firestore",
  },
  {
    id: "rds-postgres",
    name: "Amazon RDS for PostgreSQL",
    vendor: "AWS",
    category: "aws",
    protocol: "postgresql",
    syncHint: "Private subnets; Lambda or ECS sync worker.",
    documentationUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html",
  },
  {
    id: "rds-mysql",
    name: "Amazon RDS for MySQL",
    vendor: "AWS",
    category: "aws",
    protocol: "mysql",
    syncHint: "Same as RDS Postgres pattern.",
    documentationUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html",
  },
  {
    id: "aurora-postgres",
    name: "Amazon Aurora PostgreSQL",
    vendor: "AWS",
    category: "aws",
    protocol: "postgresql",
    syncHint: "Data API optional; gateway recommended.",
    documentationUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_Aurora.html",
  },
  {
    id: "aurora-mysql",
    name: "Amazon Aurora MySQL",
    vendor: "AWS",
    category: "aws",
    protocol: "mysql",
    syncHint: "Same family as Aurora Postgres.",
    documentationUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_Aurora.html",
  },
  {
    id: "redshift",
    name: "Amazon Redshift",
    vendor: "AWS",
    category: "aws",
    protocol: "warehouse-sql",
    syncHint: "Data API or Spectrum through backend.",
    documentationUrl: "https://docs.aws.amazon.com/redshift/",
  },
  {
    id: "dynamodb",
    name: "Amazon DynamoDB",
    vendor: "AWS",
    category: "aws",
    protocol: "https-json",
    syncHint: "AWS SDK in worker; streams to your API.",
    documentationUrl: "https://docs.aws.amazon.com/dynamodb/",
  },
  {
    id: "athena",
    name: "Amazon Athena",
    vendor: "AWS",
    category: "aws",
    protocol: "warehouse-sql",
    syncHint: "Presto-compatible SQL via AWS SDK server-side.",
    documentationUrl: "https://docs.aws.amazon.com/athena/",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    vendor: "Snowflake",
    category: "multi-cloud-warehouse",
    protocol: "warehouse-sql",
    syncHint: "Snowflake driver in secure service; REST proxy for app.",
    documentationUrl: "https://docs.snowflake.com/",
  },
  {
    id: "databricks-sql",
    name: "Databricks SQL Warehouse",
    vendor: "Databricks",
    category: "multi-cloud-warehouse",
    protocol: "warehouse-sql",
    syncHint: "SQL connector + personal access token on server only.",
    documentationUrl: "https://docs.databricks.com/sql/index.html",
  },
  {
    id: "mongodb-atlas",
    name: "MongoDB Atlas",
    vendor: "MongoDB",
    category: "nosql-document",
    protocol: "mongodb-wire",
    syncHint: "Atlas Data API or Realm/App Services for browser-safe paths.",
    documentationUrl: "https://www.mongodb.com/docs/atlas/",
  },
  {
    id: "cassandra-astra",
    name: "DataStax Astra DB",
    vendor: "DataStax",
    category: "nosql-wide-column",
    protocol: "wide-column",
    syncHint: "Stargate REST/GraphQL from backend.",
    documentationUrl: "https://docs.datastax.com/en/astra-serverless/docs/",
  },
  {
    id: "scylla-cloud",
    name: "ScyllaDB Cloud",
    vendor: "ScyllaDB",
    category: "nosql-wide-column",
    protocol: "wide-column",
    syncHint: "Cassandra-compatible; sync worker required.",
    documentationUrl: "https://docs.scylladb.com/",
  },
  {
    id: "clickhouse-cloud",
    name: "ClickHouse Cloud",
    vendor: "ClickHouse",
    category: "analytics-ts",
    protocol: "https-json",
    syncHint: "HTTPS interface or chproxy with auth.",
    documentationUrl: "https://clickhouse.com/docs/en/cloud",
  },
  {
    id: "tinybird",
    name: "Tinybird",
    vendor: "Tinybird",
    category: "analytics-ts",
    protocol: "https-json",
    syncHint: "HTTP APIs over ClickHouse pipes.",
    documentationUrl: "https://www.tinybird.co/docs",
  },
  {
    id: "influxdb-cloud",
    name: "InfluxDB Cloud",
    vendor: "InfluxData",
    category: "analytics-ts",
    protocol: "time-series",
    syncHint: "InfluxDB v2 HTTP API with server-stored token.",
    documentationUrl: "https://docs.influxdata.com/influxdb/cloud/",
  },
  {
    id: "questdb-cloud",
    name: "QuestDB Cloud",
    vendor: "QuestDB",
    category: "analytics-ts",
    protocol: "postgresql",
    syncHint: "ILP/Postgres wire from workers.",
    documentationUrl: "https://questdb.io/docs/",
  },
  {
    id: "singlestore",
    name: "SingleStore Helios",
    vendor: "SingleStore",
    category: "multi-cloud-warehouse",
    protocol: "mysql",
    syncHint: "MySQL protocol from private services.",
    documentationUrl: "https://docs.singlestore.com/",
  },
  {
    id: "turso",
    name: "Turso (libSQL)",
    vendor: "ChiselStrike",
    category: "postgres-family",
    protocol: "https-json",
    syncHint: "libSQL remote HTTP — suitable for edge sync with token rotation server-side.",
    documentationUrl: "https://docs.turso.tech/",
  },
  {
    id: "xata",
    name: "Xata",
    vendor: "Xata",
    category: "postgres-family",
    protocol: "https-json",
    syncHint: "REST API over Postgres; branch-based workflows.",
    documentationUrl: "https://xata.io/docs",
  },
  {
    id: "elasticsearch-cloud",
    name: "Elastic Cloud",
    vendor: "Elastic",
    category: "search-vector-cache",
    protocol: "search",
    syncHint: "API key in backend; search UI calls your BFF.",
    documentationUrl: "https://www.elastic.co/guide/en/cloud/current/ec-getting-started.html",
  },
  {
    id: "opensearch-managed",
    name: "Amazon OpenSearch Service",
    vendor: "AWS",
    category: "search-vector-cache",
    protocol: "search",
    syncHint: "SigV4 from AWS network; no direct browser signing without careful STS.",
    documentationUrl: "https://docs.aws.amazon.com/opensearch-service/",
  },
  {
    id: "redis-cloud",
    name: "Redis Enterprise Cloud",
    vendor: "Redis",
    category: "search-vector-cache",
    protocol: "https-json",
    syncHint: "Redis wire is LAN/VPC; use Redis Stack REST or worker cache.",
    documentationUrl: "https://redis.io/docs/latest/operate/rc/",
  },
  {
    id: "pinecone",
    name: "Pinecone",
    vendor: "Pinecone",
    category: "search-vector-cache",
    protocol: "vector",
    syncHint: "API key must stay server-side; expose query RPC.",
    documentationUrl: "https://docs.pinecone.io/",
  },
  {
    id: "meilisearch-cloud",
    name: "Meilisearch Cloud",
    vendor: "Meilisearch",
    category: "search-vector-cache",
    protocol: "search",
    syncHint: "Master key on server; search-only keys scoped per index if needed.",
    documentationUrl: "https://www.meilisearch.com/docs",
  },
  {
    id: "typesense-cloud",
    name: "Typesense Cloud",
    vendor: "Typesense",
    category: "search-vector-cache",
    protocol: "search",
    syncHint: "Search API from backend proxy.",
    documentationUrl: "https://typesense.org/docs/",
  },
] as const;

export function getProviderById(id: string): BackendProviderDefinition | undefined {
  return BACKEND_PROVIDERS.find((p) => p.id === id);
}

export function filterProviders(query: string): readonly BackendProviderDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return BACKEND_PROVIDERS;
  return BACKEND_PROVIDERS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q) ||
      p.id.includes(q) ||
      BACKEND_CATEGORIES[p.category].label.toLowerCase().includes(q),
  );
}
