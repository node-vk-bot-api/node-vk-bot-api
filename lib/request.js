class Request {
  constructor(...args) {
    // if passed 3 args, than it's express (req, res, next)
    // else koa (ctx, next)
    if (args.length === 3) {
      this.request = args[0];
      this.response = args[1];
    } else {
      this.request = args[0].request;
      this.response = args[0].res;
    }
  }

  get body() {
    return this.request.body;
  }

  set body(body) {
    this.response.status = 200;
    this.response.statusCode = 200;

    this.response.end(body);
  }
}

module.exports = Request;
