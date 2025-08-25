export interface PaginateData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
