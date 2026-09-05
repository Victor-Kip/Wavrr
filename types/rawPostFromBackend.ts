export default interface RawPostFromBackend {
  id: number;
  uuid: string;
  content: string;
  type: string;
  authorType: "user" | "artist" | null;
  userAuthor: {
    username: string;
    email: string;
  } | null;
  artistAuthor: {
    username: string;
    email: string;
  } | null;
  author_uuid: string | null;
  is_pinned: boolean;
  like_count: number;
  comment_count: number;
  share_count: number;
  poll_options: {
    votes: number[];
    options: string[];
  } | null;
  poll_votes?: Record<string, number> | null;
  createdAt: string;
  updatedAt: string;
}
