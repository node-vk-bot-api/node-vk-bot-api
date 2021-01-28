const Request = require('../request');
const Context = require('../context');

const CONFIRMATION_TYPE = 'confirmation';

module.exports = function (...args) {
  if (this.isStopped) {
    return;
  }

  const request = new Request(...args);

  if (
    request.body.type !== CONFIRMATION_TYPE
    && this.settings.secret
    && this.settings.secret !== request.body.secret
  ) {
    request.body = 'error';

    return;
  }

  if (request.body.type !== CONFIRMATION_TYPE) {
    request.body = 'ok';

    return this.next(new Context(request.body, this));
  }

  request.body = this.settings.confirmation.toString();
};
