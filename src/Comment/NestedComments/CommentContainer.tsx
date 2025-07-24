import Comment from './Comment';
import React, { memo } from 'react';
import type { CommentStateDataShape, ExtendedComment } from '../types';

interface Props {
  comment: ExtendedComment;
  allComments: CommentStateDataShape;
  onUpvote: (id: number) => void;
  onDownvote: (id: number) => void;
  onEdit: (updatedContent: string, id: number) => void;
}

const CommentContainer = ({ comment, allComments, onUpvote, onDownvote, onEdit }: Props) => {
  return (
    <div style={{ paddingLeft: comment.parent_comment_id ? '1rem' : '0', borderLeft: comment.parent_comment_id ? '1px solid black' : 'none', marginTop: '10px' }}>
      <Comment comment={comment} onUpvote={onUpvote} onDownvote={onDownvote} onEdit={onEdit} />
      
      {comment?.children?.map(childId => (
        <CommentContainer
          key={childId}
          allComments={allComments}
          comment={allComments[childId]}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

const areEqual = (prevProps: Props, nextProps: Props): boolean => {
  const prevComment = prevProps.comment;
  const nextComment = nextProps.comment;
  
  const commentEqual = (
    prevComment.comment_id === nextComment.comment_id &&
    prevComment.content === nextComment.content &&
    prevComment.upvotes === nextComment.upvotes &&
    prevComment.downvotes === nextComment.downvotes &&
    prevComment.username === nextComment.username &&
    prevComment.date_created === nextComment.date_created &&
    prevComment.parent_comment_id === nextComment.parent_comment_id
  );
  
  const childrenEqual = (
    prevComment.children?.length === nextComment.children?.length &&
    (prevComment.children?.every((childId, index) => 
      childId === nextComment.children?.[index]
    ) ?? true)
  );
  
  return commentEqual && childrenEqual;
};

export default memo(CommentContainer, areEqual);
