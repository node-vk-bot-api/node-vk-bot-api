class Request {
  constructor(...args) {
    if (args.length === 3) {
      this.request = args[0]; // req [express]
      this.response = args[1]; // res [express]
    } else {
      this.request = args[0].req; // req [koa]
      this.response = args[0].res; // res [koa]
    }
  }

  get body() {
    return this.request.body;
  }

  set body(body) {
    this.response.send(body);
  }
}

module.exports = Request;
