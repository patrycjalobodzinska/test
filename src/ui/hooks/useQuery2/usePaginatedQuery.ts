import { AxiosError } from "axios";
import { useRouter } from "next/router";
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import {
  ApiErrorData,
  ApiPaginatedResponse,
  ApiQueryParamsType,
} from "./useQuery2";

export type UsePaginatedQueryParams<T, Error> = {
  queryKey: QueryKey;
  queryFn(
    _queryKeyArgs: QueryKey[0],
    _queryParams: ApiQueryParamsType
  ): Promise<ApiPaginatedResponse<T>>;
  config?: UseQueryOptions<ApiPaginatedResponse<T>, Error>;
  defaultPageSize?: number;
  defaultPage?: number;
  page?: number;
  perPage?: number;
  withDefaultPagination?: boolean;
};

export type UsePaginatedQueryResult<T> = Omit<
  UseQueryResult<ApiPaginatedResponse<T>, AxiosError<ApiErrorData>>,
  "data"
> & {
  data?: T[];
  paginationData: {
    currentPage: number | undefined;
    totalPages: number | undefined;
    totalItems: number | undefined;
    hasPreviousPage: boolean | undefined;
    hasNextPage: boolean | undefined;
  };
  withDefaultPagination: boolean;
};

export const usePaginatedQuery = <T>({
  queryKey,
  queryFn,
  config,
  defaultPageSize = 25,
  defaultPage = 1,
  page: passedPage,
  withDefaultPagination = true,
  perPage: passedPerPage,
}: UsePaginatedQueryParams<
  T,
  AxiosError<ApiErrorData>
>): UsePaginatedQueryResult<T> => {
  const router = useRouter();

  const pageFromQuery = router.query.currentPage
    ? router.query.currentPage
    : undefined;
  const pageSizeFromQuery = router.query.pageSize
    ? router.query.pageSize[0]
    : undefined;

  const currentPage = passedPage ?? pageFromQuery ?? defaultPage;
  const pageSize = passedPerPage ?? pageSizeFromQuery ?? defaultPageSize;

  const queryParams = { ...router.query };

  const [, ...queryKeyArgs] = queryKey;
  const queryData = useQuery<ApiPaginatedResponse<T>, AxiosError<ApiErrorData>>(
    [...queryKey, { ...queryParams, currentPage, pageSize }],
    () =>
      queryFn(queryKeyArgs, {
        ["currentPage"]: currentPage,
        ["pageSize"]: pageSize,
        ...queryParams,
      }),
    { ...config, keepPreviousData: true }
  );
  return {
    ...queryData,
    data: queryData.data?.items,
    withDefaultPagination: withDefaultPagination,
    paginationData: {
      currentPage: queryData.data?.paginationData?.currentPage,
      totalPages: queryData.data?.paginationData?.totalPages,
      totalItems: queryData.data?.paginationData?.totalItems,
      hasPreviousPage: queryData.data?.paginationData?.hasPreviousPage,
      hasNextPage: queryData.data?.paginationData?.hasNextPage,
    },
  };
};
