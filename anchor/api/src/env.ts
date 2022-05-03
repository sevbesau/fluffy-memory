import path from 'path';

const env = {
  MONGO_URI: 'mongodb://127.0.0.1:27017/anchor',
  API_KEY: 'secret',
  PROJECTS_ROOT: path.join(__dirname, '..', '..', '..'),
  REPO_ROOT: path.join(__dirname, '..', '..', '..', '..'),
  NGINX_ROOT: path.join(__dirname, '..', '..', 'nginx'),
  WWW_ROOT: path.join(__dirname, '..', '..', 'www'),
  PORT: '8080',
};

if (process.env.NODE_ENV == 'production') {
  env.NGINX_ROOT = path.join('/', 'etc', 'nginx');
  env.WWW_ROOT = path.join('/', 'var', 'www');
  env.API_KEY = 'nope ;)';
}

// merge the env vars on the process.env object
process.env = {
  ...process.env,
  ...env,
};
