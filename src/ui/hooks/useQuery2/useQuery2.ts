import { AxiosError } from "axios";
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

export type UseQuery2Params<T, Error> = {
  queryKey: QueryKey;
  queryFn(_queryKey: QueryKey[0]): Promise<T>;
  config?: UseQueryOptions<T, Error>;
};

export type UseQuery2Result<T> = Omit<
  UseQueryResult<T, AxiosError<ApiErrorData>>,
  "data"
> & {
  data?: T;
};

export const useQuery2 = <T>({
  queryKey,
  queryFn,
  config,
}: UseQuery2Params<T, AxiosError<ApiErrorData>>): UseQuery2Result<T> => {
  const [, ...queryKeyArgs] = queryKey;

  const {
    data: queryData,
    isSuccess: _isSuccess,
    status,
    ...rest
  } = useQuery<T, AxiosError<ApiErrorData>>(
    [queryKey],
    () => queryFn(queryKeyArgs),
    config
  );

  const data = status === "success" ? queryData : undefined;

  return {
    ...rest,
    status,
    isSuccess: _isSuccess && data !== undefined,
    data,
  };
};

export type ApiErrorData = {
  cartProductCuid?: string;
  productId?: string;
  code: string;
  data?: {
    cartProductCuid?: string;
    requiredAction?: string;
  };
  requiredAction?: string;
  status: number;
  title: string;
  errors?: any;
  message: string;
};

export type Pagination = {
  paginationData: {
    currentPage: number | undefined;
    totalPages: number | undefined;
    totalItems: number | undefined;
    hasPreviousPage: boolean | undefined;
    hasNextPage: boolean | undefined;
  };
};

export type ApiPaginatedResponse<T> = Pagination & {
  items: T[];
};

export type ApiQueryParamsType = Record<
  string,
  string | number | string[] | undefined
>;
