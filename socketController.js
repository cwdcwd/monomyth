'use strict'

const _ = require('lodash')

class controller {
  constructor (io) {
    this.io = io
    this.commandList = [{ command: 'clear', func: this.commandClear.bind(this) }] // CWD-- factor these out to another object perhaps
    this.iScreenHeight = 10
    this.currentLine = 0

    io.on('connection', this.connectionHandler.bind(this))
  }

  // CWD-- basic ops

  getIO () {
    return this.io
  }

  sendCommand (msg) {
    this.io.emit('cmd', msg)
  }

  sendMessage (msg) {
    this.io.emit('msg', msg)
  }

  // CWD-- connection handling

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

  // CWD-- interaction handling

  messageHandler (msgIn) {
    console.log('incoming txt: ' + msgIn.txt)
    const cmdFunc = this.findCommand(msgIn)
    let blnContinue = true

    console.log(cmdFunc)

    if (cmdFunc) {
      blnContinue = cmdFunc.func(msgIn)
    }

    if (blnContinue) {
      const msgOut = { txt: msgIn.txt, op: 'text', y: this.currentLine, x: 0 }

      if (this.currentLine > this.iScreenHeight) {
        this.currentLine = -1
        this.sendCommand({ txt: 'clear', op: 'clear', y: this.currentLine, x: 0 })
      }

      ++this.currentLine
      msgOut.y = this.currentLine
      this.sendMessage(msgOut)
    }

    console.log(this.currentLine)
  }

  commandHandler (msgIn) {
    console.log('received command:', msgIn)

    switch (_.get(msgIn, 'op', '')) {
      case 'setScreenSize': {
        this.iScreenHeight = _.get(msgIn, 'val.height', this.iScreenHeight)
        console.log(`setting screen size: ${this.iScreenHeight}`)
        break
      }
      default: {
        console.log('bad op')
      }
    }
  }

  // CWD-- command funcs. perhaps refactor to own class

  findCommand (cmd) {
    // CWD-- TODO: parse out command text. Assume single word commands for now
    console.log('looking for valid commands: ', cmd, this.commandList)
    return _.find(this.commandList, ['command', cmd.txt])
  }

  commandClear (msgIn) {
    this.currentLine = -1
    const msgOut = { txt: msgIn.txt, op: 'text', y: this.currentLine, x: 0 }
    msgOut.op = 'clear'
    console.log(`currentLine reached ${this.currentLine}. clearing screen`)
    this.sendCommand(msgOut)
    // this.sendMessage(msgOut)
    return false
  }


}

module.exports = controller
