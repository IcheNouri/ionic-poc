import {Component, OnInit} from '@angular/core';
import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
import {KeycloakService} from 'keycloak-angular';
import Keycloak, {KeycloakInstance} from 'keycloak-ionic';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private socialSharing: SocialSharing, private keycloak: KeycloakService, private faio: FingerprintAIO) {
  }

  ngOnInit() {

   //this.test();
    //this.capacitor();
  }

  capacitor = () => {
    console.log('capactot TEST');
    const keycloak: Keycloak.KeycloakInstance = Keycloak({
      clientId: 'myp-v5-app-mobile',
      realm: 'myprimobox',
      url: 'https://mykeycloak-test.primobox.net'
    });
    keycloak.init({
      adapter: 'capacitor-native',
      responseMode: 'query',
      redirectUri: 'http://localhost:8100'
    });

    // Test if it works, when coming back from this.keycloak.login();
    keycloak.onAuthSuccess = () => {
      console.log('authenticated!');
    };
  };

  test() {
    this.keycloak.login({
      redirectUri: 'http://192.168.1.20:8200',
      prompt: 'login',
    });
  }

  openPdf() {
    this.faio.show({
      title: 'Finger print test'
    }).then((result: any) => console.log(result)).catch((error: any) => console.log(error));
  }

  share() {
    // Share via email
    this.socialSharing.shareWithOptions(
      {
        message: 'mon test',
        subject: 'OKOK',
        chooserTitle: 'Test',
        url: 'https://ionicframework.com/docs/native/social-sharing',
        // files: 'www/assets/images/logo_myPrimobox_blue.svg'
      }).then(() => {
      console.log('share succeed');
      // Success!
    }).catch(() => {
      console.log('share error');
    });
  }


}
