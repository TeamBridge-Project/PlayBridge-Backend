import mongoose from 'mongoose';

class UserRepository {
  private userSchema: mongoose.Schema;
  public model: mongoose.Model<any, {}, {}, {}>;

  constructor() {
    this.userSchema = new mongoose.Schema({
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
      aboutMe: String
    }, { versionKey: false });
    this.model = mongoose.model('Users', this.userSchema);
  }

  public async find(filter: object) {
    try {
      const result = await this.model.find(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async findOne(filter: object) {
    try {
      const result = await this.model.findOne(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async create(query: object) {
    try {
      const result = await this.model.create(query);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async deleteOne(filter: object) {
    try {
      const result = await this.model.deleteOne(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export default UserRepository;
