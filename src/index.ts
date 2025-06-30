import { supabase } from './supabase';
import { startMqtt } from './mqttClient';

type SensorType = 'light' | 'temperature' | 'water_level' | 'water_temperature';

export async function handleMessage(topic: string, msg: string) {
  const parts = topic.split('/');
  const now = new Date().toISOString(); // ISO string para o REST

  if (parts[0] === 'sensor') {
    const deviceId = parts[1];
    let sensorType: SensorType;
    let value: unknown;

    if (parts[2] === 'water') {
      sensorType = parts[3] === 'level' 
        ? 'water_level' 
        : 'water_temperature';
      value = parts[3] === 'level'
        ? Boolean(Number(msg))
        : Number(msg);
    } else {
      sensorType = parts[2] as SensorType;
      if (sensorType === 'light') {
        value = Number(msg);
      } else {
        value = JSON.parse(msg);
      }
    }

    const { error } = await supabase
      .from('sensor_data')
      .insert({
        time: now,
        device_id: deviceId,
        sensor_type: sensorType,
        value,
      });

    if (error) console.error('Supabase insert sensor_data error', error);
    else console.log(`↑ sensor_data (${deviceId}, ${sensorType})`);

  } else if (parts[0] === 'state') {
    const deviceId = parts[1];
    const kind = parts[2]; // buttons|trays|leds|fans
    const table = `state_${kind}`;

    let insertObj: any = { time: now, device_id: deviceId };

    if (kind === 'leds') {
      insertObj.brightness = Number(msg);
    } else {
      insertObj.payload = JSON.parse(msg);
    }

    const { error } = await supabase
      .from(table)
      .insert(insertObj);

    if (error) console.error(`Supabase insert ${table} error`, error);
    else console.log(`↑ ${table} (${deviceId})`);
  }
}

startMqtt();
