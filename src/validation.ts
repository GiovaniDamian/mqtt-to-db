export function validatePayload(
  topic: string,
  raw: string
): { valid: true; parsed: any } | { valid: false; error: string } {
  const trimmed = raw.trim();
  const parts = topic.split('/');

  try {
    if (parts[0] === 'sensor') {
      if (parts[2] === 'light') {
        const v = Number(trimmed);
        if (Number.isNaN(v)) {
          throw new Error('light must be an integer number');
        }
        return { valid: true, parsed: v };
      }

      if (parts[2] === 'temperature') {
        const arr = JSON.parse(trimmed);
        if (!Array.isArray(arr) || arr.length !== 2) {
          throw new Error('temperature must be an array [temperature, humidity]');
        }
        return { valid: true, parsed: arr };
      }

      if (parts[2] === 'water' && parts[3] === 'level') {
        const b = Number(trimmed);
        if (b !== 0 && b !== 1) {
          throw new Error('water/level must be 0 or 1');
        }
        return { valid: true, parsed: Boolean(b) };
      }

      if (parts[2] === 'water' && parts[3] === 'temperature') {
        const t = Number(trimmed);
        if (Number.isNaN(t)) {
          throw new Error('water/temperature must be a number');
        }
        return { valid: true, parsed: t };
      }

      throw new Error('Unsupported sensor topic');
    }

    if (parts[0] === 'state') {
      if (parts[2] === 'buttons') {
        const obj = JSON.parse(trimmed);
        if (typeof obj !== 'object' || Array.isArray(obj)) {
          throw new Error('buttons must be a JSON object');
        }
        return { valid: true, parsed: obj };
      }

      if (parts[2] === 'trays') {
        const arr = JSON.parse(trimmed);
        if (!Array.isArray(arr)) {
          throw new Error('trays must be a JSON array');
        }
        return { valid: true, parsed: arr };
      }

      if (parts[2] === 'leds') {
        const br = Number(trimmed);
        if (!Number.isInteger(br) || br < 0 || br > 100) {
          throw new Error('leds must be an integer between 0 and 100');
        }
        return { valid: true, parsed: br };
      }

      if (parts[2] === 'fans') {
        const arr = JSON.parse(trimmed);
        if (!Array.isArray(arr)) {
          throw new Error('fans must be a JSON array of booleans');
        }
        return { valid: true, parsed: arr };
      }

      throw new Error('Unsupported state topic');
    }

    return { valid: false, error: 'Unsupported topic' };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}
