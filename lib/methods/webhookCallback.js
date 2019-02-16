const Request = require('../request');
const Context = require('../context');
const { EVENT_TYPES, WEB_HOOK_RESPONSES } = require('../constants');

module.exports = function (...args) {
  const request = new Request(...args);

  if (
    request.body.type !== EVENT_TYPES.CONFIRMATION
    && this.settings.secret
    && this.settings.secret !== request.body.secret
  ) {
    request.body = WEB_HOOK_RESPONSES.FAILED;

    return;
  }

  if (request.body.type !== EVENT_TYPES.CONFIRMATION) {
    request.body = WEB_HOOK_RESPONSES.SUCCESS;

    return this.next(new Context(request.body, this));
  }

  request.body = this.settings.confirmation.toString();
};
