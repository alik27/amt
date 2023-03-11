const Router = require('express')
const router = new Router()
const checkpointController = require('../controllers/checkpointController')
//const checkRole = require('../middleware/checkRoleMiddleWare') 

//router.post('/', checkRole('ADMIN'), checkpointController.create)
router.post('/create', checkpointController.create)
router.post('/delete', checkpointController.delete)

router.get('/', checkpointController.getAll)
router.get('/:id', checkpointController.getOne)

module.exports = router