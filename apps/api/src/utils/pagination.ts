import type {PaginationOptions} from '../types/domain';

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const MAX_SIZE = 50;

export function getPaginationOptions(query: Record<string, unknown>): PaginationOptions {
  const page = Math.max(Number(query.page || DEFAULT_PAGE), 1);
  const requestedSize = Math.max(Number(query.size || DEFAULT_SIZE), 1);
  const size = Math.min(requestedSize, MAX_SIZE);

  return {
    page,
    size,
    totalPages: 1,
  };
}

export function paginate<T>(items: T[], page: number, size: number): {data: T[]; totalPages: number} {
  const totalPages = Math.max(Math.ceil(items.length / size), 1);
  const start = (page - 1) * size;

  return {
    data: items.slice(start, start + size),
    totalPages,
  };
}
