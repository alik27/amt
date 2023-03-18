const Router = require('express')
const router = new Router()
const archiveController = require('../controllers/archiveController')
//const checkRole = require('../middleware/checkRoleMiddleWare') 

//router.post('/', checkRole('ADMIN'), archiveController.create)
router.post('/create/:id', archiveController.create)
router.post('/delete/:id', archiveController.delete)

router.get('/', archiveController.getAll)
router.get('/:id', archiveController.getOne)

module.exports = router