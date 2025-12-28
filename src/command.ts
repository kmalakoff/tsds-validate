import spawn, { type SpawnError } from 'cross-spawn-cb';
import { bind } from 'node-version-call';
import path from 'path';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import format from 'tsds-biome';
import build from 'tsds-build';
import type { CommandCallback, CommandOptions } from 'tsds-lib';
import docs from 'tsds-typedoc';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');

function run(args: string[], options: CommandOptions, callback: CommandCallback) {
  try {
    const depcheck = resolveBin('depcheck');
    const sortPackageJSON = resolveBin('sort-package-json');
    const spawnOptions = { ...options, encoding: 'utf8' };

    const queue = new Queue(1);
    queue.defer(format.bind(null, args, options));
    queue.defer(build.bind(null, args, options));
    queue.defer(spawn.bind(null, sortPackageJSON, [], spawnOptions));
    queue.defer(spawn.bind(null, depcheck, [], spawnOptions));
    queue.defer(docs.bind(null, args, options));
    queue.await((err: SpawnError) => {
      if (err) {
        const errorMessage = (err.stderr as string) || err.message || err.toString() || 'Validation failed';
        return callback(new Error(errorMessage));
      }
      callback();
    });
  } catch (err) {
    return callback(err);
  }
}

type commandFunction = (args: string[], options: CommandOptions, callback: CommandCallback) => void;

const worker = (major >= 20 ? run : bind('>=20', path.join(dist, 'cjs', 'command.js'), { callbacks: true })) as commandFunction;

export default function publish(args: string[], options: CommandOptions, callback: CommandCallback) {
  worker(args, options, callback);
}
