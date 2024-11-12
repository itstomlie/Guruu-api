export default class Pagination {
  static getPagination = (
    page: number | undefined,
    size: number | undefined,
  ) => {
    const limit = size ? +size : 3;
    const offset = page ? (page - 1) * (size ? size : 3) : 0;
    return { limit, offset };
  };

  static getPagingData = (rawData: any, page: number, limit = 3) => {
    const { count: totalItems, rows: data } = rawData;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, totalPages, currentPage, data };
  };
}
