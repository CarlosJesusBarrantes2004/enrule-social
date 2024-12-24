import { useAppDispatch, useAppSelector } from '../hooks';
import {
  TopBar,
  ProfileCard,
  FriendsCard,
  CustomButton,
  TextInput,
  Loading,
  PostCard,
  EditProfile,
} from '../components';
import {
  Friend,
  FriendRequest,
  FriendRequestStatus,
  Post,
  SuggestedFriend,
  User,
} from '../types/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import { apiRequest } from '../api/axios';
import {
  addPost,
  fetchPosts,
  deletePost as removePost,
  updatePost,
} from '../store/postSlice';
import { addFriend, login } from '../store/userSlice';

interface FormData {
  description: string;
}

const Home = () => {
  const { user, edit } = useAppSelector((state) => state.user);
  const { posts } = useAppSelector((state) => state.post);
  const { message } = useAppSelector((state) => state.message);
  const dispatch = useAppDispatch();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<SuggestedFriend[]>(
    []
  );
  const [file, setFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handlePostSubmit = async (data: FormData) => {
    setPosting(true);

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      if (file) formData.append('file', file);

      const response = await apiRequest({
        url: '/posts/',
        method: 'POST',
        data: formData,
        token: user?.token,
        contentType: 'multipart/form-data',
      });

      const { success, error } = response;

      if (success) {
        dispatch(addPost(response.data as Post));
        setFile(null);
        reset();
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPosting(false);
    }
  };

  const loadPosts = async () => {
    setLoading(true);

    try {
      const response = await apiRequest({ url: '/posts/', token: user?.token });

      const { success, data } = response;

      if (success) dispatch(fetchPosts(data as Post[]));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await apiRequest({
        url: `/posts/${postId}`,
        method: 'DELETE',
        token: user?.token,
      });

      dispatch(removePost(postId));
    } catch (error) {
      console.log(error);
    }
  };

  const likePost = async (postId: string) => {
    try {
      const response = await apiRequest({
        url: `/posts/like/${postId}`,
        method: 'POST',
        token: user?.token,
      });

      const { success, data } = response;

      if (success) dispatch(updatePost(data as Post));
    } catch (error) {
      console.log(error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await apiRequest({
        url: '/users/friend/requests',
        token: user?.token,
        method: 'GET',
      });

      const { success, data } = response;

      if (success) {
        setFriendRequests(data as FriendRequest[]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadSuggestedFriends = async () => {
    try {
      const response = await apiRequest({
        url: '/users/friends/suggested',
        token: user?.token,
        method: 'GET',
      });

      const { success, data } = response;

      if (success) setSuggestedFriends(data as SuggestedFriend[]);
    } catch (error) {
      console.log(error);
    }
  };

  const requestFriend = async (friendId: string) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/users/friend/request',
        data: { requestTo: friendId },
        token: user?.token,
      });

      console.log(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await apiRequest({
        url: '/users/',
        method: 'GET',
        token: user?.token,
      });

      const { success, data } = response;

      if (success) {
        dispatch(login({ ...data.user, token: data.token } as User));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (
    requestId: string,
    status: FriendRequestStatus,
    newFriend: Friend
  ) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/users/friend/accept',
        data: { requestId, status },
        token: user?.token,
      });

      const { success } = response;

      if (success) {
        dispatch(addFriend(newFriend));
        await loadFriendRequests();
        await loadSuggestedFriends();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadPosts();
    loadFriendRequests();
    loadSuggestedFriends();
  }, []);

  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar></TopBar>
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard
              user={user as User}
              requestFriend={requestFriend}
            ></ProfileCard>
            <FriendsCard friends={user?.friends}></FriendsCard>
          </div>
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user?.photo?.url ?? NoProfile}
                  alt={user?.firstName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="What's on your mind?"
                  type="text"
                  name="description"
                  register={register('description', {
                    required: 'Write something about post',
                  })}
                  error={errors.description}
                ></TextInput>
              </div>
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
              <div className="flex items-center justify-between py-4">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    name="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BiImages></BiImages>
                  <span>Image</span>
                </label>
                <label
                  htmlFor="videoUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    name="file"
                    data-max-size="5120"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4, .wav"
                  />
                  <BiSolidVideo></BiSolidVideo>
                  <span>Video</span>
                </label>
                <label
                  htmlFor="vgiUpload"
                  className="flex items-center gap-1 textbase text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    name="file"
                    data-max-size="5120"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="vgiUpload"
                    accept=".gif"
                  />
                  <BsFiletypeGif></BsFiletypeGif>
                  <span>Gif</span>
                </label>
                <div>
                  {posting ? (
                    <Loading></Loading>
                  ) : (
                    <CustomButton
                      type="submit"
                      title="Post"
                      containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                    ></CustomButton>
                  )}
                </div>
              </div>
            </form>
            {loading ? (
              <Loading></Loading>
            ) : posts?.length > 0 && user ? (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  user={user}
                  deletePost={deletePost}
                  likePost={likePost}
                ></PostCard>
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No post available</p>
              </div>
            )}
          </div>
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span> Friend request</span>
                <span>{friendRequests.length}</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequests?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <Link
                      to={`/profile/${from._id}`}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={from.photo?.url ?? NoProfile}
                        alt={from?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      ></img>
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {from?.profession ?? 'No profession'}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1">
                      <CustomButton
                        title="Accept"
                        containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                        onClick={() =>
                          acceptFriendRequest(_id, 'accepted', from)
                        }
                      ></CustomButton>
                      <CustomButton
                        title="Deny"
                        onClick={() =>
                          acceptFriendRequest(_id, 'declined', from)
                        }
                        containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                      ></CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full bg-primary shadow-sm rounded-lg p-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                <span>Friend Suggestion</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={`/profile/${friend._id}`}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friend.photo?.url ?? NoProfile}
                        alt={friend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? 'No profession'}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1">
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                        onClick={() => requestFriend(friend._id)}
                      >
                        <BsPersonFillAdd
                          size={20}
                          className="text-[#0f52b0]"
                        ></BsPersonFillAdd>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {edit && <EditProfile></EditProfile>}
    </>
  );
};

export default Home;
