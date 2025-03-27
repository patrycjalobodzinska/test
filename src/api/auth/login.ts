import axios, { AxiosResponse } from "axios";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Pole wymagane" })
    .trim()
    .nonempty({ message: "Pole wymagane" }),
  password: z
    .string({ required_error: "Pole wymagane" })
    .nonempty({ message: "Pole wymagane" })
    .trim(),
});

export type LoginFormFields = z.infer<typeof loginSchema>;

export type LoginResponse = {};

export const login = (
  data: LoginFormFields
): Promise<AxiosResponse<LoginResponse>["data"]> => {
  return axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_API_URL}/v1/accounts/sign-in`,
    withCredentials: true,
    data: {
      ...data,
    },
  }).then(({ data }) => data);
};
