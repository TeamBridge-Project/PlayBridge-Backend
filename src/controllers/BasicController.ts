import express from 'express';

interface BasicController {
  controller: express.Router;
  init(): void;
}

export default BasicController;
