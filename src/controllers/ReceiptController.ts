import express, { Request, Response } from 'express';
import BasicController from './BasicController';
import ReceiptService from '../services/ReceiptService';

class ReceiptController implements BasicController {
  public url: string = '/receipt';
  public controller: express.Router = express.Router();
  private receiptService: ReceiptService = new ReceiptService();

  constructor() {
    this.init();
  }

  init() {
    
  }
}

export default ReceiptController;
