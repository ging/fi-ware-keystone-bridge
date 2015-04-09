var Token = (function() {

    // Public functions

    // Token creation from username/password
    var create = function(req) {

        return req;
    };

    // Token validation
    var validate = function(req) {
        
        return req;
    };

    return {
        create: create,
        validate: validate
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
