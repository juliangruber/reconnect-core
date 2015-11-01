
var inject = require('..')
var test = require('tape')
var Stream = require('stream')

var reconnect = inject(function () {
  return new Stream
})

test('reset', function (t) {
  // TODO real test
  reconnect().reset()
  t.end()
})
