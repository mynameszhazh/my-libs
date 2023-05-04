import methods from "methods";
import Layer from "./layer";

class Router {
  ctx: null;
  methods: any;
  opts: any;
  stack: any[];
  constructor(opts) {
    this.ctx = null;
    this.opts = opts;
    this.methods = ["HEAD", "OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"];
    this.stack = [];

    methods.forEach((method) => {
      this[method] = (name, path, middleware) => {
        var middleware;

        // 有多种不同方式进行值的传递
        if (typeof path === "string" || path instanceof RegExp) {
          middleware = Array.prototype.slice.call(arguments, 2);
        } else {
          middleware = Array.prototype.slice.call(arguments, 1);
          path = name;
          name = null;
        }

        this.register(path, [method], middleware, {
          name: name,
        });

        return this;
      };
    });
  }

  register(path: any, arg1: any[], middleware: any, opts: { name: any }) {
    opts = opts || {};

    var router = this;
    var stack = this.stack;

    // create route
    var route = new Layer(path, methods, middleware, {
      // end: opts.end === false ? opts.end : true,
      name: opts.name,
      // sensitive: opts.sensitive || this.opts.sensitive || false,
      // strict: opts.strict || this.opts.strict || false,
      // prefix: opts.prefix || this.opts.prefix || "",
      // ignoreCaptures: opts.ignoreCaptures,
    });

    if (this.opts.prefix) {
      route.setPrefix(this.opts.prefix);
    }
    stack.push(route);

    return route;
  }

  routes() {
    const fn = (ctx, next) => {
      this.ctx = ctx;
    };
    return fn;
  }

  allowedMethods() {
    return () => {};
  }
}

export default Router;
