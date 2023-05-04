import { pathToRegexp } from "path-to-regexp";

export default class Layer { opts: any;
  name: any;
  methods: any[];
  paramNames: any[];
  stack: any[];
  path: any;
  regexp: any;

  constructor(path, methods, middleware, opts) {
    this.opts = opts || {};
    this.name = this.opts.name || null;
    this.methods = [];
    this.paramNames = [];
    this.stack = Array.isArray(middleware) ? middleware : [middleware];

    methods.forEach((method) => {
      var l = this.methods.push(method.toUpperCase());
      if (this.methods[l - 1] === "GET") {
        this.methods.unshift("HEAD");
      }
    }, this);

    // ensure middleware is a function
    this.stack.forEach((fn) => {
      var type = typeof fn;
      if (type !== "function") {
        throw new Error(
          methods.toString() +
            " `" +
            (this.opts.name || path) +
            "`: `middleware` " +
            "must be a function, not `" +
            type +
            "`"
        );
      }
    }, this);

    this.path = path;
    this.regexp = pathToRegexp(path, this.paramNames, this.opts);
  }

  setPrefix(prefix: any) {
    if (this.path) {
      this.path = prefix + this.path;
      this.paramNames = [];
      this.regexp = pathToRegexp(this.path, this.paramNames, this.opts);
    }

    return this;
  }

  match(path) {
    return this.regexp.test(path);
  }
}
