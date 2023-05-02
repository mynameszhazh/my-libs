// import Koa from "koa"
import Koa from "../dist/bundle.es.js"
const app = new Koa();
let port = 3000

// response
app.use((ctx) => {
  ctx.body = "Hello Koa";
});

app.listen(port, () => {
  console.log('server runnint... port at', port)
});
