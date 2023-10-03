import * as fs from 'fs';
import { resolve } from 'path';

const basePath = resolve();

export const readJSON = (path: string) => JSON.parse(fs.readFileSync(resolve(basePath, path), 'utf-8'));
