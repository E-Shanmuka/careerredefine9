import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    summary: {
      type: String,
      required: [true, 'Please provide a summary'],
      maxlength: [500, 'Summary cannot be more than 500 characters'],
    },
    image: {
      type: String,
      default: 'default-article.jpg',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search functionality
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Middleware to set publishedAt when article is published
articleSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
