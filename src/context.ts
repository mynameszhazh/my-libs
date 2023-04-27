import delegates from "delegates";

const context = {};
delegates(context, "response").access("body");

export default context;
