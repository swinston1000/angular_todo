  var auth0 = new Auth0({
      domain: '#{env.AUTH0_DOMAIN}',
      clientID: '#{env.AUTH0_CLIENT_ID}',
      callbackURL: '#{env.AUTH0_CALLBACK_URL}',
  });
