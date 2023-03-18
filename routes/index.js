const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const paramsRouter = require('./paramsRouter')
const checkpointRouter = require('./checkpointRouter')
const historyRouter = require('./historyRouter')
const descriptionRouter = require('./descriptionRouter')
const archiveRouter = require('./archiveRouter')

router.use('/user', userRouter)
router.use('/params', paramsRouter)
router.use('/checkpoint', checkpointRouter)
router.use('/history', historyRouter)
router.use('/description', descriptionRouter)
router.use('/archive', archiveRouter)

module.exports = router