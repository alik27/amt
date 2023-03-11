require('dotenv').config()
const express = require("express")
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleWare')
const cron = require('node-cron')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const job = cron.schedule("*/1 * * * *", () => {
    console.log(new Date().toLocaleString())
})

//обработка ошибок
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('Server started on port '+PORT))
    } catch (e) {
        console.log(e);
    }
}

job.start()
start()
