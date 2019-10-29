module.exports = class ApiError extends Error {
  constructor(error) {
    super();

    this.message = JSON.stringify(error);
    this.response = error;
  }
};
