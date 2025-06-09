import { memo, useState } from 'react';
import type { CommentStateDataShape, ExtendedComment, NormalizedCommentDataShape } from '../types';

interface Props {
  // replyMode: boolean;
  // setReplyMode: React.Dispatch<React.SetStateAction<boolean>>;
  comment: ExtendedComment;
  onUpvote: (comment_id: number) => void;
  onDownvote: (comment_id: number) => void;
  onEdit: (updatedContent: string, comment_id: number) => void;
  // onReply: (newContent: string, comment_id: number, parent_comment_id: number) => void;
}

function Comment({
  // comment_id,
  // username,
  // upvotes,
  // downvotes,
  // content,
  // date_created,
  comment,
  // replyMode,
  // setReplyMode,
  onDownvote,
  onUpvote,
  onEdit,
  // onReply,
}: Props) {
  const { comment_id, username, upvotes, downvotes, content, date_created } = comment;
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [repliedContent, setRepliedContent] = useState("");

  return (
    <div>
      <div style={{
        backgroundColor: "lightblue",
        padding: "4px"
      }}>
        {editMode ? (
          <div className="flex" style={{
            width: "100%",
            alignItems: "end"
          }}>
            <textarea
              value={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
              }}
              style={{
                flexBasis: "80%"
              }}
              rows={3}
            />
            <button
              onClick={() => {
                onEdit(editedContent, comment_id);
                setEditMode(s => !s);
              }}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <p>{content}</p>
        )}

        <p>Votes: {upvotes - downvotes}</p>
        <div className="flex" style={{
          gap: "4px"
        }}>
          <p>{new Date(date_created).toLocaleDateString()}</p>
          <p>by {username}</p>
        </div>
        <div className="flex" style={{
          gap: "4px"
        }}>
          <button
            onClick={() => {
              onUpvote(comment_id);
            }}
          >
            Upvote
          </button>
          <button
            onClick={() => {
              onDownvote(comment_id);
            }}
          >
            Downvote
          </button>
          {/* <button onClick={() => {
            setReplyMode(s => !s);
          }}>
            {replyMode ? "Hide Replies" : "Reply"}
          </button> */}
          <button
            onClick={() => {
              setEditMode((s) => !s);
            }}
          >
            {editMode ? 'Cancel Edit' : 'Edit'}
          </button>
          <button>Delete</button>
        </div>
      </div>
      {/* <div>
        {replyMode
          ? <div>
            <div className="flex" style={{
              width: "100%",
              alignItems: "center",
              gap: "4px",
              paddingTop: "8px",
              paddingBottom: "8px"
            }}>
              <textarea
                value={repliedContent}
                onChange={(e) => {
                  setRepliedContent(e.target.value);
                }}
                style={{
                  flexBasis: "80%"
                }}
                rows={3}
              />
              <button
                onClick={() => {
                  if (repliedContent.length > 0) {
                    onReply(repliedContent, Date.now(), comment_id);
                    setRepliedContent("");
                  }
                }}
              >
                Submit Reply
              </button>
            </div>
          </div>
          : null}
      </div> */}
    </div>
  );
}

export default memo(Comment);
