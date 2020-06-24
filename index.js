const _ = require('lodash')
const config = require('config')
const app = require('express')()
const exphbs = require('express-handlebars')

const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.get('/', function (req, res) {
  res.render('home')
})

io.on('connection', (socket) => {
  console.log('a user connected')
  let i = 0
  let iScreenHeight = 10
  io.emit('msg', { txt: 'Welcome. Would you like to play a game?', op: 'text', y: i, x: 0 })
  ++i

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('cmd', (msg) => {
    console.log('received command:', msg)

    switch (_.get(msg, 'op', '')) {
      case 'setScreenSize': {
        iScreenHeight = _.get(msg, 'val.height' , iScreenHeight)
        console.log(`setting screen size: ${iScreenHeight}`)
        break;
      }
      default: {
        console.log('bad op')
      }
    }
  })

  socket.on('msg', (msgIn) => {
    console.log('incoming txt: ' + msgIn.txt)
    const msgOut = { txt: msgIn.txt, op: 'text', y: i, x: 0 }

    if (msgIn.txt === 'clear') {
      i = 0
      msgOut.op = 'clear'
      console.log(`i reached ${i}. clearing screen`)
      io.emit('msg', msgOut)
    }

    if (i > iScreenHeight) {
      i = -1
    }

    ++i
    msgOut.y = i
    io.emit('msg', msgOut)

    console.log(i)
  })
})

http.listen(config.PORT, () => {
  console.log(`listening on *:${config.PORT}`)
})
