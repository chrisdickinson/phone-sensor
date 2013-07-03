var EE = require('events').EventEmitter
  , through = require('through')
  , dnode = require('dnode')

module.exports = api

function api(trans, ready) {
  var sensor = new EE
    , rpc

  rpc = dnode({
    orient: function(data, ready) {
      sensor.orientation.write(data)
      ready()
    }
  , motion: function(data, ready) {
      sensor.motion.write(data)
      ready()
    }
  , geolocate: function(data, ready) {
      console.log(data)
      sensor.geolocation.write(data)
      ready()
    } 
  })
  rpc.pipe(trans).pipe(rpc)
  rpc.on('remote', function(remote) {
    sensor.geolocation = through()
    sensor.orientation = through()
    sensor.motion = through()

    ready(null, sensor)
  })
} 
