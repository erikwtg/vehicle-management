export interface CursorPaginationResult<T> {
  data: T | T[];
  nextCursor: number | null;
  hasMore: boolean;
}
