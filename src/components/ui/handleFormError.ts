import { UseFormReturn } from "react-hook-form";
import { useToastContext } from "./ToastsContext";
export const handleFormError = (
  data: any,
  toast: ReturnType<typeof useToastContext>,
  methods?: UseFormReturn<any>
) => {
  const errorCode = data?.response?.data?.code;
  const status = data?.response?.status;
  if (status === 400 && errorCode) {
    //@ts-ignore
    const errorMessage = "Wystąpił błąd";

    toast.error({
      heading: "Wystąpił błąd",
      message: errorMessage,
    });
  } else if (
    data?.response?.status === 422 &&
    Array.isArray(data?.response?.data?.errors) &&
    methods
  ) {
    const errors = data.response.data.errors as {
      message: string;
      code: string;
    }[];

    errors.forEach((ferr) => {
      methods.setError(ferr.code as any, {
        type: "invalid_string",
        message: ferr.message || "Wystąpił błąd",
      });
    });
  } else if (
    data?.response?.status === 422 &&
    Array.isArray(data?.response?.data?.errors)
  ) {
    data?.response?.data?.errors.map((item: { message: string }, idx: number) =>
      toast.error({
        heading: "Wystąpił błąd",
        message: item?.message ?? "",
      })
    );
  } else {
    toast.error({
      heading: "Wystąpił błąd",
      message: data?.response?.data?.message ?? "",
    });
  }
};
