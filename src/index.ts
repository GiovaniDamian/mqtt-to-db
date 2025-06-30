import { supabase } from './supabase';
import { startMqtt } from './mqttClient';
import { validatePayload } from './validation';

type SensorType = 'light' | 'temperature' | 'water_level' | 'water_temperature';

export async function handleMessage(topic: string, msg: string) {
  const now = new Date().toISOString();

  const validation = validatePayload(topic, msg);
  if (!validation.valid) {
    console.warn(`Discarding invalid payload on "${topic}": ${validation.error}`);
    return;
  }

  const parsed = validation.parsed;
  const parts = topic.split('/');
  const root = parts[0];
  const deviceId = parts[1];

  if (root === 'sensor') {
    let sensorType: SensorType;
    if (parts[2] === 'water') {
      sensorType = parts[3] === 'level' ? 'water_level' : 'water_temperature';
    } else {
      sensorType = parts[2] as SensorType;
    }

    const { error } = await supabase
      .from('sensor_data')
      .insert({
        time: now,
        device_id: deviceId,
        sensor_type: sensorType,
        value: parsed,
      });

    if (error) {
      console.error('Error inserting into sensor_data:', error);
    } else {
      console.log(`↑ sensor_data | device: ${deviceId} | type: ${sensorType}`);
    }

  } else if (root === 'state') {
    const kind = parts[2]; // buttons | trays | leds | fans
    const tableName = `state_${kind}`;

    const insertObj: Record<string, any> = {
      time: now,
      device_id: deviceId,
    };

    if (kind === 'leds') {
      insertObj.brightness = parsed;
    } else {
      insertObj.payload = parsed;
    }

    const { error } = await supabase
      .from(tableName)
      .insert(insertObj);

    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
    } else {
      console.log(`↑ ${tableName} | device: ${deviceId}`);
    }
  }
}

startMqtt();
