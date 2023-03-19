const jwt = require('jsonwebtoken')

class UserService {
    generateJwt (id, login, role) {
        return jwt.sign({id, login, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
    }
}

module.exports = new UserService