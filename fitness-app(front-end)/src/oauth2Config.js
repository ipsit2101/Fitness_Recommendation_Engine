export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173',
  autoLogin: false,
  scope: 'openid profile email',
  onRefreshTokenExpire: () => {
    const userLoggedOut = localStorage.getItem('USER_LOGGED_OUT');
    if (userLoggedOut === 'true') {
      // If the user has intentionally logged out, do not attempt to refresh the token
      return;
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
