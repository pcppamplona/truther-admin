import { api } from "@/services/api";

export type CsvFilterValue = string | number | boolean | null | undefined;
export type CsvFilters = Record<string, CsvFilterValue>;

function toQueryString(filters?: CsvFilters): string {
  const params = new URLSearchParams();
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    }
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function formatTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export function useTransactionsCsv(endpoint: string, defaultFilenamePrefix = "export") {
  return async function downloadCsv(filters?: CsvFilters, filenamePrefix?: string) {
    try {
      const qs = toQueryString(filters);
      const url = `${endpoint}${qs}`;
      const response = await api.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const fileName = `${filenamePrefix || defaultFilenamePrefix}-${formatTimestamp()}.csv`;
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error(`Failed to download CSV from ${endpoint}:`, e);
    }
  };
}
