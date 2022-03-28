import express from 'express';

interface BasicController {
  url: string;
  controller: express.Router;
  init(): void;
}

export default BasicController;
