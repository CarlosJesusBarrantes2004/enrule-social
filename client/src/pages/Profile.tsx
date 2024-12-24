import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect, useState } from 'react';
import {
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
} from '../components';
import { Post, User } from '../types/types';
import { apiRequest } from '../api/axios';
import { fetchPosts, deletePost as removePost } from '../store/postSlice';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.user);
  const { posts } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);

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

  const handleLikePost = () => {};

  const getUser = async () => {
    setLoading(true);

    try {
      const response = await apiRequest({
        url: `/users/${id}`,
        method: 'GET',
        token: user?.token,
      });

      const { success } = response;

      if (success) setUserInfo(response.data as User);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async () => {
    setLoading(true);

    try {
      const response = await apiRequest({
        url: `/posts/user/${id}`,
        token: user?.token,
      });

      const { success, data } = response;

      if (success) {
        dispatch(fetchPosts(data as Post[]));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    getUser();
    getPosts();
  }, []);

  return (
    <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <TopBar></TopBar>
      <div className="w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full">
        <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
          <ProfileCard
            user={userInfo as User}
            requestFriend={requestFriend}
          ></ProfileCard>
          <div className="block lg:hidden">
            <FriendsCard friends={userInfo?.friends}></FriendsCard>
          </div>
        </div>
        <div className="flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
          {loading ? (
            <Loading></Loading>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user as User}
                deletePost={deletePost}
                likePost={handleLikePost}
              ></PostCard>
            ))
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">No post available</p>
            </div>
          )}
        </div>
        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          <FriendsCard friends={userInfo?.friends}></FriendsCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
