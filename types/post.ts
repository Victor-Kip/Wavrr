export interface Post {
  id: string;
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
  author_uuid: string | null;
  is_pinned: boolean;
  like_count: number;
  comment_count: number;
  share_count: number;
  createdAt: string;
  updatedAt: string;
}
export interface PostCardProps {
  post: Post;
  onVote: (postUuid: string, optionIndex: number) => void;
  hasVoted?: boolean;
  isLiked?: boolean;
  onLike?: (postUuid: string) => void;
}
export interface CommentItem {
  uuid: string;
  actor_uuid: string | null;
  actor_type: "user" | "artist";
  actor?: { username: string; type: "user" | "artist" } | null;
  text: string;
  user?: {
    uuid?: string;
    username?: string;
    email?: string;
    dataValues?: {
      uuid?: string;
      username?: string;
      email?: string;
    };
  } | null;
  User?: {
    uuid?: string;
    username?: string;
    email?: string;
  };

  createdAt: string;
}
