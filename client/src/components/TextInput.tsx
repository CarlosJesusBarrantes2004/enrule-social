import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface TextInputProps {
  type: string;
  placeholder?: string;
  styles?: string;
  label?: string;
  labelStyles?: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

const TextInput: React.FC<TextInputProps> = ({
  type,
  placeholder,
  styles,
  label,
  labelStyles,
  name,
  register,
  error,
}) => {
  return (
    <div className="w-full flex flex-col mt-2">
      {label && (
        <label
          htmlFor={name}
          className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}
        >
          {label}
        </label>
      )}
      <div>
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={`bg-secondary rounded border border-[#66666698] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] ${styles}`}
          {...register}
          aria-invalid={error ? 'true' : 'false'}
        />
      </div>
      {error && (
        <span className="text-xs text-[#f64949fe] mt-0.5">{error.message}</span>
      )}
    </div>
  );
};
export default TextInput;
