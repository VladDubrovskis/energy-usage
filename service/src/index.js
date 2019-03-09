const Koa = require('koa');
const KoaRouter = require('koa-router');
const data = require('./data');

const PORT = process.env.PORT || 3000;

function createServer() {
  const server = new Koa();

  const router = new KoaRouter();
  router.get('/', async (ctx, next) => {
    const readings = await data.getAll();
    ctx.body = readings.map(reading => {
      reading.readingDate = reading.reading_date;
      delete reading.reading_date;
      return reading;
    });
    next();
  });

  server.use(router.allowedMethods());
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
