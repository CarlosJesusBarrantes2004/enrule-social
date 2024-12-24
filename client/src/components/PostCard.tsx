import { useState } from 'react';
import { Post, User, Comment } from '../types/types';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import moment from 'moment';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import Loading from './Loading';
import ReplyCard from './ReplyCard';
import { apiRequest } from '../api/axios';
import { useAppSelector } from '../hooks';

interface PostCardProps {
  post: Post;
  user: User;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
}

interface FormData {
  comment: string;
}

const CommentForm = ({
  user,
  postId,
  replyAt,
  getComments,
}: {
  user: User;
  postId: string;
  replyAt?: string;
  getComments: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const { message } = useAppSelector((state) => state.message);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await apiRequest({
        method: 'POST',
        url: replyAt
          ? `/posts/comment/reply/${postId}`
          : `/posts/comment/${postId}`,
        data: {
          comment: data.comment,
          from: `${user.firstName} ${user.lastName}`,
          replyAt,
        },
        token: user.token,
      });

      const { success } = response;

      if (success) {
        await getComments();
        reset();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-b border-[#66666645]"
    >
      <div className="w-full flex items-center gap-2 py-4">
        <img
          src={user.photo?.url ?? NoProfile}
          alt="User image"
          className="w-10 h-10 rounded-full object-cover"
        />
        <TextInput
          type="text"
          name="comment"
          styles="w-full rounded-full py-3"
          placeholder={replyAt ? `Reply @${replyAt}` : 'Comment this post'}
          register={register('comment', {
            required: 'Commnt can not be empty',
          })}
          error={errors.comment}
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
      <div className="flex items-end justify-end pb-2">
        {loading ? (
          <Loading></Loading>
        ) : (
          <CustomButton
            title="Submit"
            type="submit"
            containerStyles="bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm"
          ></CustomButton>
        )}
      </div>
    </form>
  );
};

const PostCard = ({ post, user, deletePost, likePost }: PostCardProps) => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[] | []>([] as Comment[]);
  const [loading, setLoading] = useState(false);
  const [replyComment, setReplyComment] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<string>('');

  const getComments = async (postId: string) => {
    setLoading(true);

    try {
      const response = await apiRequest({
        url: `/posts/comments/${postId}`,
        token: user.token,
      });

      const { success, data } = response;

      if (success) setComments(data as Comment[]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const likeComment = async (postId: string, replyId?: string) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: `/posts/comment/like/${postId}/${replyId ? replyId : ''}`,
        token: user.token,
      });

      const { success } = response;

      if (success) await getComments(post._id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-2 bg-primary p-4 rounded-xl">
      <div className="flex gap-3 items-center mb-2">
        <Link to={`/profile/${post.user._id}`}>
          <img
            src={post.user.photo?.url ?? NoProfile}
            alt={post.user.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        </Link>
        <div className="w-full flex justify-between">
          <div className="">
            <Link to={`/profile/${post.user._id}`}>
              <p className="font-medium text-lg text-ascent-1">
                {post.user.firstName} {post.user.lastName}
              </p>
            </Link>
            <span className="text-ascent-2">{post.user.location}</span>
          </div>
          <span className="text-ascent-2">
            {moment(post.createdAt ?? new Date()).fromNow()}
          </span>
        </div>
      </div>
      <div>
        <p className="text-ascent-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {showAll || post.description.length <= 301
            ? post.description
            : post.description.slice(0, 300)}

          {post.description.length > 301 && (
            <span
              className="text-blue ml-2 font-medium cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show less' : 'Show more'}
            </span>
          )}
        </p>
        {post.file && (
          <img
            src={post.file.url}
            alt="post image"
            className="w-full mt-2 rounded-lg"
          />
        )}
      </div>
      <div className="mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]">
        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => likePost(post._id)}
        >
          {post.likes?.includes(user._id) ? (
            <BiSolidLike size={20} color="blue"></BiSolidLike>
          ) : (
            <BiLike size={20}></BiLike>
          )}
          {post.likes?.length}{' '}
          {post.likes && post.likes?.length === 1 ? 'Like' : 'Likes'}
        </p>
        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            getComments(post._id);
            setShowComments(!showComments);
          }}
        >
          <BiComment size={20}></BiComment>
          {post.comments?.length} Comments
        </p>
        {user._id === post.user._id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={() => deletePost(post._id)}
          >
            <MdOutlineDeleteOutline size={20}></MdOutlineDeleteOutline>
            <span>Delete</span>
          </div>
        )}
      </div>
      {showComments && (
        <div className="w-full mt-4 border-t border-[#66666645] pt-4">
          <CommentForm
            user={user}
            postId={post._id}
            getComments={() => getComments(post._id)}
          ></CommentForm>
          {loading ? (
            <Loading></Loading>
          ) : comments.length > 0 ? (
            comments?.map((comment) => (
              <div key={comment._id} className="w-full py-2">
                <div className="flex gap-3 items-center mb-1">
                  <Link to={`/profile/${comment.user._id}`}>
                    <img
                      src={comment.user.photo?.url ?? NoProfile}
                      alt={comment.user.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/profile/${comment.user._id}`}>
                      <p className="font-medium text-base text-ascent-1">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                    </Link>
                    <span className="text-ascent-2 text-sm">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="ml-12">
                  <p className="text-ascent-2">{comment.comment}</p>
                  <div className="mt-2 flex gap-6">
                    <p
                      className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
                      onClick={() => likeComment(comment._id)}
                    >
                      {comment.likes?.includes(user._id) ? (
                        <BiSolidLike size={20} color="blue"></BiSolidLike>
                      ) : (
                        <BiLike size={20}></BiLike>
                      )}
                      {comment.likes?.length}{' '}
                      {comment.likes?.length === 1 ? 'Like' : 'Likes'}
                    </p>
                    <span
                      className="text-blue cursor-pointer"
                      onClick={() =>
                        setReplyComment((replyComment) =>
                          replyComment === '' ? comment._id : ''
                        )
                      }
                    >
                      Reply
                    </span>
                  </div>
                  {replyComment === comment._id && (
                    <CommentForm
                      user={user}
                      postId={comment._id}
                      replyAt={comment.from}
                      getComments={() => getComments(post._id)}
                    ></CommentForm>
                  )}
                </div>
                <div className="py-2 px-8 mt-6">
                  {comment.replies && comment.replies.length > 0 && (
                    <p
                      className="text-base text-ascent-1 cursor-pointer"
                      onClick={() =>
                        setShowReply((showReply) =>
                          showReply ? '' : comment._id
                        )
                      }
                    >
                      Show replies ({comment.replies?.length})
                    </p>
                  )}
                  <>
                    {showReply === comment._id &&
                      comment.replies?.map((reply) => (
                        <ReplyCard
                          key={reply._id}
                          reply={reply}
                          user={user}
                          commentId={comment._id}
                          likeComment={likeComment}
                        ></ReplyCard>
                      ))}
                  </>
                </div>
              </div>
            ))
          ) : (
            <span className="flex text-sm py-4 text-ascent-2 text-center">
              No comments, be first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
