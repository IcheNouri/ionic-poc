import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {InAppBrowser, InAppBrowserOptions} from '@awesome-cordova-plugins/in-app-browser/ngx';
import cuid from 'cuid';
import {KeycloakService} from 'keycloak-angular';


@Injectable()
export class KeycloakAuthService {
//  URI_base: 'https://my-server-location/auth';
  keycloakConfig: any;

  constructor(
    public http: HttpClient,
    //public storage: StorageService,
    //private jwtHelper: JwtHelperService,
    private inAppBrowser: InAppBrowser,
    private keycloak: KeycloakService
  ) {
    this.keycloakConfig = {
      authServerUrl: 'https://mykeycloak-test.primobox.net', //keycloak-url
      realm: 'myprimobox', //realm-id
      clientId: 'myp-v5-app-mobile', // client-id
      redirectUri: 'http://localhost:4200',  //callback-url registered for client.
      // This can be anything, but should be a valid URL
    };
  }

  public keycloakLogin(login: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.createLoginUrl(this.keycloakConfig, login);

      const options: InAppBrowserOptions = {
        zoom: 'no',
        location: 'no',
        clearsessioncache: 'yes',
        clearcache: 'yes'
      };
      const browser = this.inAppBrowser.create(url, '_blank', options);

      const listener = browser.on('loadstart').subscribe((event: any) => {
        const callback = encodeURI(event.url);
        //Check the redirect uri
        if (callback.indexOf(this.keycloakConfig.redirectUri) > -1) {
          listener.unsubscribe();
          browser.close();
          const code = this.parseUrlParamsToObject(event.url);

          const keys = Object.keys(event);
          keys.forEach((key, index) => {
            console.log('valeur clé event: ');
            console.log(`${key}: ${event[key]}`);
          });

          console.log('event: ', event);
          console.log(event);
          console.log(callback);
          console.log('reponse keycloack: ');
          this.getAccessToken(this.keycloakConfig, code).then(
            () => {
              //  const token = this.storage.get(StorageKeys.OAUTH_TOKENS);
              resolve('');
            },
            () => reject('Count not login in to keycloak')
          );
        }
      });

    });
  }

  parseUrlParamsToObject(url: any) {
    const hashes = url.slice(url.indexOf('?') + 1).split('&');
    return hashes.reduce((params, hash) => {
      const [key, val] = hash.split('=');
      return Object.assign(params, {[key]: decodeURIComponent(val)});
    }, {});
  }

  createLoginUrl(keycloakConfig: any, isLogin: boolean) {
    const state = cuid();
    const nonce = cuid();
    const responseMode = 'fragment';
    const responseType = 'id_token token';
    const scope = 'openid';
    return this.getUrlForAction(keycloakConfig, isLogin) +
      '?client_id=' + encodeURIComponent(keycloakConfig.clientId) +
      '&state=' + encodeURIComponent(state) +
      '&redirect_uri=' + encodeURIComponent(keycloakConfig.redirectUri) +
      '&response_mode=' + encodeURIComponent(responseMode) +
      '&response_type=' + encodeURIComponent(responseType) +
      '&scope=' + encodeURIComponent(scope) +
      '&nonce=' + encodeURIComponent(nonce);
  }

  getUrlForAction(keycloakConfig: any, isLogin: boolean) {
    return isLogin ? this.getRealmUrl(keycloakConfig) + '/protocol/openid-connect/auth'
      : this.getRealmUrl(keycloakConfig) + '/protocol/openid-connect/registrations';
  }

  /*loadUserInfo() {
    return this.storage.get(StorageKeys.OAUTH_TOKENS).then(tokens => {
      const url = this.getRealmUrl(this.keycloakConfig) + '/protocol/openid-connect/userinfo';
      const headers = this.getAccessHeaders(tokens.access_token, 'application/json');
      return this.http.get(url, {headers: headers}).toPromise();
    })
  }

   */

  getAccessToken(kc: any, authorizationResponse: any) {
    const URI = this.getTokenUrl();
    const body = this.getAccessTokenParams(authorizationResponse.code, kc.clientId, kc.redirectUri);
    const headers = this.getTokenRequestHeaders();

    return this.createPostRequest(URI, body, {
      header: headers,
    }).then((newTokens: any) => {
      console.log('token');
      const keys = Object.keys(newTokens);
      keys.forEach((key, index) => {
        console.log('valeur clé token: ');
        console.log(`${key}: ${newTokens[key]}`);
      });
      console.log(newTokens);
      newTokens.iat = (new Date().getTime() / 1000) - 10; // reduce 10 sec to for delay
      //  this.storage.set(StorageKeys.OAUTH_TOKENS, newTokens);
    });
  }

  /*refresh() {
    return this.storage.get(StorageKeys.OAUTH_TOKENS)
    .then(tokens => {
      const decoded = this.jwtHelper.decodeToken(tokens.access_token);
      if (decoded.iat + tokens.expires_in < (new Date().getTime() / 1000)) {
        const URI = this.getTokenUrl();
        const headers = this.getTokenRequestHeaders();
        const body = this.getRefreshParams(tokens.refresh_token, this.keycloakConfig.clientId);
        return this.createPostRequest(URI, body, {
          headers
        });
      } else {
        return tokens;
      }
    })
    .then(newTokens => {
      newTokens.iat = (new Date().getTime() / 1000) - 10;
      return this.storage.set(StorageKeys.OAUTH_TOKENS, newTokens);
    })
    .catch((reason) => console.log(reason));
  }

   */

  createPostRequest(uri, body, headers) {
    return this.http.post(uri, body, headers).toPromise();
  }

  getAccessHeaders(accessToken, contentType) {
    return new HttpHeaders()
    .set('Authorization', 'Bearer ' + accessToken)
    .set('Content-Type', contentType);
  }

  getRefreshParams(refreshToken, clientId) {
    return new HttpParams()
    .set('grant_type', 'refresh_token')
    .set('refresh_token', refreshToken)
    .set('client_id', encodeURIComponent(clientId));
  }

  getAccessTokenParams(code, clientId, redirectUrl) {
    return new HttpParams()
    .set('grant_type', 'authorization_code')
    .set('code', code)
    .set('client_id', encodeURIComponent(clientId))
    .set('redirect_uri', redirectUrl);
  }

  getTokenUrl() {
    return this.getRealmUrl(this.keycloakConfig) + '/protocol/openid-connect/token';
  }

  getTokenRequestHeaders() {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded');

    const clientSecret = (this.keycloakConfig.credentials || {}).secret;
    if (this.keycloakConfig.clientId && clientSecret) {
      headers.set('Authorization', 'Basic ' + btoa(this.keycloakConfig.clientId + ':' + clientSecret));
    }
    return headers;
  }

  getRealmUrl(kc: any) {
    if (kc && kc.authServerUrl) {
      if (kc.authServerUrl.charAt(kc.authServerUrl.length - 1) == '/') {
        return kc.authServerUrl + 'realms/' + encodeURIComponent(kc.realm);
      } else {
        return kc.authServerUrl + '/realms/' + encodeURIComponent(kc.realm);
      }
    } else {
      return undefined;
    }
  }
}
