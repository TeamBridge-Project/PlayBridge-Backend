import http from 'http';
import Debug from 'debug';
import { AddressInfo } from 'net';
import app from './app';

const debug: Debug.Debugger = Debug('backend:server');

const port: number = 3000;
app.set('port', port);

const server: http.Server = http.createServer(app);

function onError(error: { syscall: string; code: any; }): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind: string = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening(): void {
  const addr: string | AddressInfo | null = server.address();
  const bind: string = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr!.port}`;
  debug(`Listening on ${bind}`);
  console.log(`Listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
