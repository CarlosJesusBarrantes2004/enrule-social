import { TbSocial } from 'react-icons/tb';
import { TextInput, Loading, CustomButton } from '../components';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { BgImage } from '../assets';
import { BsShare } from 'react-icons/bs';
import { ImConnection } from 'react-icons/im';
import { AiOutlineInteraction } from 'react-icons/ai';
import { apiRequest } from '../api/axios';
import { setMessage } from '../store/messageSlice';
import { Message } from '../types/types';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cPassword: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { message } = useAppSelector((state) => state.message);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await apiRequest({
        url: '/auth/signup',
        data,
        method: 'POST',
      });

      const { success, message } = response;

      dispatch(setMessage({ success, message } as Message));

      if (success)
        setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-bgColor flex justify-center items-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl">
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial></TbSocial>
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold">
              Enrule
            </span>
          </div>
          <p className="text-ascent-1 text-base font-semibold">
            Create your account
          </p>
          <form
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                type="text"
                name="firstName"
                label="First Name"
                placeholder="First Name"
                register={register('firstName', {
                  required: 'First name is required',
                })}
                error={errors.firstName}
                styles="w-full"
              ></TextInput>
              <TextInput
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                register={register('lastName', {
                  required: 'Last name is required',
                })}
                error={errors.lastName}
                styles="w-full"
              ></TextInput>
            </div>
            <TextInput
              type="email"
              name="email"
              label="Email address"
              placeholder="email@example.com"
              register={register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email',
                },
              })}
              error={errors.email}
              styles="w-full"
            ></TextInput>
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                type="password"
                name="password"
                label="Password"
                placeholder="********"
                register={register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                error={errors.password}
                styles="w-full"
              ></TextInput>
              <TextInput
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="********"
                register={register('cPassword', {
                  required: 'Confirm password is required',
                  validate: (value) => {
                    const { password } = getValues();

                    if (password != value) {
                      return 'Password do no match';
                    }
                  },
                })}
                error={errors.cPassword}
                styles="w-full"
              ></TextInput>
            </div>

            {message && (
              <span
                className={`text-sm ${
                  message.success ? 'text-[#2ba150fe]' : 'text-[#f64949fe]'
                } mt-0.5`}
              >
                {message.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading></Loading>
            ) : (
              <CustomButton
                title="Create Account"
                type="submit"
                containerStyles="inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none"
              ></CustomButton>
            )}
          </form>
          <p className="text-ascent-2 text-sm text-center">
            Already has an account?
            <Link
              to={'/login'}
              className="font-semibold ml-2 cursor-pointer text-[#065ad8]"
            >
              Login
            </Link>
          </p>
        </div>
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt="Bg Image"
              className="w-48 h-48 2xl:w-64 2xl:h-64 rounded-full object-cover"
            />
            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14}></BsShare>
              <span className="text-xs font-medium">Share</span>
            </div>
            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">Connect</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">Interact</span>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect with friends & have share for fun
            </p>
            <span className="text-sm text-white/80">
              Share memories with friends and the world
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
