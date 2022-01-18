import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  createAndCenterPopup(url: string, windowTitle: string, windowWidth: number, windowsHeight: number): Window | null {
    // https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
    // Fixes dual-screen position                             Most browsers      Firefox
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const clientWidth = document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const width = window.innerWidth ? window.innerWidth : clientWidth;
    const clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    const height = window.innerHeight ? window.innerHeight : clientHeight;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - windowWidth) / 2 / systemZoom + dualScreenLeft;
    const top = (height - windowsHeight) / 2 / systemZoom + dualScreenTop;
    const newWindow = window.open(
      url,
      windowTitle,
      `
      scrollbars=yes,
      width=${windowWidth / systemZoom},
      height=${windowsHeight / systemZoom},
      top=${top},
      left=${left}
      `
    );

    newWindow?.focus();
    return newWindow;
  }
}
