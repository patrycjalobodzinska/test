import { useFormMutation } from "@/ui/hooks/useFormMutation";
import Image from "next/image";
import { FormProvider } from "react-hook-form";

import { useRouter } from "next/router";

import logo from "@/public/sc4c_logo.png";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";
import { useToastContext } from "@/components/ui/ToastsContext";
import {
  forgotPassword,
  ForgotPasswordFormFields,
  ForgotPasswordResponse,
  forgotPasswordSchema,
} from "@/api/auth/forgotPassword";
import { handleFormError } from "@/components/ui/handleFormError";
import { Button } from "@/ui/button";
import { InputText } from "@/components/ui/TextInput";

const Forgot: NextPageWithLayout = () => {
  const toast = useToastContext();
  const router = useRouter();

  const { methods, handleSubmit, isLoading } = useFormMutation<
    ForgotPasswordFormFields,
    ForgotPasswordResponse
  >(forgotPasswordSchema, forgotPassword, {
    onSuccess() {
      toast.success({ heading: "Wysłano email", message: "" });
      router.push("/");
    },
    onError(error) {
      handleFormError(error, toast, methods);
    },
  });

  return (
    <div className="p-6 bg-white md:p-24 min-h-screen md:h-screen md:overflow-hidden">
      <div className="flex flex-col items-center  h-full  md:mt-24  relative">
        <Image alt="Senvisio Logo" src={logo} className="w-[300px] mb-6" />
        <div className="flex max-w-[400px] w-full flex-col gap-7">
          <div className="font-semibold text-center md:text-lg text-dark">
            Przypominanie hasła
          </div>{" "}
          <Link
            href="/"
            className="text-dark flex items-center text-sm hover:text-gray-200">
            <ChevronLeft className="mr-2 " size={20} />
            <span>Powrót do logowania</span>
          </Link>
          <div className="w-full ">
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit}
                className=" w-full text-gray-300 font-medium  z-10 ">
                <div className="flex flex-col  gap-3">
                  <InputText
                    onlyLeters={true}
                    name="email"
                    required
                    placeholder="Podaj email"
                    label="Email"
                  />

                  <div className="flex items-end justify-end ">
                    <div>
                      <Button
                        isLoading={isLoading}
                        disabled={isLoading || !methods.watch("email")}
                        onClick={handleSubmit}
                        className="w-full">
                        Wyślij
                      </Button>
                    </div>
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

export default Forgot;
