import {AfterViewInit, Component, OnInit} from '@angular/core';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit {

  page: any = null;

  constructor(private iab: InAppBrowser) {
  }

  ngAfterViewInit(): void {
    const browser = this.iab.create('http://192.168.1.20:9000', '_self', {location: 'no'});
    const listener = browser.on('customscheme');

    console.log(listener);
    if (listener) {
      console.log('listener is on');
      listener.subscribe((event) => {
        console.log('event', event);
      });
    }

  }

}
