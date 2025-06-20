const mongoose = require('mongoose');
const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood:{
    type: String,
    enum: [
      'happy',
      'sad',
      'angry',
      'neutral',
      'anxious',
      'excited',
      'calm',
      'stressed',
      'lonely',
      'grateful'
    ],

    default: 'neutral'
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  public: {
    type: Boolean,
    default: false
  }

})

module.exports = mongoose.model('Journal', journalSchema);