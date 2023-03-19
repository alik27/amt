const Router = require('express')
const router = new Router()
const historyDescriptionController = require('../controllers/historyDescriptionController')
//const checkRole = require('../middleware/checkRoleMiddleWare') 

router.get('/', historyDescriptionController.getAll)

module.exports = router