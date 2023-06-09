import methods from "methods";
import Layer from "./layer";
import compose from "@xjh-mini-vue/koa-compose";

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
    var router = this;

    var dispatch = function dispatch(ctx, next) {
      var path = router.opts.routerPath || ctx.routerPath || ctx.path;
      var matched = router.match(path, ctx.method);
      var layerChain;

      if (ctx.matched) {
        ctx.matched.push.apply(ctx.matched, matched.path);
      } else {
        ctx.matched = matched.path;
      }

      ctx.router = router;

      if (!matched.route) return next();

      var matchedLayers = matched.pathAndMethod;

      layerChain = matchedLayers.reduce(function (memo, layer: any) {
        memo.push(function (ctx, next: () => any): any {
          ctx.routerName = layer.name;
          return next();
        });
        return memo.concat(layer.stack);
      }, []);

      // 提前执行所有的router
      return compose(layerChain)(ctx, next);
    };

    return dispatch;
  }
  match(path: any, method: any) {
    var layers = this.stack;
    var layer;
    var matched: any = {
      path: [],
      pathAndMethod: [],
      route: false,
    };

    for (var len = layers.length, i = 0; i < len; i++) {
      layer = layers[i];

      if (layer.match(path)) {
        matched.path.push(layer);

        if (layer.methods.length === 0 || ~layer.methods.indexOf(method)) {
          matched.pathAndMethod.push(layer);
          if (layer.methods.length) matched.route = true;
        }
      }
    }

    return matched;
  }

  allowedMethods() {
    return () => {};
  }
}

export default Router;
