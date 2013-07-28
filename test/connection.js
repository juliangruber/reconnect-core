var inject = require('..')
var test = require('tape')
var Stream = require('stream')
var Emitter = require('events').EventEmitter
var noop = function () {}

var ee = new Emitter

var reconnect = inject(function () {
  var s = new Stream
  ee.on('start server', function () {
    s.emit('connect')
    s.emit('close')
  })
  s.end = noop
  return s
})

test('connection', function (t) {
  t.plan(4) // reconnect and connect

  var reconnector = reconnect({initialDelay: 10}, function (stream) {
    reconnector.reconnect = false
    reconnector.disconnect()
  })

  var connected = false
  var onConnect = function () {
    connected = true
    t.ok(reconnector.connected)
  }

  var onReconnect = function (n) {
    t.notOk(connected)
    t.notOk(reconnector.connected)
    t.ok(reconnector.reconnect)
    if (n < 4) process.nextTick(function () {
      ee.emit('start server')
    })
  }

  reconnector
    .on('connect', onConnect)
    .on('reconnect', onReconnect)
    .connect()
})
