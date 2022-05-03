const path = require('path');
const root = __dirname;

const project = 'anchor';

module.exports = {
  apps: [
    {
      name: `${project}-api`,
      cwd: path.join(root, 'dist'),
      script: 'index.js',
      env: {
        NODE_ENV: 'production'
      }
    },
  ],
};
