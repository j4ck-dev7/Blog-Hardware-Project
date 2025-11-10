import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    creationDate: { type: Date, default: Date.now }
});

export default mongoose.model('Like', likeSchema);