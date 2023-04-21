const Koa = require('koa');
const Router = require('koa-better-router');
const process = require('child_process');

const app = new Koa();

const router = Router().loadMethods();
router.get('trigger-ci.json', (ctx) => {
  const cmd = `
    cd ..;
    git checkout -- package-lock.json;
    git pull origin feature_dev;
    npm run i;
    npm run pm2;
    date;
  `;
  const result = process.execSync(cmd);
  console.log(result.toString());
  ctx.body = `${result}\n\n\nci done.`;
});
app.use(router.middleware());

app.listen(8123, '0.0.0.0', () => {
  console.log('server started: 0.0.0.0:8123');
});
