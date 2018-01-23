module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'parserOptions': {
    'ecmaVersion': 8,
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true
    }
  },
  'extends': 'eslint:recommended',
  'rules': {
    'indent': [
      'error', 2
    ],
    'linebreak-style': [
      'error', 'unix'
    ],
    'quotes': [
      'error', 'single'
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'semi': ['error', 'never']
  }
}
