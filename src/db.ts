import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  host:     process.env.PG_HOST,
  port:     Number(process.env.PG_PORT),
  user:     process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    // Permite usar o certificado autofirmado do Supabase
    rejectUnauthorized: false
  }
});

// Teste rápido de conexão
pool
  .query('SELECT NOW()')
  .then(res => console.log('✅ DB conectado em', res.rows[0].now))
  .catch(err => console.error('❌ Falha ao conectar no DB:', err));
