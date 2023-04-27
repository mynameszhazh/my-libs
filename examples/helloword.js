import Koa from "koa"
const app = new Koa();
let port = 3000

// response
app.use((ctx) => {
  ctx.body = "Hello Koa";
});

app.listen(port, () => {
  console.log('server runnint... port at', port)
});
