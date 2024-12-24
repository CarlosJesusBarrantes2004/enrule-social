export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Friend {
  _id: string;
  firstName: string;
  lastName: string;
  photo?: {
    url: string;
    public_id: string;
  };
  profession: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: Friend[];
  views: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  photo?: { url: string; public_id: string };
  profession?: string;
  location?: string;
  token: string;
}

interface PostUser {
  _id: string;
  firstName: string;
  lastName: string;
  photo?: { url: string; public_id: string };
  location?: string;
}

export interface FriendRequest {
  _id: string;
  requestFrom: PostUser & { profession: string };
}

export interface SuggestedFriend extends PostUser {
  profession: string;
}

export interface Post {
  _id: string;
  user: PostUser;
  description: string;
  file?: {
    url: string;
    public_id: string;
  };
  likes?: string[];
  comments?: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Reply {
  user: PostUser;
  from: string;
  replyAt: string;
  comment: string;
  created_At: string;
  updated_At: string;
  likes: string[];
  _id: string;
}

interface Comment {
  _id: string;
  user: PostUser;
  postId: string;
  comment: string;
  from: string;
  likes?: string[];
  replies?: Reply[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Message {
  success: boolean;
  message: string;
}

export type ThemeType = 'light' | 'dark';

export type FriendRequestStatus = 'accepted' | 'declined';
