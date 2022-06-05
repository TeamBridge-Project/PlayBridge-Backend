import GameModel from "../models/GameModel";

class GameRepository {
  public async find(filter: object, noOutput: object | null) {
    try {
      const result = await GameModel.find(filter, noOutput);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async findOne(filter: object) {
    try {
      const result = await GameModel.findOne(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async create(query: object) {
    try {
      const result = await GameModel.create(query);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async updateOne(filter: object, query: object) {
    try {
      const result = await GameModel.updateOne(filter, query);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async deleteOne(filter: object) {
    try {
      const result = await GameModel.deleteOne(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export default GameRepository;
