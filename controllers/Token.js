var Token = (function() {

    // Public functions

    // Token creation from username/password
    var create = function(req) {

        var auth = JSON.parse(req.bodyContent.toString('utf-8')).auth;

        console.log('[V2] Create token for user', auth.passwordCredentials.username);

        var new_auth = {
            "auth": {
                "identity": {
                    "methods": [
                        "password"
                    ],
                    "password": {
                        "user": {
                            "domain": {
                                "id": "default"
                            },
                            "name": auth.passwordCredentials.username,
                            "password": auth.passwordCredentials.password
                        }
                    }
                },
                "scope": {
                    "project": {
                        "domain": {
                            "id": "default"
                        },
                        "name": auth.tenantName,
                        "id": auth.tenantId
                    }
                }
            }
        };

        req.bodyContent = JSON.stringify(new_auth);
        req.path = '/v3/auth/tokens';
        return req;
    };

    // Token validation
    var validate = function(req) {

        console.log('[V2] Validate token', req.params.token, 'from user', req.headers['x-auth-token']);

        req.path = '/v3/auth/tokens';
        req.headers['x-subject-token'] = req.params.token;

        return req;
    };

    var create_token_response = function(rsp, data, req, res, callback) {

        try {

            var token = JSON.parse(data.toString('utf8')).token;

            if (token) {

                var json = {
                    "access": {
                        "token": {
                            "issued_at": token.issued_at,
                            "expires": token.expires_at,
                            "id": rsp.headers['x-subject-token'],
                            "tenant": {
                                "description": null,
                                "enabled": true,
                                "id": token.project.id,
                                "name": token.project.name
                            }
                        },
                        "serviceCatalog": convert_catalog(token.catalog)
                    }
                };

                callback(null, JSON.stringify(json));
            } else {
                callback(null, data);
            }

        } catch(err) {
            callback(null, data);
        }


    };

    var create_validate_response = function(rsp, data, req, res, callback) {

        try {

            var token = JSON.parse(data.toString('utf8')).token;

            if (token) {

                var json = {
                    "access":{
                        "token":{
                            "expires": token.expires_at,
                            "id": rsp.headers['x-subject-token'],
                            "tenant":{
                                "id": token.project.id,
                                "name": token.project.name
                            }
                        },
                        "user":{
                            "name": token.user.name,
                            "tenantName": token.project.name,
                            "id": token.user.name,
                            "roles": token.roles,
                            "tenantId": token.project.id
                        }
                    }
                }

                callback(null, JSON.stringify(json));

            } else {
                callback(null, data);
            }
        } catch(err) {
            callback(null, data);
        }
    };

    var convert_catalog = function (catalog) {
        var new_catalog = [];
    
        for (var ser in catalog) {
            var new_ser = {};
            new_ser.type = catalog[ser].type;
            new_ser.id = catalog[ser].id;
            new_ser.name = catalog[ser].name;
            new_ser.endpoints = [];

            for (var end in catalog[ser].endpoints) {
                var reg = catalog[ser].endpoints[end].region;
                var new_end = false;
                for (var e in new_ser.endpoints) {
                    if (new_ser.endpoints[e].region === reg) {
                        new_end = new_ser.endpoints[e];
                        break;
                    }
                }

                if (!new_end) {
                    new_end = {region: reg};
                    new_ser.endpoints.push(new_end);
                }
                var type = catalog[ser].endpoints[end].interface + 'URL';
                new_end[type] = catalog[ser].endpoints[end].url;
            
            }
            new_catalog.push(new_ser);
        }
        return new_catalog
    };

    return {
        create: create,
        validate: validate,
        create_token_response: create_token_response,
        create_validate_response: create_validate_response
    }
})();

exports.Token = Token;






// if (keystone_config.version === 3) {

//         var credentials = {
//             "auth": {
//                 "identity": {
//                     "methods": [
//                         "password"
//                     ],
//                     "password": {
//                         "user": {
//                             "domain": {
//                                 "id": "default"
//                             },
//                             "name": keystone_config.username,
//                             "password": keystone_config.password
//                         }
//                     }
//                 }
//             }
//         };

//     } else {
//         var credentials = {
//             "auth" : {
//                 "passwordCredentials" : {
//                     "username" : keystone_config.username,
//                     "password" : keystone_config.password
//                 },
//                 "tenantId": keystone_config.tenantId
//             }
//         };        
//     }
