const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

const generateJwt = (id, login, role) => {
    return jwt.sign({id, login, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async registration (req, res, next) {
        const {login, pass, role} = req.body
        if(!login || !pass) {
            return next(ApiError.badRequest('Некорректный логин или пароль'))
        }
        const candidate = await User.findOne({where: {login}})
        if(!candidate) {
            return next(ApiError.badRequest('Пользователь с таким логином уже существует'))
        }
        const hashPass = await bcrypt.hash(pass,5)
        const user = await User.create({login, role, pass: hashPass})
        const token = generateJwt(user.id, user.login, user.role)
        return res.json(token)
    }
    
    async login (req, res, next) {
        const {login, pass} = req.body
        const user = await User.findOne({where: {login}})
        if(!user) {
            return next(ApiError.internal('Пользователь с таким логином не найден'))
        }
        const comparePass = bcrypt.compareSync(pass, user.pass)
        if(!comparePass) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.login, user.role)
        return res.json(token)
    }

    async check (req, res, next) {
        const token = generateJwt(user.id, user.login, user.role)
        return res.json(token)
    }
}

module.exports = new UserController