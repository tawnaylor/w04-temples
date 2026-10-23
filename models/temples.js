module.exports = (mongoose) => {
  const templeSchema = new mongoose.Schema(
    {
      temple_id: {
        type: Number,
        required: [true, 'temple_id is required'],
        min: [1, 'temple_id must be 1 or greater'],
        validate: {
          validator: Number.isInteger,
          message: 'temple_id must be a whole number',
        },
        unique: true,
        index: true,
      },
      name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        maxlength: [100, 'name must be 100 characters or fewer'],
      },
      location: {
        type: String,
        required: [true, 'location is required'],
        trim: true,
        maxlength: [150, 'location must be 150 characters or fewer'],
      },
      dedicated: {
        type: String,
        required: [true, 'dedicated is required'],
        trim: true,
        maxlength: [50, 'dedicated must be 50 characters or fewer'],
      },
      additionalInfo: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  return mongoose.model('temples', templeSchema);
};
