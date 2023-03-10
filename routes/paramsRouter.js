const Router = require('express')
const router = new Router()
const paramsController = require('../controllers/paramsController')
const checkRole = require('../middleware/checkRoleMiddleWare') 

router.post('/', checkRole('ADMIN'), paramsController.create)
router.get('/', paramsController.getAll)
router.get('/:id', paramsController.getOne)

module.exports = router