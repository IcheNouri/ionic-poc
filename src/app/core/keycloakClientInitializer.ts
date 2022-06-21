import {KeycloakService} from 'keycloak-angular';
import {KeycloakPkceMethod} from "keycloak-js";

const getUrl = (): string => {
  const origin = window.location.origin;
  if (origin.includes('localhost')) {
    return 'https://mykeycloak-test.primobox.net';
  } else if (origin.includes('sandbox') || origin.includes('test')) {
    return 'https://mykeycloak-test.primobox.net';
  }
  return 'https://mykeycloak-test.primobox.net';
};
export const initializeKeycloak = (keycloak: KeycloakService) => () =>
  keycloak.init({
    config: {
      url: getUrl(),
      realm: 'myprimobox',
      clientId: 'myp-v5-app-mobile',
    },
    initOptions: {
      checkLoginIframe: false,
      silentCheckSsoFallback: false,
      responseMode: 'query',
      flow: 'standard',
      adapter: 'cordova',
    },
    bearerExcludedUrls: ['/assets', '/clients/public', ''],
  });
/*

export const initializeKeycloak = (keycloak: KeycloakService) => () =>
  keycloak.init({
    config: {
      url: 'https://mykeycloak-rec.primobox.net',
      realm: 'myprimobox',
      clientId: 'myp-v5-app-mobile',
    },
    initOptions: {
      adapter: 'cordova-native',
      responseMode: 'query',
      pkceMethod: 'S256'
    },

  });
*/
