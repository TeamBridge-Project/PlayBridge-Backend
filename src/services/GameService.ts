import GameRepository from "../repositories/GameRepository";

class GameService extends GameRepository {
  public findGame(filter: object, noOutput: object | null = null) {
    return this.find(filter, noOutput);
  }

  public createGame(query: object) {
    return this.create(query);
  }
}

export default GameService;
