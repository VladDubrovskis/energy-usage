const Koa = require('koa');
const KoaRouter = require('koa-router');
const data = require('./data');

const PORT = process.env.PORT || 3000;

function createServer() {
  const server = new Koa();

  const router = new KoaRouter();
  router.get('/', (ctx, next) => {
    ctx.body = 'Hello world';
    next();
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  return server;
}

module.exports = createServer;

if (!module.parent) {
  data.initialize();
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}
