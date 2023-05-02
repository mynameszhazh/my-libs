import http from "http";
import context from "./context";
import request from "./request";
import response from "./response";

export default class Koa {
  middleware: any[];
  context: any;
  request: any;
  response: any;
  // private _context: {};

  constructor() {
    // this._context = {};
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  use(fn) {
    this.middleware.push(fn);
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
  callback() {
    // todo 这里是 所有中间介执行的关键操作
    const fn = this.middleware[0];

    // if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
  handleRequest(ctx, fnMiddleware: any) {
    const res = ctx.res;
    res.statusCode = 404;
    // const onerror = (err) => ctx.onerror(err);
    // const handleResponse = () => respond(ctx);
    // onFinished(res, onerror);
    // return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    return fnMiddleware(ctx)
  }
  createContext(req: any, res: any) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
}
