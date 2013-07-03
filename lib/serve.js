var EE = require('events').EventEmitter
  , portfinder = require('portfinder')
  , browserify = require('browserify')
  , ip = require('my-local-ip')
  , http = require('http')
  , shoe = require('shoe')
  , api = require('./api')
  , path = require('path')
  , fs = require('fs')

module.exports = function(opts, ready) {
  var events = new EE
    , closed = false
    , routing
    , server
    , error
    , sock

  events.close = function(cb) {
    closed = true
    if(server) {
      server.close(function() {
        events.emit('close')
        if(cb) cb()
      })
    }
  }

  events.location = ''

  switch(arguments.length) {
    case 1: {
      ready = output
    } break
    case 0: {
      opts = {}
      ready = output
    } break
  }

  if(typeof opts === 'number') {
    opts = {port: opts}
  }

  if(!opts.port) {
    portfinder.getPort(got_port)
  } else {
    listen(opts.port)
  }

  return events

  function got_port(err, port) {
    if(err) {
      return ready(err)
    }
    listen(port)
  }

  function listen(port) {
    if(closed) {
      return events.emit('close')
    }
    server = http.createServer(function(req, res) {
      var bundle
      if(/html/.test(req.headers.accept)) {
        res.setHeader('content-type', 'text/html')
        fs.createReadStream(path.join(__dirname, 'static', 'index.html'))
          .pipe(res)
      } else {
        res.setHeader('content-type', 'text/javascript')
        bundle = browserify()
        bundle.add(path.join(__dirname, 'browser.js'))
        bundle.bundle().pipe(res)
      }
    })

    server.on('error', function(err) {
      error = true
      ready(err)
    })

    server.listen(port, function() {
      sock = shoe(onconnection)
      sock.install(server, '/shoe')
      events.location = 'http://'+ip()+':'+port
      ready(null, events.location)
      events.emit('listening', events.location)
    })
  }

  function onconnection(conn) {
    api(conn, function(err, sensor) {
      if(err) {
        return events.emit('error', err)
      }
      events.emit('sensor', sensor)
    })
  }

  function output(err, data) {
    if(err) {
      return events.emit('error', err)
    }
    console.log('point your phone at '+data)
  }
}
