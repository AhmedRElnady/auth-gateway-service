const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.get('token.secret'),
     expiresIn = config.get('token.expiresIn');

module.exports = {
    
    signToken(payload) {
        return new Promise ((resolve, reject) => {
            const token = jwt.sign(payload, secret, { expiresIn });
            resolve(token);
        });
    }
}