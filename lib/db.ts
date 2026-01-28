// lib/db.ts
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null;
    });
  }
  return pool;
}

export const db = {
  async query(text: string, params?: any[]) {
    const pool = getPool();
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  async getClient() {
    const pool = getPool();
    return await pool.connect();
  },

  async testConnection() {
    try {
      const result = await this.query('SELECT NOW()');
      console.log('✅ Database connected:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }
};

// User queries
export const userQueries = {
  async findByWhatsapp(whatsapp: string) {
    const result = await db.query(
      'SELECT * FROM users.users WHERE whatsapp = $1 LIMIT 1',
      [whatsapp]
    );
    return result.rows[0] || null;
  },

  async findByUserId(userid: number) {
    const result = await db.query(
      'SELECT * FROM users.users WHERE userid = $1 LIMIT 1',
      [userid]
    );
    return result.rows[0] || null;
  },

  async create(fname: string, whatsapp: string) {
    const result = await db.query(
      'INSERT INTO users.users (fname, whatsapp) VALUES ($1, $2) RETURNING *',
      [fname, whatsapp]
    );
    return result.rows[0];
  },

  async deleteByUserId(userid: number) {
    await db.query('DELETE FROM users.users WHERE userid = $1', [userid]);
  },

  async updateUser(userid: number, data: { fname?: string; email?: string; pic?: string }) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.fname) {
      fields.push(`fname = $${paramIndex++}`);
      values.push(data.fname);
    }
    if (data.email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }
    if (data.pic) {
      fields.push(`pic = $${paramIndex++}`);
      values.push(data.pic);
    }

    if (fields.length === 0) return null;

    values.push(userid);
    const result = await db.query(
      `UPDATE users.users SET ${fields.join(', ')} WHERE userid = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }
};