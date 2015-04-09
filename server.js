var proxy = require('express-http-proxy'),
    express = require('express'),
    clientAPI = express(),
    adminAPI = express(),
    config = require('./config.js'),
    Token = require('./controllers/Token').Token;

// Token validation from keystone-middlewares
clientAPI.use('/v2.0/tokens/:token', proxy(config.keystone.host + ':' + config.keystone.client_port, {
  decorateRequest: Token.validate
}));

adminAPI.use('/v2.0/tokens/:token', proxy(config.keystone.host + ':' + config.keystone.admin_port, {
  decorateRequest: Token.validate
}));

// Token creation
clientAPI.use('/v2.0/tokens', proxy(config.keystone.host + ':' + config.keystone.client_port, {
  decorateRequest: Token.create,
  intercept: Token.create_response
}));

adminAPI.use('/v2.0/tokens', proxy(config.keystone.host + ':' + config.keystone.admin_port, {
  decorateRequest: Token.create
}));

clientAPI.use('/', proxy(config.keystone.host + ':' + config.keystone.client_port));

adminAPI.use('/', proxy(config.keystone.host + ':' + config.keystone.admin_port));

// Initialize the admin server
adminAPI.listen(config.bridge.admin_port);

// Initialize the user server
clientAPI.listen(config.bridge.client_port);

console.log("Listening ");
