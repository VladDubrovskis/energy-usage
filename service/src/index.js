const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaBodyParser = require('koa-bodyparser');

const moment = require('moment');
const data = require('./data');
const estimator = require('./estimator');

const PORT = process.env.PORT || 3000;

function createServer() {
  const server = new Koa();

  const router = new KoaRouter();

  router.get('/', async (ctx, next) => {
    const readings = await data.getAll();
    ctx.body = readings.map((reading) => {
      const readingCopy = reading;
      readingCopy.readingDate = readingCopy.reading_date;
      delete readingCopy.reading_date;
      return readingCopy;
    });
    next();
  });

  router.post('/', async (ctx, next) => {
    await data.insertRecord(
      ctx.request.body.cumulative,
      `${moment().format('YYYY-MM-DD')}T00:00:00.000Z`,
      'kWh',
    );
    ctx.status = 200;
    next();
  });

  router.get('/usage', async (ctx, next) => {
    const readings = await data.getAll();

    ctx.body = {
      estimate: estimator.parse(readings),
    };
    ctx.status = 200;
    next();
  });

  server.use(router.allowedMethods());
  server.use(koaBodyParser());
  server.use(router.routes());

  return server;
}

module.exports = createServer;

if (!module.parent) {
  data.initialize().then(() => {
    const server = createServer();
    server.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  });
}
