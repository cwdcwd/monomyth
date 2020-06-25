'use strict'

const _ = require('lodash')

class controller {
  constructor (io) {
    this.io = io
    this.iScreenHeight = 10
    this.currentLine = 0

    io.on('connection', this.connectionHandler.bind(this))
  }

  getIO () {
    return this.io
  }

  sendMessage (msg) {
    this.io.emit('msg', msg)
  }

  connectionHandler (socket) {
    console.log('a user connected')
    socket.on('disconnect', this.disconnectHandler.bind(this))
    socket.on('cmd', this.commandHandler.bind(this))
    socket.on('msg', this.messageHandler.bind(this))

    console.log(this.iScreenHeight)
    this.sendMessage({ txt: 'Welcome. Would you like to play a game?', op: 'text', y: this.currentLine, x: 0 })
    ++this.currentLine
  }

  disconnectHandler () {
    console.log('user disconnected')
  }

  commandHandler (msg) {
    console.log('received command:', msg)

    switch (_.get(msg, 'op', '')) {
      case 'setScreenSize': {
        this.iScreenHeight = _.get(msg, 'val.height', this.iScreenHeight)
        console.log(`setting screen size: ${this.iScreenHeight}`)
        break
      }
      default: {
        console.log('bad op')
      }
    }
  }

  messageHandler (msgIn) {
    console.log('incoming txt: ' + msgIn.txt)
    const msgOut = { txt: msgIn.txt, op: 'text', y: this.currentLine, x: 0 }

    if (msgIn.txt === 'clear') {
      this.currentLine = 0
      msgOut.op = 'clear'
      console.log(`currentLine reached ${this.currentLine}. clearing screen`)
      this.sendMessage('msg', msgOut)
    }

    if (this.currentLine > this.iScreenHeight) {
      this.currentLine = -1
    }

    ++this.currentLine
    msgOut.y = this.currentLine
    this.sendMessage('msg', msgOut)

    console.log(this.currentLine)
  }
}

module.exports = controller
