import { useState } from 'react';
import { commentsData } from '../data/mock.ts';
import type { CommentStateDataShape, IComment } from './types.ts';
import NestedComments from './NestedComments/NestedComments.tsx';

function transformDataForOperation(
  data: Array<IComment>
): CommentStateDataShape {
  /**
   * {
   *  comment_id: {
   *    ...data,
   *    children: []
   *   }
   * }
   *
   */
  let result: CommentStateDataShape = {};

  for (let comment of data) {
    if (!result[comment.comment_id]) {
      result[comment.comment_id] = {
        ...comment,
        children: [],
      };
    }

    // check in object
    if (comment.parent_comment_id) {
      if (result[comment.parent_comment_id]) {
        result[comment.parent_comment_id] = {
          ...result[comment.parent_comment_id],
          children: [
            ...(result[comment.parent_comment_id].children ?? []),
            comment.comment_id,
          ],
        };
      } else {
        // find it in whole array and add it to the result object along with updating
        // children array
        let foundParentInDataset = data.find(
          (cmt) => cmt.comment_id === comment.parent_comment_id
        );

        if (foundParentInDataset) {
          result[comment.parent_comment_id] = {
            ...foundParentInDataset,
            children: [comment.comment_id],
          };
        }
      }
    }
  }

  return result;
}

function NestedCommentsApp() {
  const [nestedCommentsData, setNestedCommentsData] =
    useState<CommentStateDataShape>(
      transformDataForOperation(commentsData as any)
    );

  console.log('nestedCommentsData>>', nestedCommentsData);

  const handleUpvote = (comment_id: number) => {
    let updatedCommentsData: CommentStateDataShape = {
      ...nestedCommentsData,
      [comment_id]: {
        ...nestedCommentsData[comment_id],
        upvotes: nestedCommentsData[comment_id].upvotes + 1
      }
    };

    setNestedCommentsData(updatedCommentsData);
  };

  const handleDownvote = (comment_id: number) => {
    let updatedCommentsData: CommentStateDataShape = {
      ...nestedCommentsData,
      [comment_id]: {
        ...nestedCommentsData[comment_id],
        downvotes: nestedCommentsData[comment_id].downvotes + 1
      }
    };

    setNestedCommentsData(updatedCommentsData);
  };

  const handleEdit = (updatedContent: string, comment_id: number) => {
    let updatedCommentsData: CommentStateDataShape = {
      ...nestedCommentsData,
      [comment_id]: {
        ...nestedCommentsData[comment_id],
        content: updatedContent,
      }
    };
    setNestedCommentsData(updatedCommentsData);
  };

  const handleReply = (newContent: string, comment_id: number, parent_comment_id: number) => {
    let updatedCommentsData: CommentStateDataShape = {
      ...nestedCommentsData,
      [parent_comment_id]: {
        ...nestedCommentsData[parent_comment_id],
        children: [...nestedCommentsData[parent_comment_id].children ?? [], comment_id],
      },
      [comment_id]: {
        content: newContent,
        upvotes: 0,
        downvotes: 0,
        parent_comment_id,
        comment_id,
        username: "Jatin",
        date_created: new Date().toDateString(),
        children: [],
      }
    };
    setNestedCommentsData(updatedCommentsData);
  };

  return <div
    className='p-4'
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    }}>
    <NestedComments
      data={nestedCommentsData}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      onEdit={handleEdit}
      onReply={handleReply}
    />
  </div>;
}

export default NestedCommentsApp;
