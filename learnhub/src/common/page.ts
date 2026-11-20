// Une page de résultats : les éléments, le nombre total, et où l'on en est
export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
