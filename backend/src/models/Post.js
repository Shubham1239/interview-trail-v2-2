import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    direction: { type: Number, enum: [-1, 1], required: true },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    company: { type: String, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    votes: [voteSchema],
    commentCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function transformPost(_doc, ret) {
        ret.id = ret._id;
        ret.excerpt = ret.body.length > 180 ? `${ret.body.slice(0, 180)}…` : ret.body;
        ret.score = (ret.votes || []).reduce(function sumVotes(sum, v) {
          return sum + v.direction;
        }, 0);
        delete ret._id;
        delete ret.__v;
        delete ret.votes;
      },
    },
  }
);

postSchema.index({ title: 'text', body: 'text', company: 'text', tags: 'text' });

export default mongoose.model('Post', postSchema);
