import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    type: {
        type: String, required: true, enum: ['paragraph', 'image'],
    },
    value: {
        type: String, required: () => {
            return contentSchema.type === 'paragraph';
        }
    },
    url: {
        type: String, required: () => {
            return contentSchema.type === 'image';
        }
    },
    legend: {
        type: String, required: () => {
            return contentSchema.type === 'image';
        }
    },
    alt: {
        type: String, required: () => {
            return contentSchema.type === 'image';
        }
    }
}, { _id: false });

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    creationDate: { type: Date, default: Date.now },
    author: { type: String, required: true },
    content: [contentSchema],
    banner: { type: String, required: true },
    tags: {
        type: [ String ],
        required: true
    },
    planRole: {
        type: String,
        enum: [ 'free', 'basic', 'intermediate', 'premium' ],
        default: 'free'
    }
})

export default mongoose.model('Article', articleSchema);