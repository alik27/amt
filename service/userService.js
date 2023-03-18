const jwt = require('jsonwebtoken')

const generateJwt = (id, login, role) => {
    return jwt.sign({id, login, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

module.exports = {
    generateJwt
};