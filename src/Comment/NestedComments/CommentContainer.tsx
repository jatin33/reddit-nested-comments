import Comment from './Comment';
import React, { memo } from 'react';
import type { ExtendedComment } from '../types';

interface Props {
  comment: ExtendedComment;
  getCommentById: (id: number) => ExtendedComment;
  onUpvote: (id: number) => void;
  onDownvote: (id: number) => void;
  onEdit: (updatedContent: string, id: number) => void;
}

const CommentContainer = ({ comment, getCommentById, onUpvote, onDownvote, onEdit }: Props) => {
  return (
    <div style={{ paddingLeft: comment.parent_comment_id ? '1rem' : '0', borderLeft: comment.parent_comment_id ? '1px solid black' : 'none', marginTop: '10px' }}>
      <Comment comment={comment} onUpvote={onUpvote} onDownvote={onDownvote} onEdit={onEdit} />
      
      {comment?.children?.map(childId => (
        <CommentContainer
          key={childId}
          comment={getCommentById(childId)}
          getCommentById={getCommentById}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default memo(CommentContainer);
