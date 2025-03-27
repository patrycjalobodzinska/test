import { useQuery2 } from "@/ui/hooks/useQuery2";
import axios from "axios";

export type AuthMe = {
  userId: string;
  email: string;
  phoneNumberPrefix: string;
  phoneNumber: string;
  role: string;
  state: string;
  createdAt: string;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  permissions: string[];
};

export const getAuthMeKey = "auth.me";

export const getAuthMe = () =>
  axios({
    method: "GET",
    withCredentials: true,
    url: `${process.env.NEXT_PUBLIC_API_URL}/v1/accounts
`,
  }).then(({ data }) => data);

export const useGetAuthMe = () =>
  useQuery2<AuthMe>({
    queryKey: [getAuthMeKey],
    queryFn: getAuthMe,
  });
