import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);