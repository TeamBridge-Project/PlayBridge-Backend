import UserModel from '../models/UserModel';

class UserRepository {
  public async find(filter: object, noOutput: object | null, limit: number | null, skip: number | null) {
    try {
      if (limit != null && skip != null) {
        const result = await UserModel.find(filter, noOutput).limit(limit).skip(skip).lean();
        return result;
      } else {
        const result = await UserModel.find(filter, noOutput).lean();
        return result;
      }
    } catch (e) {
      throw e;
    }
  }

  public async findOne(filter: object) {
    try {
      const result = await UserModel.findOne(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async create(query: object) {
    try {
      const result = await UserModel.create(query);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async updateOne(filter: object, query: object) {
    try {
      const result = await UserModel.updateOne(filter, query);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async deleteOne(filter: object) {
    try {
      const result = await UserModel.deleteOne(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export default UserRepository;
