const self = {};
const CryptoJS = require("crypto-js");
// const SHA256 = require("crypto-js/sha256");
const fs = require('fs');
const filePath = __dirname + '/../services/tokens.txt';

// Function that check if token is valid or not
function tokenValidation(token) {
    const creation_Date = parseInt(token.split(' ')[1]);
    return new Date().getTime() - creation_Date < 600000
}

/* Function that generates token */
self.tokenGenerator = function(req, res, next) {
    const email = req.body.email;
    const salt = "tjxd4axrwgcdu+&3@4gg";
    const date = new Date().getTime();
    const token = CryptoJS.SHA256(salt + email + date).toString(CryptoJS.enc.hex);
    fs.appendFile(filePath, token + " " + date + '\n', 'utf-8', err => {
      if (err) throw err;
      res.json({token, expires_in_seconds: 600});
    });
};

self.validateToken = function(req, res, next) {
    const token = req.params.token;
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        let savedToken = data.split(/\r?\n/).find(str => str.split(' ')[0] === token);
        if (savedToken && tokenValidation(savedToken)) {
            res.json({message: "Welcome!!"});
        } else {
            res.sendStatus(401);
        }
    });
};

module.exports = self;
