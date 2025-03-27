import { useFormMutation } from "@/ui/hooks/useFormMutation";
import Image from "next/image";
import { FormProvider } from "react-hook-form";

import {
  resetPassword,
  ResetPasswordFormFields,
  ResetPasswordResponse,
  resetPasswordSchema,
} from "@/api/auth/resetPassword";
import { useRouter } from "next/router";
import { useEffect } from "react";

import logo from "@/public/sc4c_logo.png";
import { handleFormError } from "@/components/ui/handleFormError";
import { useToastContext } from "@/components/ui/ToastsContext";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";
import { InputText } from "@/components/ui/TextInput";
import { Button } from "@/ui/button";

const ResetPassword: NextPageWithLayout = () => {
  const toast = useToastContext();
  const router = useRouter();
  const { userId, token } = router.query;
  const { methods, handleSubmit, isLoading } = useFormMutation<
    ResetPasswordFormFields,
    ResetPasswordResponse
  >(resetPasswordSchema, resetPassword, {
    onSuccess() {
      toast.success({ heading: "Hasło zostało zmienione", message: "" });
      router.push("/");
    },
    onError(error) {
      handleFormError(error, toast, methods);
    },
  });
  useEffect(() => {
    if (userId && token) {
      methods.setValue("userId", userId as string);
      methods.setValue("token", token as string);
    }
  }, [userId, token, methods]);
  return (
    <div className="p-6 bg-white md:p-24 min-h-screen md:h-screen md:overflow-hidden">
      <div className="flex flex-col items-center  h-full  md:mt-24  relative">
        <Image alt="Senvisio Logo" src={logo} className="w-[300px] mb-6" />
        <div className="flex max-w-[400px] w-full flex-col gap-7">
          <div className="font-semibold text-center md:text-lg text-dark">
            Zmiana hasła
          </div>

          <div className="w-full ">
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit}
                className=" w-full  text-gray-200 z-10 ">
                <div className="flex flex-col  gap-3">
                  <InputText
                    isPassword={true}
                    showHidePassword
                    name="password"
                    type="password"
                    required
                    label="Nowe hasło"
                  />{" "}
                  <InputText
                    isPassword={true}
                    showHidePassword
                    name="confirmPassword"
                    type="password"
                    required
                    label="Powtórz nowe hasło"
                  />
                </div>

                <div className="flex items-end justify-end  pt-8 ">
                  <div>
                    <Button
                      disabled={
                        isLoading ||
                        !methods.watch("token") ||
                        !methods.watch("userId") ||
                        !methods.watch("password")
                      }
                      onClick={handleSubmit}
                      className="w-full">
                      Zapisz
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
