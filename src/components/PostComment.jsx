import { postComment } from "../Api";
import { useContext, useState } from "react";
import { UserContext } from "./UserProvider";
import { Link } from "react-router-dom";

import React from "react";

const PostComment = ({ setComments, article_id, setIsCommentDeleted }) => {
  const { user } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsCommentDeleted(false);
    setIsLoading(true);

    const commentBody = {
      username: user,
      body: newComment,
    };
    postComment(commentBody, article_id)
      .then((res) => {
        setIsLoading(false);

        const { comment } = res;
        setIsPosted(true);
        setComments((currentComments) => {
          return [comment, ...currentComments];
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setIsPosted(false);
        setErrorMessage("Comment was unable to post try again");
        console.log(error);
      });

    setNewComment("");
  };

  function handleComment(event) {
    setIsPosted(false);
    setNewComment(event.target.value);
  }

  if (isLoading) return <p>Uploading comment...</p>;

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {!user ? (
        <Link to="/UserLogin">
          <p> Please log in to comment </p>
        </Link>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            <input
              id="body"
              placeholder="Write comment"
              value={newComment}
              required
              onChange={handleComment}
            />
          </label>
          <button type="submit" id="submit-button">
            Post comment
          </button>
          {isPosted ? (
            <h2> Your comment has been listed successfully</h2>
          ) : null}
        </form>
      )}
    </div>
  );
};
export default PostComment;
