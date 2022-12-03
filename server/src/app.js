const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const planetsRouter = require("./routes/planets/planets.router")
const launchesRouter = require("./routes/launches/launches.router")

const app = express() // поток данных идет последовательно сверху вниз

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('combined'))
app.use(express.json()) //парсит входящий json
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(planetsRouter) // если путь совпадает, выполняет функцию
app.use(launchesRouter) // если путь совпадает, выполняет функцию
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app