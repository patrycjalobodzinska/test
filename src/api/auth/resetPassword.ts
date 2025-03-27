import axios, { AxiosResponse } from "axios";
import { z } from "zod";

export const resetPasswordSchema = z.object({
  userId: z
    .string({
      required_error: "Pole wymagane",
    })
    .trim(),
  token: z.string({
    required_error: "Pole wymagane",
  }),
  password: z
    .string({
      required_error: "Pole wymagane",
    })
    .trim(),
  confirmPassword: z
    .string({
      required_error: "Pole wymagane",
    })
    .trim(),
});

export type ResetPasswordFormFields = z.infer<typeof resetPasswordSchema>;

export type ResetPasswordResponse = {};

export const resetPassword = (
  data: ResetPasswordFormFields
): Promise<AxiosResponse<ResetPasswordResponse>["data"]> => {
  return axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_API_URL}/v1/accounts/reset-password`,
    withCredentials: true,
    data: {
      ...data,
    },
  }).then(({ data }) => data);
};
