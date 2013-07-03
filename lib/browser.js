var domready = require('domready')
  , dnode = require('dnode')
  , shoe = require('shoe')
//  , geo = require('geolocationstream')
  , sock
  , rpc

domready(function() {
  sock = shoe('/shoe')
  rpc = dnode()
  rpc.pipe(sock).pipe(rpc)

  rpc.on('remote', function(remote) {

    // TODO: find some series of hacks
    // that make iOS geolocation work.
    if(false)
    geo(function(datum) {
      remote.geolocate({
        latitude: datum.coords.latitude
      , longitude: datum.coords.longitude
      , altitude: datum.coords.altitude
      , accuracy: datum.coords.accuracy
      , altitudeAccuracy: datum.coords.altitudeAccuracy
      , heading: datum.coords.heading
      , speed: datum.coords.speed
      }, noop)
    })

    window.addEventListener('deviceorientation', orient, false)
    window.addEventListener('devicemotion', motion, false)

    function orient(ev) {
      remote.orient({
          absolute: ev.absolute
        , alpha: ev.alpha
        , beta: ev.beta
        , gamma: ev.gamma
      }, noop)
    }

    function motion(ev) {
      remote.orient({
        acceleration: ev.acceleration
      , accelerationIncludingGravity: ev.accelerationIncludingGravity
      , rotationRate: ev.rotationRate
      , interval: ev.interval   
      }, noop)
    }
  })
})

function noop() {

}
