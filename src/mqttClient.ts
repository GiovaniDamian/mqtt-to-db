import mqtt, { MqttClient } from 'mqtt';
import { handleMessage } from '../src/index';
import dotenv from 'dotenv';
dotenv.config();

export function startMqtt(): MqttClient {
  const client = mqtt.connect(process.env.MQTT_URL!);
  client.on('connect', () => {
    console.log('MQTT: conectado em', process.env.MQTT_URL);

    // Só esses tópicos!
    client.subscribe('sensor/+/light');
    client.subscribe('sensor/+/temperature');
    client.subscribe('sensor/+/water/level');
    client.subscribe('sensor/+/water/temperature');

    client.subscribe('state/+/buttons');
    client.subscribe('state/+/trays');
    client.subscribe('state/+/leds');
    client.subscribe('state/+/fans');
  });

  client.on('error', err => {
    console.error('MQTT error:', err);
    client.end();
  });

  client.on('message', (topic: string, payload: Buffer) => {
    const msg = payload.toString();
    handleMessage(topic, msg).catch((err: any) => {
      console.error('Erro no handleMessage:', err, '\nTópico:', topic, '\nPayload:', msg);
    });
  });

  return client;
}
