import delegates from "delegates";

const context: any = {
  onerror(err) {
    this.res.end("error, msg" + err);
  },
};
delegates(context, "response").access("body");

export default context;
