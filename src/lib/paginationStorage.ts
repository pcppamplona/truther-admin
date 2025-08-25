const STORAGE_KEY = "pagination-settings";

interface PaginationSettings {
  [table: string]: {
    page: number;
    limit: number;
  };
}

export function getPaginationSettings(table: string, defaultPage = 1, defaultLimit = 10) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { page: defaultPage, limit: defaultLimit };

  try {
    const parsed: PaginationSettings = JSON.parse(raw);
    return parsed[table] ?? { page: defaultPage, limit: defaultLimit };
  } catch {
    return { page: defaultPage, limit: defaultLimit };
  }
}

export function setPaginationSettings(table: string, page: number, limit: number) {
  const raw = localStorage.getItem(STORAGE_KEY);
  let parsed: PaginationSettings = {};

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }

  parsed[table] = { page, limit };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}
