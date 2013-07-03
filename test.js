var senses = require('./index')
  , through = require('through')

var pprint = function(name) {
  return through(function(object) {
    for(var key in object) {
      console.log('('+name+') '+key+': ', object[key])
    }
  })
}

senses(5125)
  .on('sensor', function(sensor) {
    sensor.geolocation.pipe(pprint('geo')) 
  })
