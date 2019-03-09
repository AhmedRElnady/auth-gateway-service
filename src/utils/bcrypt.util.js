const bcrypt = require('bcryptjs');

module.exports = {
    hashPassword(password) {
        return new Promise ((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err) reject(err);
                    resolve(hash);
                })
            })
        });
    },

    isValidPassword(password, hashedPassword) {
        return new Promise((resolve, reject)=> {
            bcrypt.compare(password, hashedPassword, (err, res) => {
                if (err)  reject(err);
                resolve(res);
            })
        })
    }

}