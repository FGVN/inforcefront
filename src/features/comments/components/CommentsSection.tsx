import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Comment } from '../../../models/comment';
import { AppDispatch } from '../../../app/store';
import { createComment, deleteComment } from '../commentsSlice';
import { fetchProductById } from '../../products/productSlice';
import './CommentsSection.css';

interface CommentsSectionProps {
  productId: number;
  existingComments: Comment[];
  productDetails: any; // Adjust to your actual product type
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ productId, existingComments, productDetails }) => {
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: 0, // Generate a unique ID; in practice, this should come from the backend
        productId,
        description: newComment,
        date: new Date().toISOString(),
      };

      // Dispatch the action to create the comment in the backend
      try {
        await dispatch(createComment({ productId, description: newComment })).unwrap();

        // Fetch the updated product details after the comment is added
        await dispatch(fetchProductById(productId)).unwrap();
      } catch (error) {
        console.error('Failed to add comment:', error);
      }

      // Clear the comment input
      setNewComment('');
    }
  };


  const handleDeleteComment = async (commentId: number) => {
    await dispatch(deleteComment(commentId));
    
    await dispatch(fetchProductById(productId)).unwrap();
  };


  return (
    <div className="comments-section">
      <div className="new-comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a new comment..."
        ></textarea>
        <button onClick={handleAddComment}>Send</button>
      </div>
      <ul className="comments-list">
        {existingComments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="comment-content">
              <p>{comment.description}</p>
              <span className="comment-time">
                {new Date(comment.date).toLocaleString()}
              </span>
              
            <button onClick={() => handleDeleteComment(comment.id)}className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsSection;
