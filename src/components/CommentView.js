import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Comment from "./Comment";
import "./CommentView.css";
import firebase from "firebase";
import moment from "moment";

function CommentView({ postId, user }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    db.collection("comments")
      .where("postId", "==", postId)
      .orderBy("postedOn", "desc")
      .onSnapshot((snapshot) =>
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, [postId]);
  const [input, setInput] = useState("");
  const postComment = (e) => {
    e.preventDefault();
    db.collection("comments").add({
      postId: postId,
      postedBy: db.collection("users").doc(user.uid),
      postedOn: firebase.firestore.FieldValue.serverTimestamp(),
      comment: input,
    });
    setInput("");
  };
  return (
    <div className="commentView">
      <div className="commentView__header">
        <h1>Comments</h1>
      </div>
      <div className="commentView__container">
        {comments.map((comment) => (
          <Comment
            userData={comment.data.postedBy}
            postedOn={moment(comment.data.postedOn?.toDate()).fromNow()}
            comment={comment.data.comment}
            key={comment.id}
          />
        ))}
      </div>
      <form onSubmit={postComment}>
        <div className="postComment">
          <input
            placeholder="Add a comment"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={!input} className="Comment__button">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CommentView;
