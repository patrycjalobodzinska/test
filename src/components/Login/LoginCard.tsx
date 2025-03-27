import { useFormMutation } from "@/ui/hooks/useFormMutation";

import { useGetAuthMe } from "@/api/auth/getAuthMe";

import Link from "next/link";
import { useRouter } from "next/router";
import { FormProvider } from "react-hook-form";
import { useToastContext } from "../ui/ToastsContext";
import { handleFormError } from "../ui/handleFormError";
import {
  login,
  LoginFormFields,
  LoginResponse,
  loginSchema,
} from "@/api/auth/login";
import { InputText } from "../ui/TextInput";
import { Button } from "@/ui/button";

const LoginCard = () => {
  const router = useRouter();
  const toast = useToastContext();
  const { path } = router.query;
  const { methods, handleSubmit, isLoading } = useFormMutation<
    LoginFormFields,
    LoginResponse
  >(
    loginSchema,
    login,
    {
      onSuccess(data) {
        if (path) {
          router.push(path as string);
        } else {
          router.push(`/dashboard`);
        }
      },
      onError(error) {
        handleFormError(error, toast, methods);
      },
    },
    {
      userName: "",
      password: "",
    }
  );
  const { data } = useGetAuthMe();

  return (
    <div className="flex flex-col  items-center  h-full w-full justify-center ">
      <div className="flex flex-col  gap-2 w-full ">
        <div className="flex flex-col items-center w-full justify-center">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 text-gray-300 flex-col w-full  ">
              <InputText
                onlyLeters={true}
                required
                name="email"
                label="Nazwa użytkownika"
              />
              <InputText
                required
                showHidePassword
                name="password"
                type="password"
                label="Hasło"
              />
              <Link
                href="/forgot-password"
                className="pt-1 text-gray-400   text-sm hover:underline">
                Nie pamiętasz hasła?
              </Link>
              <div className="flex items-center justify-end">
                <Button
                  variant={"default"}
                  isLoading={isLoading}
                  disabled={isLoading}
                  type="submit">
                  Zaloguj się
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
