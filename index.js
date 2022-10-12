const chokidar = require('chokidar');

const messageElement = document.querySelector('h3.message');
messageElement.innerHTML = process.argv[2] || 'Application is initializing';

// Initialize watcher.
const watcher = chokidar.watch('file, dir, glob, or array', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  cwd: process.cwd(),
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', (path) => log(`File ${path} has been added`))
  .on('change', (path) => log(`File ${path} has been changed`))
  .on('unlink', (path) => log(`File ${path} has been removed`));

console.log(process.cwd());
