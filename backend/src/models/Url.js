const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Please add an original URL'],
      match: [
        /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
        'Please add a valid URL with HTTP or HTTPS',
      ],
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined to be ignored by unique index
    },
    clicks: {
      type: Number,
      default: 0,
    },
    lastVisited: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // User is optional (allows anonymous shortening if required)
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to check if expired
UrlSchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

module.exports = mongoose.model('Url', UrlSchema);
