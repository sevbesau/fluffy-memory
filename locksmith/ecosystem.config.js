const path = require('path');
const root = __dirname;

const project = 'locksmith';

module.exports = {
  apps: [
    {
      name: `${project}`,
      cwd: path.join(root, 'dist'),
      script: 'index.js',
    },
  ],
};
