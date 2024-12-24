import { Link } from 'react-router-dom';
import { Reply, User } from '../types/types';
import { NoProfile } from '../assets';
import moment from 'moment';
import { BiLike, BiSolidLike } from 'react-icons/bi';

interface ReplyCardProps {
  reply: Reply;
  user: User;
  commentId: string;
  likeComment: (commentId: string, replyId: string) => Promise<void>;
}

function ReplyCard({ reply, user, commentId, likeComment }: ReplyCardProps) {
  return (
    <div className="w-full py-3">
      <div className="flex gap-3 items-center mb-1">
        <Link to={`/profile/${reply.user._id}`}>
          <img
            src={reply.user.photo?.url ?? NoProfile}
            alt={reply.user.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link to={`/profile/${reply.user._id}`}>
            <p className="font-medium text-base text-ascent-1">
              {reply.user.firstName} {reply.user.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply.created_At ?? Date.now()).fromNow()}
          </span>
        </div>
      </div>
      <div className="ml-12">
        <div className="text-ascent-2">
          {reply.comment}
          <div className="mt-2 flex gap-6">
            <p
              className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
              onClick={() => likeComment(commentId, reply._id)}
            >
              {reply.likes.includes(user._id) ? (
                <BiSolidLike size={20} color="blue"></BiSolidLike>
              ) : (
                <BiLike size={20}></BiLike>
              )}
              {reply.likes.length} {reply.likes.length === 1 ? 'like' : 'likes'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReplyCard;
