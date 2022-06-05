import express, { Request, Response } from 'express';
import BasicController from "./BasicController";
import GameService from '../services/GameService';

class GameController implements BasicController {
  public controller: express.Router = express.Router();
  private gameService: GameService = new GameService();

  constructor() {
    this.init();
  }

  public init(): void {
    this.controller.get('/game', this.game);
  };

  public game = async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['Game']
    */
    const result: any = await this.gameService.findGame({}, { _id: 0 });
    res.json({
      result,
      errors: []
    });
  }
}

export default GameController;
