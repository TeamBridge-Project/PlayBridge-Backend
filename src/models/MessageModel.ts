import mongoose from 'mongoose';

const messageSchema: mongoose.Schema = new mongoose.Schema({
  id: String,
  from: String,
  to: String,
  content: {
    type: String,
    message: String
  }
}, { versionKey: false });

export default mongoose.model('Messages', messageSchema);
