import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const client = mqtt.connect(process.env.MQTT_URL!);

client.on('connect', () => {
  console.log('Publisher conectado em', process.env.MQTT_URL);

  // Exemplo de mensagens de teste:
  client.publish('sensor/device123/light', '77', () => {
    console.log('Publicado sensor/device123/light -> 77');
  });

  client.publish('sensor/device123/temperature', '[26.3,52]', () => {
    console.log('Publicado sensor/device123/temperature -> [26.3,52]');
  });

  client.publish('state/device123/buttons', '{"main":0,"door":1}', () => {
    console.log('Publicado state/device123/buttons -> {"main":0,"door":1}');
  });

  client.publish('state/device123/leds', '65', () => {
    console.log('Publicado state/device123/leds -> 65');
  });

  // Desliga após alguns segundos
  setTimeout(() => {
    client.end();
    process.exit(0);
  }, 1000);
});

client.on('error', err => {
  console.error('Publisher error', err);
  client.end();
});
