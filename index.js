const NW = require('nw.gui');
const fs = require('fs');
const path = require('path');

const win = NW.Window.get();

const messageElement = document.querySelector('h3.message');
messageElement.innerHTML = process.argv[2] || 'Application is initializing';

const splashTmpFileName = 'temp.dat';
const splashTmpPath = path.resolve(process.cwd(), splashTmpFileName);
let splashDismissTimeout;

fs.watch(process.cwd(), { persistent: true }, (event, who) => {
  if (event === 'rename' && who === splashTmpFileName) {
    if (fs.existsSync(splashTmpFileName)) {
      win.show();
      win.focus();
    } else {
      if (splashDismissTimeout) {
        clearInterval(splashDismissTimeout);
      }

      win.hide();
    }
  }
});

if (!fs.existsSync(splashTmpPath)) {
  fs.writeFileSync(splashTmpFileName, '');

  splashDismissTimeout = setTimeout(() => {
    fs.unlinkSync(splashTmpPath);
  }, 10000);
} else {
  console.warn('splash is already showing');
}
