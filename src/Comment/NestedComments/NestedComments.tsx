import type { CommentStateDataShape } from '../types';
import Comment from './Comment';

type Props = {
  data: CommentStateDataShape;
  onUpvote: (comment_id: number) => void;
  onDownvote: (comment_id: number) => void;
  onEdit: (updatedContent: string, comment_id: number) => void;
  onReply: (newContent: string, comment_id: number, parent_comment_id: number) => void;
};

function NestedComments({ data, onDownvote, onEdit, onUpvote, onReply }: Props) {
  return Object.keys(data).map((commentId) => {
    return <Comment 
              {...data[commentId as any]} 
              overallData={data} 
              onDownvote={onDownvote} 
              onEdit={onEdit} 
              onUpvote={onUpvote}
              onReply={onReply} 
            />;
  });
}

export default NestedComments;
