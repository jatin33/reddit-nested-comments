export type IComment = {
  comment_id: number;
  username: string;
  content: string;
  upvotes: number;
  downvotes: number;
  date_created: string;
  parent_comment_id: number | null;
};

export interface ExtendedComment extends IComment {
  children: Array<number> | null;
}

export type CommentStateDataShape = Record<number, ExtendedComment>;

export type NormalizedCommentDataShape = {
  comments: CommentStateDataShape;
  rootIds: number[];
}