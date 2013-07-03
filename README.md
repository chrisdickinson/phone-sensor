# phone-sensor

for low precision passes at hardware stuff when you
don't own sensors.

```javascript
var senses = require('phone-sensor')
  , stringify = require('json-stringify-stream')

senses(5125)
  .on('sensor', function(sensor) {
    sensor.motion.pipe(stringify()).pipe(process.stdout)
    sensor.orientation.pipe(stringify()).pipe(process.stdout)
  })

```

## api

### senses([port], [ready]) -> Senses

listen on `port`, calling `ready` if provided.

if `port` is omitted it will attempt to autodetect a port.

if `ready` is omitted, once the sensor server is ready it'll
print the url to stdout. `ready` takes `(err, url)` as arguments.

### senses.close([cb])

close the sensor server.

## events

### Senses.on('sensor') -> Sensor

get a new Sensor object. `Sensor` objects have two
properties: `motion` and `orientation` streams.

## license

MIT
