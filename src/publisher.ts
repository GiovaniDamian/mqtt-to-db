import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const client = mqtt.connect(process.env.MQTT_URL!);

client.on('connect', () => {
  console.log('Publisher connected to: ', process.env.MQTT_URL);

  client.publish('sensor/device123/light', '87', () => {
    console.log('Publisher sensor/device123/light -> 87');
  });

  client.publish('sensor/device123/temperature', '[26.3,52]', () => {
    console.log('Publisher sensor/device123/temperature -> [26.3,52]');
  });

  client.publish('state/device123/buttons', '{"main":0,"door":1}', () => {
    console.log('Publisher state/device123/buttons -> {"main":0,"door":1}');
  });

  client.publish('state/device123/leds', '60', () => {
    console.log('Publisher state/device123/leds -> 60');
  });

  client.publish(
  'state/device123/fans',
  '[1,0,1]',
  () => console.log('Publisher state/device123/fans -> [1,0,1]')
);

client.publish(
  'state/device123/trays',
  '[{"seed":"sunflower","planted":1710268658}]',
  () => console.log('Publisher state/device123/trays -> [...]')
);

  setTimeout(() => {
    client.end();
    process.exit(0);
  }, 1000);
});

client.on('error', err => {
  console.error('Publisher error', err);
  client.end();
});
