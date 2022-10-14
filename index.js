const NW = require('nw.gui');
const fs = require('fs');
const path = require('path');

const win = NW.Window.get();

const messageElement = document.querySelector('h3.message');

const splashTmpFileName = 'temp.dat';
const splashTmpPath = path.resolve(process.cwd(), splashTmpFileName);
let splashDismissTimeout;

const showSplashScreen = () => {
  messageElement.innerHTML = getSplashScreenMsg() || '';
  win.show();
  win.focus();

  splashDismissTimeout = setTimeout(() => {
    fs.unlinkSync(splashTmpPath);
  }, 10000);
};

const hideSplashScreen = () => {
  if (splashDismissTimeout) {
    clearInterval(splashDismissTimeout);
  }

  win.hide();
};

const getSplashScreenMsg = () => {
  try {
    const msgCode = fs.readFileSync(splashTmpPath, 'utf8');
    let msg;

    switch (msgCode) {
      case '1':
        msg = 'Application is updating. Please Wait ...';
        break;

      case '2':
        msg = 'Application is Restarting ...';
        break;

      case '3':
        msg = 'Something went wrong. Please reinstall the app.';
        break;

      case 0:
      default:
        msg = 'Application is initializing ...';
        break;
    }

    return msg;
  } catch (err) {
    console.error('Error while generating splash screen message', err);
  }
};

fs.watch(process.cwd(), { persistent: true }, (event, who) => {
  if (event === 'rename' && who === splashTmpFileName) {
    if (fs.existsSync(splashTmpFileName)) {
      showSplashScreen();
    } else {
      hideSplashScreen();
    }
  }
});

if (!fs.existsSync(splashTmpPath)) {
  fs.writeFileSync(splashTmpFileName, '');
} else {
  console.warn('splash is already showing');
}
