import mqtt, { MqttClient } from 'mqtt';
import { handleMessage } from './index';
import dotenv from 'dotenv';
dotenv.config();

export function startMqtt(): MqttClient {
  const client = mqtt.connect(process.env.MQTT_URL!);

  client.on('connect', () => {
    console.log('MQTT: connected to', process.env.MQTT_URL);

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
      console.error(
        `Error in handleMessage:\n`,
        err,
        `\nTopic: ${topic}\nPayload: ${msg}`
      );
    });
  });

  return client;
}
