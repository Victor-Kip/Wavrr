export interface Post {
  id: number;
  author: {
    username: string;
    role: "user" | "artist";
  };
  content: string;
  post_type: "text" | "poll";
  poll_options: {
    votes: number[];
    options: string[];
  } | null;
  poll_votes?: Record<string, number> | null;
  authorId: number;
  is_pinned: boolean;
  like_count: number;
  comment_count: number;
  share_count: number;
  createdAt: string;
  updatedAt: string;
}
export interface PostCardProps {
  post: Post;
  onVote: (postId: number, optionIndex: number) => void;
  hasVoted?: boolean;
  isLiked?: boolean;
  onLike?: (postId: number) => void;
}
export interface CommentItem {
  id: number;
  user_id: number;
  text: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    dataValues?: {
      id?: number;
      username?: string;
      email?: string;
    };
  } | null;
  User?: {
    id?: number;
    username?: string;
    email?: string;
  };

  createdAt: string;
}
