import { Controller, FieldError, useFormContext } from "react-hook-form";

import clsx from "clsx";
import { JSX } from "react";
import {
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./select";

type InputTextProps = {
  name: string;
  noDataPlaceholder?: string;
  defaultValue?: string;
  label?: string;
  isPostalCode?: boolean;
  size?: string;
  radius?: string;
  secureTextEntry?: boolean;
  icon?: JSX.Element;
  disabled?: boolean;
  description?: string;
  onBlur?: () => void;
  onPressOut?: () => void;
  placeholder?: string;
  unit?: string;
  data?: { name: string; id: string | number }[];
  required?: boolean;
  isSignIn?: boolean;
  type?: string;
};
type InputSelectProps = {
  noDataPlaceholder?: string;
  defaultValue?: string;
  label?: string;
  isPostalCode?: boolean;
  size?: string;
  radius?: string;
  secureTextEntry?: boolean;
  icon?: JSX.Element;
  disabled?: boolean;
  description?: string;
  onBlur?: () => void;
  onPressOut?: () => void;
  placeholder?: string;
  unit?: string;
  data?: { name: string; id: string | number; description?: string }[];
  required?: boolean;
  isSignIn?: boolean;
  type?: string;
  value?: string;
  onChange?: (_val: string) => void;
  error?: FieldError | undefined;
  errors?: string[];
};
export const InputSelect = ({
  name,
  icon,
  label,
  data,
  isSignIn,
  type,
  unit,
  placeholder,
  disabled,
  onBlur,
  noDataPlaceholder,
  defaultValue,
  onPressOut,
  isPostalCode,
  ...props
}: InputTextProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState, formState }) => {
        const { error } = fieldState;
        const errors = error
          ? Object.keys(error)?.filter(
              (item) => item !== "ref" && item !== "type"
            )
          : [];

        return (
          <SelectInput
            data={data}
            label={label}
            {...props}
            onChange={field.onChange}
            value={field.value}
          />
        );
      }}
    />
  );
};

export const SelectInput = ({
  icon,
  label,
  data,
  isSignIn,
  type,
  unit,
  placeholder,
  disabled,
  onBlur,
  noDataPlaceholder,
  defaultValue,
  onPressOut,
  value,
  onChange,
  isPostalCode,
  ...props
}: InputSelectProps) => {
  console.log(value, defaultValue);
  return (
    <div
      className={clsx(
        disabled ? "opacity-60" : "opacity-100",
        "w-full text-gray-400  "
      )}>
      {label && (
        <label className="flex">
          <div className="text-dark pb-1 text-sm ">{label}</div>{" "}
          {props.required && <div className="text-rose-500 pl-1">*</div>}
        </label>
      )}

      <Select
        defaultValue={defaultValue}
        value={value ?? ""}
        onValueChange={(e: any) => onChange && onChange(e)}>
        <SelectTrigger
          className={clsx(
            type === "filter"
              ? "w-full justify-between flex text-white-chart border-none bg-label"
              : "bg-transparent file:bg-transparent",
            "flex h-[38px] w-full rounded-md  text-gray-200 bg-gray border   border-border focus:right-0  px-3 py-2 text-sm file:border-  file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50",
            value || defaultValue ? "text-dark" : "text-border"
          )}>
          <SelectValue placeholder={placeholder ?? ""} />
        </SelectTrigger>
        <SelectContent className="bg-white text-dark  w-full border-border ">
          {data && data?.length > 0 ? (
            data?.map((item, idx) => (
              <SelectItem
                className="w-full  min-h-6 hover:bg-accent/50 hover:text-dark/80 text-dark"
                key={idx}
                value={item?.id?.toString()}>
                {item?.name}{" "}
                {item?.description && (
                  <span className="text-dark/60 text-xs">
                    ({item?.description})
                  </span>
                )}
              </SelectItem>
            ))
          ) : (
            <div className="w-full py-4 text-sm flex items-center justify-center min-h-6  text-gray-200">
              {noDataPlaceholder ?? "Brak danych"}
            </div>
          )}
        </SelectContent>
      </Select>
      <div>
        {props.error &&
          props.errors?.map((key, index) => (
            <div className="mt-1 text-sm text-rose-600" key={index}>
              {(props.error as any)[key]}
            </div>
          ))}
      </div>
    </div>
  );
};
