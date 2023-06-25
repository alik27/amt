const Router = require('express')
const router = new Router()
const descriptionController = require('../controllers/descriptionController')
//const checkRole = require('../middleware/checkRoleMiddleWare')

//router.post('/', checkRole('ADMIN'), descriptionController.create)
router.post('/create', descriptionController.create)
router.post('/edit', descriptionController.edit)

router.get('/delete/:number', descriptionController.delete)
router.get('/', descriptionController.getAll)
router.get('/:id', descriptionController.getOne)

module.exports = router