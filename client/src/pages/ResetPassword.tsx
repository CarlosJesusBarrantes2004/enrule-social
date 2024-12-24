import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput, CustomButton, Loading } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { apiRequest } from '../api/axios';
import { setMessage } from '../store/messageSlice';
import { Message } from '../types/types';

interface FormData {
  email: string;
  newPassword: string;
}

const ResetPassword = () => {
  const { message } = useAppSelector((state) => state.message);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await apiRequest({
        url: '/users/password/request-reset',
        method: 'POST',
        data,
      });

      const { success, message } = response;

      dispatch(setMessage({ success, message } as Message));
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-bgColor flex items-center justify-center p-6">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg">
        <p className="text-ascent-1 text-lg font-semibold">Email address</p>
        <span className="text-sm text-ascent-2">
          Enter email address used during registration
        </span>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-4 flex flex-col gap-5"
        >
          <TextInput
            name="email"
            placeholder="email@example.com"
            type="email"
            styles="w-full rounded-lg"
            labelStyles="ml-2"
            register={register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email',
              },
            })}
            error={errors.email}
          ></TextInput>
          {message && (
            <span
              className={`text-sm ${
                !message.success ? 'text-[#f64949fe]' : 'text-[#2ba150fe]'
              } mt-0.5`}
            >
              {message.message}
            </span>
          )}
          {isSubmitting ? (
            <Loading></Loading>
          ) : (
            <CustomButton
              title="Reset password"
              type="submit"
              containerStyles="inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none"
            ></CustomButton>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
