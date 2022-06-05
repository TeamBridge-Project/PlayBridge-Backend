import mongoose from 'mongoose';

const userSchema: mongoose.Schema = new mongoose.Schema({
  uuid: String,
  email: String,
  password: String,
  nickname: String,
  profileIcon: String,
  gender: String,
  birthday: Date,
  agreeEmail: Boolean,
  credit: Number,
  playingGames: Array,
  aboutMe: String,
  refreshToken: String,
  registeredDate: Date
}, { versionKey: false });

export default mongoose.model('Users', userSchema);
