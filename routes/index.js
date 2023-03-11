const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const paramsRouter = require('./paramsRouter')
const checkpointRouter = require('./checkpointRouter')
const historyRouter = require('./historyRouter')

router.use('/user', userRouter)
router.use('/params', paramsRouter)
router.use('/history', historyRouter)
/*
router.use('/description',)
*/

module.exports = router