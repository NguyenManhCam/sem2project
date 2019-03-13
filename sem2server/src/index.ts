import {Sem2serverApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {Sem2serverApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new Sem2serverApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
