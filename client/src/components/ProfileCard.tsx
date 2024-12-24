import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { User } from '../types/types';
import { NoProfile } from '../assets';
import { LiaEditSolid } from 'react-icons/lia';
import { updateProfile } from '../store/userSlice';
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import moment from 'moment';
import { FaTwitterSquare } from 'react-icons/fa';

type Props = {
  user: User;
  requestFriend: (friendId: string) => void;
};

const ProfileCard = ({ user, requestFriend }: Props) => {
  const { user: data } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
        <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
          <Link to={`/profile/${user._id}`} className="flex gap-2">
            <img
              src={user.photo?.url ?? NoProfile}
              alt={user?.email}
              className="w-14 h-14 object-cover rounded-full"
            />
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="text-ascent-2">
                {user.profession ?? 'No profession'}
              </span>
            </div>
          </Link>
          <div className="">
            {user?._id === data?._id ? (
              <LiaEditSolid
                size={22}
                className="text-blue cursor-pointer"
                onClick={() => dispatch(updateProfile(true))}
              ></LiaEditSolid>
            ) : (
              <button
                className="bg-[#0444a430] text-sm text-white p-1 rounded"
                onClick={() => requestFriend(user._id)}
              >
                <BsPersonFillAdd
                  size={20}
                  className="text-[#0f52b6]"
                ></BsPersonFillAdd>
              </button>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <div className="flex gap-2 items-center text-ascent-2">
            <CiLocationOn className="text-xl text-ascent-1"></CiLocationOn>
            <span>{user?.location ?? 'Add location'}</span>
          </div>
          <div className="flex gap-2 items-baseline text-ascent-2">
            <BsBriefcase className="text-lg text-ascent-1"></BsBriefcase>
            <span>{user?.profession ?? 'Add profession'}</span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <p className="text-xl text-ascent-1 font-semibold">
            {user?.friends?.length}{' '}
            {user.friends.length === 1 ? 'Friend' : 'Friends'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Who viewed your profile</span>
            <span className="text-ascent-1 text-lg">{user?.views?.length}</span>
          </div>
          <span className="text-base text-blue">
            {user?.verified ? 'Verified account' : 'Not verified'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Joined</span>
            <span className="text-ascent-1 text-base">
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 py-4 pb-6">
          <p className="text-ascent-1 text-lg font-semibold">Social profile</p>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsInstagram className="text-xl text-ascent-1"></BsInstagram>
            <span>Instagram</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <FaTwitterSquare className="text-xl text-ascent-1"></FaTwitterSquare>
            <span>Twitter</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsFacebook className="text-xl text-ascent-1"></BsFacebook>
            <span>Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
