const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
//const paramsRouter = require('./paramsRouter')

router.use('/user', userRouter)
//router.use('/params', paramsRouter)
/*router.use('/checkpoint',)
router.use('/history',)
router.use('/description',)*/

module.exports = router