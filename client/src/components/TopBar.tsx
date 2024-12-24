import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { TbSocial } from 'react-icons/tb';
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { useForm } from 'react-hook-form';
import { BsMoon, BsSunFill } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { setTheme } from '../store/themeSlice';
import { logout } from '../store/userSlice';

interface FormData {
  search: string;
}

const TopBar = () => {
  const { theme } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleTheme = () =>
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));

  const handleSearch = async (data: FormData) => console.log(data);

  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
      <Link to={'/'} className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
          <TbSocial></TbSocial>
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          Enrule
        </span>
      </Link>
      <form
        className="hidden md:flex items-center justify-center"
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          type="string"
          name="search"
          placeholder="Search..."
          styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
          register={register('search')}
        ></TextInput>
        <CustomButton
          title="Search"
          type="submit"
          containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
        ></CustomButton>
      </form>
      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <button onClick={handleTheme}>
          {theme ? <BsMoon></BsMoon> : <BsSunFill></BsSunFill>}
        </button>
        <div className="hidden lg:flex">
          <IoMdNotificationsOutline></IoMdNotificationsOutline>
        </div>
        <div>
          <CustomButton
            onClick={() => dispatch(logout())}
            title="Log Out"
            containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          ></CustomButton>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
