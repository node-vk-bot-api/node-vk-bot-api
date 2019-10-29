module.exports = class ApiError extends Error {
  constructor(error) {
    super();

    this.message = 'ApiError';
    this.response = error;
  }
};
