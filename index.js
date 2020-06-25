const config = require('config')
const app = require('express')()
const exphbs = require('express-handlebars')

const http = require('http').createServer(app)
const io = require('socket.io')(http)

const SocketController = require('./socketController')

const sockCon = new SocketController(io);

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.get('/', function (req, res) {
  res.render('home')
})

http.listen(config.PORT, () => {
  console.log(`listening on *:${config.PORT}`)
})
