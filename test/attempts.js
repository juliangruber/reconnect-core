var inject = require('..')
var Stream = require('stream')
var test = require('tape')

var reconnect = inject(function () {
  var s = new Stream
  process.nextTick(function () {
    s.emit('error')
  })
  return s
})

test('attempts', function (t) {
  t.plan(14)

  var fail = function () { t.fail() }
  var reconnector = reconnect({initialDelay: 10}, fail)

  var onReconnect = function (n, delay) {
    t.equal(reconnector.connected, false)
    t.equal(reconnector.reconnect, true)
    if (n > 4) reconnector.reconnect = false
  }

  reconnector
    .on('connect', fail)
    .on('reconnect', onReconnect)
    .connect()
})

