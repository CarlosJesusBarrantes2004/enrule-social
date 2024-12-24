import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import TextInput from './TextInput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import { login, updateProfile } from '../store/userSlice';
import { apiRequest } from '../api/axios';
import { User } from '../types/types';

interface FormData {
  firstName: string;
  lastName: string;
  profession: string;
  location: string;
}

const EditProfile = () => {
  const { user } = useAppSelector((state) => state.user);
  const { message } = useAppSelector((state) => state.message);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange', defaultValues: { ...user } });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      if (file) formData.append('file', file);

      const response = await apiRequest({
        url: '/users/',
        method: 'PUT',
        contentType: 'multipart/form-data',
        token: user?.token,
        data: formData,
      });

      const { success, error } = response;

      if (success) {
        const { data } = response;
        dispatch(login({ ...data.user, token: data.token } as User));
        setTimeout(() => dispatch(updateProfile(false)), 3000);
        setFile(null);
        reset();
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => dispatch(updateProfile(false));

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-[#000] opacity-70"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-between px-6 pt-5 pb-2">
            <label
              htmlFor="name"
              className="block font-medium text-xl text-ascent-1 text-left"
            >
              Edit profile
            </label>
            <button className="text-ascent-1" onClick={handleClose}>
              <MdClose size={22}></MdClose>
            </button>
          </div>
          <form
            className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
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
            <TextInput
              type="text"
              name="profession"
              label="Profession"
              placeholder="Profession"
              register={register('profession', {
                required: 'Profession is required',
              })}
              error={errors.lastName}
              styles="w-full"
            ></TextInput>
            <TextInput
              type="text"
              name="location"
              label="Location"
              placeholder="Location"
              register={register('location', {
                required: 'Location is required',
              })}
              error={errors.lastName}
              styles="w-full"
            ></TextInput>
            <label
              className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
              htmlFor="imgUpload"
            >
              <input
                type="file"
                name="file"
                className=""
                id="imgUpload"
                onChange={(e) => handleSelect(e)}
                accept=".jpg, .png, .jpeg"
              />
            </label>
            {message && (
              <span
                role="alert"
                className={`text-sm ${
                  !message.success ? 'text-[#f64949fe]' : 'text-[#2ba150fe]'
                } mt-0.5`}
              >
                {message.message}
              </span>
            )}
            <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
              {isSubmitting ? (
                <Loading></Loading>
              ) : (
                <CustomButton
                  type="submit"
                  containerStyles="inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none"
                  title="Submit"
                ></CustomButton>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
