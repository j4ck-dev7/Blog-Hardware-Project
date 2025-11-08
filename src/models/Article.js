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
    tags: {
        type: [ String ],
        enum: [ 'tag1', 'tag2', 'tag3' ],
        required: true
    }
})

export default mongoose.model('Article', articleSchema);