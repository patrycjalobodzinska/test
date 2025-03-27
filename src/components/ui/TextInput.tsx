import clsx from "clsx";
import { CheckCircle2, ClipboardCopy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldError } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { JSX } from "react/jsx-runtime";

type InputTextProps = {
  name: string;
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
  required?: boolean;
  max?: number;
  canCopyText?: boolean;
  isPassword?: boolean;
  showHidePassword?: boolean;
  min?: number;
  customError?: FieldError;
  type?: string;
  onlyLeters?: boolean;
};
export const InputText = ({ name, ...props }: InputTextProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState }) => {
        const error = fieldState.error;
        const errors = error
          ? Object.keys(error).filter((key) => key !== "ref" && key !== "type")
          : [];

        return (
          <BaseInputText {...props} {...field} error={error} errors={errors} />
        );
      }}
    />
  );
};

export type RequirementsType = {
  re: RegExp;
  label: string;
};

type BaseInputTextProps = {
  value?: any;
  onChange?: (val: any) => void;
  onBlur?: () => void;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  isPassword?: boolean;
  showHidePassword?: boolean;
  canCopyText?: boolean;
  min?: number;
  max?: number;
  onlyLeters?: boolean;
  error?: FieldError;
  errors?: string[];
  className?: string;
};

export const BaseInputText = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  disabled,
  required,
  type = "text",
  min,
  max,
  onlyLeters,
  showHidePassword,
  canCopyText,
  isPassword,
  error,
  errors,
}: BaseInputTextProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePhoneFormat = (input: string) => {
    const digitsOnly = input.replace(/(?!^\+)\D/g, "");
    const firstPart = digitsOnly.slice(0, 3);
    const secondPart = digitsOnly.slice(3, 6);
    const thirdPart = digitsOnly.slice(6, 9);
    let formatted = `${firstPart}`;
    if (secondPart) formatted += ` ${secondPart}`;
    if (thirdPart) formatted += ` ${thirdPart}`;
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (type === "phoneNumber") val = handlePhoneFormat(val);
    if (onlyLeters) val = val.replace(/[^a-zA-Z0-9@._-]/g, "");
    if (type === "number") {
      val = val.replace(/[^0-9.]/g, "");
    }

    onChange?.(val);
  };

  const requirements = [
    { re: /^.{8,}$/, label: "Hasło musi zawierać conajmniej 8 znaków" },
    { re: /[0-9]/, label: "Hasło musi zawierać conajmniej jedną cyfrę" },
    { re: /[A-Z ]/, label: "Hasło musi zawierać dużą literę" },
    {
      re: /[\!\@\#\$\%\^\&\*\(\)\_\+\[\]\{\}\|\;\:\,\.\<\>\?]/,
      label: "Hasło musi zawierać znak specjalny",
    },
  ];

  const checks = isPassword
    ? requirements.map((r, i) => (
        <PasswordRequirement
          key={i}
          label={r.label}
          meets={r.re.test(value || "")}
        />
      ))
    : null;

  return (
    <div className={clsx(disabled && "opacity-60", "w-full flex flex-col")}>
      {label && (
        <label htmlFor={name} className="text-dark text-sm pb-2">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className={showHidePassword ? "relative" : ""}>
        <input
          name={name}
          id={name}
          value={value ?? ""}
          type={
            showHidePassword && isPasswordVisible
              ? "text"
              : type === "phoneNumber"
              ? "text"
              : type
          }
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          className={clsx(
            "without-ring text-dark bg-gray placeholder:text-border border-border w-full px-2 py-2 border rounded-md",
            error && "border-rose-400"
          )}
          autoComplete="off"
        />
        {showHidePassword &&
          (isPasswordVisible ? (
            <Eye
              onClick={() => setIsPasswordVisible(false)}
              className="cursor-pointer absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          ) : (
            <EyeOff
              onClick={() => setIsPasswordVisible(true)}
              className="cursor-pointer absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          ))}
        {canCopyText && (
          <ClipboardCopy
            onClick={() => navigator.clipboard.writeText(value ?? "")}
            className={clsx(
              showHidePassword ? "right-10" : "right-3",
              "absolute top-2.5 cursor-pointer text-gray-400"
            )}
            size={20}
          />
        )}
      </div>
      {error &&
        errors?.map((key, idx) => (
          <div className="mt-1 text-sm text-rose-600" key={idx}>
            {(error as any)[key]}
          </div>
        ))}
      {isPassword && <div className="mt-4">{checks}</div>}
    </div>
  );
};

const PasswordRequirement = ({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) => (
  <div
    className={clsx(
      meets ? "text-green-400" : "text-gray-500",
      "flex items-center gap-2 text-sm"
    )}>
    <CheckCircle2 size={15} />
    <span>{label}</span>
  </div>
);
