const Router = require('express')
const router = new Router()
const historyController = require('../controllers/historyController')
//const checkRole = require('../middleware/checkRoleMiddleWare') 

router.get('/read', historyController.read)
router.get('/', historyController.getAll)
router.get('/:id', historyController.getOne)

module.exports = router