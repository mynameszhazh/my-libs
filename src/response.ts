const response: any = {
  get body() {
    return this._body;
  },
  set body(val) {
    const original = this._body;
    this._body = val;
    // no content
    // if (null == val) {
    //   if (!statuses.empty[this.status]) this.status = 204;
    //   if (val === null) this._explicitNullBody = true;
    //   this.remove("Content-Type");
    //   this.remove("Content-Length");
    //   this.remove("Transfer-Encoding");
    //   return;
    // }

    // set the status
    if (!this._explicitStatus) this.status = 200;

    // set the content-type only if not yet set
    const setType = !this.has("Content-Type");

    // string
    if ("string" === typeof val) {
      if (setType) this.type = /^\s*</.test(val) ? "html" : "text";
      this.length = Buffer.byteLength(val);
      return;
    }

    // json
    // this.remove("Content-Length");
    // this.type = "json";
  },
  set length(n) {
    if (!this.has("Transfer-Encoding")) {
      this.set("Content-Length", n);
    }
  },

  /**
   * Return parsed response Content-Length when present.
   *
   * @return {Number}
   * @api public
   */

  has(field) {
    return typeof this.res.hasHeader === "function"
      ? this.res.hasHeader(field)
      : // Node < 7.7
        field.toLowerCase() in this.headers;
  },

  get headerSent () {
    return this.res.headersSent
  },

  set (field, val) {
    if (this.headerSent) return

    if (arguments.length === 2) {
      if (Array.isArray(val)) val = val.map(v => typeof v === 'string' ? v : String(v))
      else if (typeof val !== 'string') val = String(val)
      this.res.setHeader(field, val)
    } else {
      for (const key in field) {
        this.set(key, field[key])
      }
    }
  },
};

export default response;
