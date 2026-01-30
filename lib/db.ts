// lib/db.ts
import { Pool, PoolClient } from 'pg';

// Create a connection pool with optimized settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: false,
});


// Connection event handlers
pool.on('connect', (client) => {
  console.log('✅ New PostgreSQL connection established');
});

pool.on('acquire', (client) => {
  console.log('🔄 Connection acquired from pool');
});

pool.on('remove', (client) => {
  console.log('❌ Connection removed from pool');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err);
  // Don't exit the process on error
});

// Test connection on startup
(async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as now, current_database() as db');
    console.log('✅ Database connected:', {
      time: result.rows[0].now,
      database: result.rows[0].db
    });
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  }
})();

// Helper function to execute queries with retry logic
export async function query(text: string, params?: any[], retries = 3): Promise<any> {
  const start = Date.now();
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    let client: PoolClient | null = null;
    
    try {
      client = await pool.connect();
      const res = await client.query(text, params);
      const duration = Date.now() - start;
      
      console.log('✅ Query executed successfully', { 
        duration: `${duration}ms`, 
        rows: res.rowCount,
        attempt: attempt > 1 ? attempt : undefined 
      });
      
      return res;
    } catch (error: any) {
      lastError = error;
      const duration = Date.now() - start;
      
      console.error(`❌ Query failed (attempt ${attempt}/${retries}):`, {
        error: error.message,
        code: error.code,
        duration: `${duration}ms`
      });

      // Don't retry on specific errors
      if (error.code === '23505' || error.code === '23503' || error.code === '42P01') {
        // Unique violation, foreign key violation, undefined table
        throw error;
      }

      // Wait before retry with exponential backoff
      if (attempt < retries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // All retries failed
  console.error('❌ All query attempts failed');
  throw lastError;
}

// Helper function to get a single row
export async function queryOne(text: string, params?: any[]) {
  try {
    const result = await query(text, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ queryOne error:', error);
    throw error;
  }
}

// Helper function to get multiple rows
export async function queryMany(text: string, params?: any[]) {
  try {
    const result = await query(text, params);
    return result.rows;
  } catch (error) {
    console.error('❌ queryMany error:', error);
    throw error;
  }
}

// Database object with methods
export const db = {
  query,
  queryOne,
  queryMany,
  
  async getClient() {
    return await pool.connect();
  },

  async testConnection() {
    try {
      const result = await query('SELECT NOW() as time, version() as version');
      console.log('✅ Database test connection successful:', {
        time: result.rows[0].time,
        version: result.rows[0].version.split(',')[0]
      });
      return true;
    } catch (error) {
      console.error('❌ Database test connection failed:', error);
      return false;
    }
  },

  async end() {
    await pool.end();
    console.log('🔌 Database pool closed');
  }
};

// User queries with better error handling
export const userQueries = {
  async findByWhatsapp(whatsapp: string) {
    try {
      const result = await query(
        'SELECT * FROM users.users WHERE whatsapp = $1 LIMIT 1',
        [whatsapp]
      );
      return result.rows[0] || null;
    } catch (error: any) {
      if (error.code === '42P01') {
        console.error('❌ Table users.users does not exist!');
      }
      throw error;
    }
  },

  async findByUserId(userid: number) {
    try {
      const result = await query(
        'SELECT * FROM users.users WHERE userid = $1 LIMIT 1',
        [userid]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error finding user by ID:', error);
      throw error;
    }
  },

  async create(fname: string, whatsapp: string, email?: string) {
    try {
      const result = await query(
        'INSERT INTO users.users (fname, whatsapp, email, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [fname, whatsapp, email || null]
      );
      console.log('✅ User created:', result.rows[0]);
      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') {
        console.error('❌ User already exists with this WhatsApp number');
      }
      throw error;
    }
  },

  async deleteByUserId(userid: number) {
    try {
      await query('DELETE FROM users.users WHERE userid = $1', [userid]);
      console.log('✅ User deleted:', userid);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
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

    if (fields.length === 0) {
      console.warn('⚠️ No fields to update');
      return null;
    }

    try {
      values.push(userid);
      const result = await query(
        `UPDATE users.users SET ${fields.join(', ')} WHERE userid = $${paramIndex} RETURNING *`,
        values
      );
      console.log('✅ User updated:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing database connections...');
  await db.end();
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, closing database connections...');
  await db.end();
});

export default pool;