import axios, { AxiosResponse } from "axios";
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Pole wymagane",
    })
    .trim(),
});

export type ForgotPasswordFormFields = z.infer<typeof forgotPasswordSchema>;

export type ForgotPasswordResponse = {};

export const forgotPassword = (
  data: ForgotPasswordFormFields
): Promise<AxiosResponse<ForgotPasswordResponse>["data"]> => {
  return axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_API_URL}/v1/accounts/reset-password`,
    withCredentials: true,
    params: {
      email: data?.email,
    },
  }).then(({ data }) => data);
};
