import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'CryptoEnthusiast',
      content: 'Great token economics! The exponential curve really incentivizes early adoption.',
      timestamp: '2024-03-15T10:30:00Z',
      likes: 12,
      dislikes: 1,
    },
    {
      id: '2',
      author: 'TokenTrader',
      content: 'The price impact is very reasonable for medium-sized trades. Perfect for active trading.',
      timestamp: '2024-03-15T09:15:00Z',
      likes: 8,
      dislikes: 2,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2" />
        Comments
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          placeholder="Share your thoughts about this token..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Post Comment
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{comment.author}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {comment.likes}
                </button>
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {comment.dislikes}
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}