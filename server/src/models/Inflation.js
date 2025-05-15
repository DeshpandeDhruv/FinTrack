const mongoose = require('mongoose');

const inflationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  value: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['historical', 'forecast'],
    required: true
  },
  confidence: {
    upper: Number,
    lower: Number
  },
  source: {
    type: String,
    required: true,
    default: 'FRED'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient date-based queries
inflationSchema.index({ date: 1, type: 1 });

const Inflation = mongoose.model('Inflation', inflationSchema);

module.exports = Inflation; 