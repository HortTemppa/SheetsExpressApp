require("dotenv").config();
const express = require('express')
const app = express()

const consumptionRouter = require('./controllers/consumption')

app.use('/api/consumption', consumptionRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Serveri juoksee portissa ${PORT}`)
})
