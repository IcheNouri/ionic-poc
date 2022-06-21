import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateDayjsAdapter} from './shared/config/datepicker-adapter';
import {missingTranslationHandler, translatePartialLoader} from './shared/config/translation.config';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxWebstorageModule, SessionStorageService} from 'ngx-webstorage';
import {ApplicationConfigService} from './core/config/application-config.service';
import {from} from 'rxjs';
import {JwtToken} from './shared/auth/token';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
import {KeycloakAuthService} from './core/KeycloakAuthService';
import {Chooser} from '@awesome-cordova-plugins/chooser/ngx';

import {File} from '@awesome-cordova-plugins/file/ngx';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    KeycloakAngularModule,
    NgxWebstorageModule.forRoot({prefix: 'jhi', separator: '-', caseSensitive: true}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    Title,
    {provide: LOCALE_ID, useValue: 'fr'},
    {provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter},
   /* {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    */
    InAppBrowser,
    SocialSharing,
    KeycloakAuthService,
    KeycloakService,
    Chooser,
    File,
    FingerprintAIO
    // httpInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translateService: TranslateService, keycloak: KeycloakService, http: HttpClient, applicationConfigService: ApplicationConfigService,
              sessionStorage: SessionStorageService, keycloakAuthService: KeycloakAuthService
  ) {

    /*keycloakAuthService.keycloakLogin(true)
    .then(() => {
     // return this.keycloakAuthService.retrieveUserInformation(this.language)
    });*/

    translateService.setDefaultLang('fr');
    translateService.use('fr');
    this.listenKeycloakLoginEvent(keycloak, http, applicationConfigService, sessionStorage);
  }

  private listenKeycloakLoginEvent(keycloak: KeycloakService, http: HttpClient, applicationConfigService: ApplicationConfigService, sessionStorage: SessionStorageService): void {
    from(keycloak.keycloakEvents$).subscribe(event => {
      console.log('EVENT -------------', event.type);
      //if (event.type === KeycloakEventType.OnAuthSuccess) {
        console.log('EVENT SUC-------------', event);

        from(keycloak.getToken()).subscribe(keycloakToken => {
          console.log('keycloakToken-------------', keycloakToken);
          http.post<JwtToken>(applicationConfigService.getEndpointFor('api/authenticate'), keycloakToken).forEach(mypToken => {
            sessionStorage.store('authenticationToken', mypToken.id_token);
          });
        });
      //}
    });
  }
}
