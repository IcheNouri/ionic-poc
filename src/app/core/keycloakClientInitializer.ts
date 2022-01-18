import { KeycloakService } from 'keycloak-angular';

function getUrl(): string {
  const origin = window.location.origin;
  if (origin.includes('localhost')) {
    return 'http://localhost:10280/auth';
  } else if (origin.includes('sandbox') || origin.includes('test')) {
    return 'https://keycloak-sandbox.primobox.net/auth';
  }
  return 'http://localhost:10280/auth';
}

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: getUrl(),
        realm: 'myprimobox',
        clientId: 'myp-angular',
      },
      initOptions: {
        checkLoginIframe: false,
        silentCheckSsoFallback: false,
        responseMode: 'query',
        flow: 'standard',
        adapter: 'default',
      },
      bearerExcludedUrls: ['/assets', '/clients/public', ''],
    });
}
