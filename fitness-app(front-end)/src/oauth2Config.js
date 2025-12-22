export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173',
  scope: 'openid profile email',
  onRefreshTokenExpire: (event) => {
    const userLoggedOut = localStorage.getItem('USER_LOGGED_OUT');
    if (!userLoggedOut) {
      // If the logout was not intentional, reload to trigger re-authentication
      event.logIn();
    }
  },
}

export const keycloakLogout = () => {
  // Mark logout as intentional
  localStorage.setItem('USER_LOGGED_OUT', 'true');

  //  Build logout URL from existing config
  const authUrl = new URL(authConfig.authorizationEndpoint);
  const baseUrl = `${authUrl.protocol}//${authUrl.host}`;
  const realm = authUrl.pathname.split('/')[2];

  const logoutUrl =
    `${baseUrl}/realms/${realm}/protocol/openid-connect/logout` +
    `?client_id=${authConfig.clientId}` +
    `&post_logout_redirect_uri=${encodeURIComponent(authConfig.redirectUri)}`;

  // Redirect to Keycloak logout
  window.location.href = logoutUrl;
};
