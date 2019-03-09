const jwt = require('jsonwebtoken'); // move to utils/jwt.util
const config = require('config');
const tokenSecret = config.get('token.secret');

function authenticate() {
    return (req, res, next) => {
        (async () => {
            console.log(">>> msg from authorize middleware >>>");
            const authorizationHeader = req.headers['authorization'];

            if(!authorizationHeader) {
                res.status(401).send("Unauthenticated");
            } else {
                jwt.verify(authorizationHeader, tokenSecret, (err, decoded) => {
                    if(err) res.status(403).send("Forbidden");
                    req.tokenPayload = decoded; 
                    next();
                })
            }
        })()
    }
}

module.exports = authenticate;
