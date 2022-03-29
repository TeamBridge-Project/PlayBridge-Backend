import mongoose from 'mongoose';

const userSchema: mongoose.Schema = new mongoose.Schema({
  email: String,
  uid: String,
  password: String,
  nickname: String,
  tel: String,
  profileIcon: String,
  gender: String,
  birthday: Date,
  agreeSms: Boolean,
  agreeEmail: Boolean,
  credit: Number,
  rank: Array,
  playingGames: Array,
  gameFee: Array,
  aboutMe: String,
  refreshToken: String
}, { versionKey: false });

export default mongoose.model('Users', userSchema);