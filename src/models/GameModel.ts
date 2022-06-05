import mongoose from 'mongoose';

const gameSchema: mongoose.Schema = new mongoose.Schema({
  id: String,
  name: String
}, { versionKey: false });

export default mongoose.model('Games', gameSchema);