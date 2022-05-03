import express, { Router } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { Dirent, PathLike } from 'fs';
import child_process from 'child_process';
import { promisify } from 'util';
import portfinder from 'portfinder';

import HttpException from '../exceptions/httpException';
import checkToken from '../middlewares/token';

import envalidate from '@siliconminds/envalidate';
envalidate(['REPO_ROOT', 'PROJECTS_ROOT', 'NGINX_ROOT', 'WWW_ROOT']);

const router: Router = express.Router();

const exec = promisify(child_process.exec);

router.get('/', (_req, res) => res.send('Anchor api up and running!'));

router.get('/ping', (_req, res) => res.send('pong'));

const get_dirs = async (dir: PathLike) =>
  (await fs.readdir(dir, { withFileTypes: true }))
    .filter((dirent: Dirent) => dirent.isDirectory())
    .map((dirent: Dirent) => dirent.name);

const git_pull = async () => {
  try {
    const { stdout } = await exec('git pull', {
      cwd: process.env.REPO_ROOT,
    });
    console.log(stdout);
  } catch (error) {
    throw new HttpException(500, `git pull failed:\n${error.stdout}\n${error.stderr}`);
  }
};

const install_packages = async () => {
  try {
    const { stdout } = await exec('NODE_ENV=development npm install', {
      cwd: process.env.REPO_ROOT,
    });
    console.log(stdout);
  } catch (error) {
    throw new HttpException(500, `Install packages failed:\n${error.stdout}\n${error.stderr}`);
  }
};

const build_service = async (cwd: string) => {
  try {
    const { stdout } = await exec('npm run build', { cwd });
    console.log(stdout);
  } catch (error) {
    throw new HttpException(500, `Build failed:\n${error.stdout}\n${error.stderr}`);
  }
};

const install_service = async (cwd: string) => {
  try {
    // get the name for the service
    const filename = cwd.split(path.sep).splice(-2).join('-');
    // look for an nginx config
    let config = (await fs.readFile(path.join(cwd, 'nginx.conf'))).toString();
    // proxy to port
    const portRegex = /\{\{\s*port\s*\}\}/g;
    let port: string;
    if (portRegex.test(config)) {
      port = (await portfinder.getPortPromise({ port: 3000, stopPort: 4000 })).toString();
      config = config.replace(portRegex, port);
    }
    // host static files
    const rootRegex = /\{\{\s*root\s*\}\}/g;
    if (rootRegex.test(config)) {
      // set the root in the ngnix config
      config = config.replace(rootRegex, path.join(process.env.WWW_ROOT, filename));
      // install service dist at root
      await fs.cp(path.join(cwd, 'dist'), path.join(process.env.WWW_ROOT, filename), { recursive: true, force: true });
    }
    // install the nginc config
    await fs.writeFile(path.join(process.env.NGINX_ROOT, 'sites-available', filename), config);
    try {
      await fs.symlink(
        path.join(process.env.NGINX_ROOT, 'sites-available', filename),
        path.join(process.env.NGINX_ROOT, 'sites-enabled', filename),
      );
    } catch (error) {
      if (error.code != 'EEXIST' || error.syscall != 'symlink') throw error;
    }
    // restart nginx
    await exec('systemctl restart nginx');
    return port;
  } catch (error) {
    if (error.code == 'ENOENT') throw new HttpException(500, `Install failed:\nNo nginx.conf found`);
    console.log(error);
    throw new HttpException(500, `Install failed:\n${error.stdout}\n${error.stderr}`);
  }
};

const restart_service = async (cwd: string, port: string) => {
  try {
    await exec(`PORT=${port} pm2 restart ecosystem.config.js`, { cwd });
  } catch (error) {
    throw new HttpException(500, `(re)start failed:\n${error.stdout}\n${error.stderr}`);
  }
};

router.get('/cast', checkToken, async (req, res, next) => {
  try {
    // get the project
    if (!req.query.project) throw new HttpException(400, 'No project specified');
    const projects = await get_dirs(process.env.PROJECTS_ROOT);
    if (!projects.includes(req.query.project.toString())) throw new HttpException(404, 'Project not found');
    const project = req.query.project.toString();

    // get the service
    if (!req.query.service) throw new HttpException(400, 'No service specified');
    const services = await get_dirs(path.join(process.env.PROJECTS_ROOT, project));
    if (!services.includes(req.query.service.toString())) throw new HttpException(404, 'Service not found');
    const service = req.query.service.toString();

    const cwd = path.join(process.env.PROJECTS_ROOT, project, service);

    console.log(`Casting ${project}/${service}...`);
    // git pull
    console.log('pulling changes...');
    await git_pull();
    // install packages
    console.log('installing packages...');
    await install_packages();
    // build the service
    console.log('building...');
    await build_service(cwd);
    // install the service
    console.log('installing service...');
    const port = await install_service(cwd);
    // (re)start the service
    console.log('(re)starting...');
    await restart_service(cwd, port);

    return res.json({ success: true, data: {} });
  } catch (e) {
    return next(e);
  }
});

export default router;
