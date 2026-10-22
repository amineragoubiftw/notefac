import { build } from 'vite';
import { packager } from '@electron/packager';
import { cp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const staging = '/tmp/notefac-desktop-stage';
await build({ configFile: path.resolve('electron/vite.config.ts') });
await rm(staging, { recursive: true, force: true });
await mkdir(path.join(staging, 'electron'), { recursive: true });
await cp('dist-desktop', path.join(staging, 'dist'), { recursive: true });
await cp('electron/main.cjs', path.join(staging, 'electron/main.cjs'));
await writeFile(path.join(staging, 'package.json'), JSON.stringify({ name: 'notefac', version: '1.1.0', main: 'electron/main.cjs', description: 'Tunisian LMD Grade Calculator', author: 'NoteFac' }, null, 2));
await cp('electron/README.txt', path.join(staging, 'README.txt'));
const output = await packager({ dir: staging, name: 'NoteFac', platform: 'win32', arch: 'x64', out: '/tmp/notefac-desktop-release', overwrite: true, asar: true, electronVersion: '40.2.1' });
console.log('Windows app packaged:', output.join(', '));