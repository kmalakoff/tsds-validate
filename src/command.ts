import spawn from 'cross-spawn-cb';
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

    const queue = new Queue(1);
    queue.defer(format.bind(null, args, options));
    queue.defer(build.bind(null, args, options));
    queue.defer(spawn.bind(null, sortPackageJSON, [], options));
    queue.defer(spawn.bind(null, depcheck, [], options));
    queue.defer(docs.bind(null, args, options));
    queue.await(callback);
  } catch (err) {
    console.log(err.message);
    return callback(err);
  }
}

const worker = major >= 20 ? run : bind('>=20', path.join(dist, 'cjs', 'command.js'), { callbacks: true });

export default function publish(args: string[], options: CommandOptions, callback: CommandCallback) {
  worker(args, options, callback);
}
