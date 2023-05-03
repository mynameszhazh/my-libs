import http from "http";
import context from "./context";
import request from "./request";
import response from "./response";
import statuses from "statuses";
import Stream from "stream";
import compose from "../packages/koa-compose";

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
    this.compose = compose;
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
    const fn = this.compose(this.middleware);
    // const fn = this.middleware[0];

    // if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
  compose(middleware: any[]) {
    throw new Error("Method not implemented.");
  }
  handleRequest(ctx, fnMiddleware: any) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = (err) => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    // onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    // return fnMiddleware(ctx);
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

function respond(ctx) {
  // allow bypassing koa
  // if (false === ctx.respond) return;

  // if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ("HEAD" === ctx.method) {
    if (!res.headersSent && !ctx.response.has("Content-Length")) {
      const { length } = ctx.response;
      if (Number.isInteger(length)) ctx.length = length;
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.response._explicitNullBody) {
      ctx.response.remove("Content-Type");
      ctx.response.remove("Transfer-Encoding");
      return res.end();
    }
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = "text";
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ("string" === typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
