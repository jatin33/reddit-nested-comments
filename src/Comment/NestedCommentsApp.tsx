import { useCallback, useReducer, useState } from 'react';
import { commentsData } from '../data/mock.ts';
import type { CommentStateDataShape, IComment, NormalizedCommentDataShape } from './types.ts';
import CommentContainer from './NestedComments/CommentContainer.tsx';

function transformDataForOperation(
  data: Array<IComment>
): NormalizedCommentDataShape {
  let result: NormalizedCommentDataShape = {
    comments: {},
    rootIds: [],
  };

  // pass 1 - add all comment to the map with their ids
  for (let comment of data) {
    result.comments[comment.comment_id] = {
      ...comment,
      children: [],
    }
  }

  // mapping children and rootIds
  for (let comment of data) {
    if (comment.parent_comment_id) {
      let parentNode = result.comments[comment.parent_comment_id];
      parentNode.children?.push(comment.comment_id);
      // avoid below since this takes memory and also takes iteration to spread array behind the scenes
      // if (parentNode) {
      //   result.comments[comment.parent_comment_id] = {
      //     ...parentNode,
      //     children: [...parentNode.children ?? [], comment.comment_id]
      //   }
      // }
    } else {
      result.rootIds = [
        ...result.rootIds,
        comment.comment_id,
      ]
    }

    // // check in object
    // if (comment.parent_comment_id) {
    //   if (result[comment.parent_comment_id]) {
    //     result[comment.parent_comment_id] = {
    //       ...result[comment.parent_comment_id],
    //       children: [
    //         ...(result[comment.parent_comment_id].children ?? []),
    //         comment.comment_id,
    //       ],
    //     };
    //   } else {
    //     // find it in whole array and add it to the result object along with updating
    //     // children array
    //     // seems inefficient - makes this logic close to O(n2)
    //     let foundParentInDataset = data.find(
    //       (cmt) => cmt.comment_id === comment.parent_comment_id
    //     );

    //     if (foundParentInDataset) {
    //       result[comment.parent_comment_id] = {
    //         ...foundParentInDataset,
    //         children: [comment.comment_id],
    //       };
    //     }
    //   }
  }

  return result;
}

function reducer(state: NormalizedCommentDataShape, action: {
  type: "UPVOTE" | "DOWNVOTE" | "EDIT";
  payload: Record<any, any>;
}) {

  const { type, payload } = action;

  switch (type) {
    case "UPVOTE":
      return {
        ...state,
        comments: {
          ...state.comments,
          [payload.comment_id]: {
            ...state.comments[payload.comment_id],
            upvotes: state.comments[payload.comment_id].upvotes + 1
          }
        }
      };
    case "DOWNVOTE":
      return {
        ...state,
        comments: {
          ...state.comments,
          [payload.comment_id]: {
            ...state.comments[payload.comment_id],
            downvotes: state.comments[payload.comment_id].downvotes + 1
          }
        }
      };

    case "EDIT":
      return {
        ...state,
        comments: {
          ...state.comments,
          [payload.comment_id]: {
            ...state.comments[payload.comment_id],
            content: payload.updatedContent,
          }
        }
      };
  }
}

function NestedCommentsApp() {
  // const [nestedCommentsData, setNestedCommentsData] =
  //   useState<NormalizedCommentDataShape>(
  //     transformDataForOperation(commentsData as any)
  //   );
  const [nestedCommentsData, dispatch] = useReducer(reducer, transformDataForOperation(commentsData as any))

  console.log('nestedCommentsData>>', nestedCommentsData);

  const handleUpvote = useCallback((comment_id: number) => {
    dispatch({ type: "UPVOTE", payload: { comment_id } })
  }, []);
  
  const handleDownvote = useCallback((comment_id: number) => {
    dispatch({ type: "DOWNVOTE", payload: { comment_id } })
  }, []);
  
  const handleEdit = useCallback((updatedContent: string, comment_id: number) => {
    dispatch({ type: "EDIT", payload: { comment_id, updatedContent } })
  }, []);

  const handleReply = (newContent: string, comment_id: number, parent_comment_id: number) => {
    // let updatedCommentsData: NormalizedCommentDataShape = {
    //   ...nestedCommentsData,
    //   [parent_comment_id]: {
    //     ...nestedCommentsData[parent_comment_id],
    //     children: [...nestedCommentsData[parent_comment_id].children ?? [], comment_id],
    //   },
    //   [comment_id]: {
    //     content: newContent,
    //     upvotes: 0,
    //     downvotes: 0,
    //     parent_comment_id,
    //     comment_id,
    //     username: "Jatin",
    //     date_created: new Date().toDateString(),
    //     children: [],
    //   }
    // };
    // setNestedCommentsData(updatedCommentsData);
  };

  const getCommentById = useCallback(
    (id: number) => nestedCommentsData.comments[id],
    [nestedCommentsData.comments]
  );

  return <div
    className='p-4'
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    }}>
    {nestedCommentsData.rootIds.map(id => (
      <CommentContainer
        key={id}
        comment={nestedCommentsData.comments[id]}    // Pass only this comment node
        getCommentById={getCommentById}  // optional for recursion
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onEdit={handleEdit}
      />
    ))}
  </div>;
}

export default NestedCommentsApp;
