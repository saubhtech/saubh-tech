import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function findUserByWhatsApp(number) {
  const result = await pool.query(
    'SELECT * FROM public."user" WHERE whatsapp = $1',
    [number]
  );
  return result.rows[0] || null;
}

export async function createUser(whatsapp, fname, passcode) {
  const result = await pool.query(
    `INSERT INTO public."user"
     (whatsapp, fname, usertype, status,
      passcode, "passcodeExpiry", created, updated)
     VALUES ($1, $2, 'GW', 'A', $3,
      NULL, NOW(), NOW())
     RETURNING *`,
    [whatsapp, fname, passcode]
  );
  return result.rows[0];
}

export async function updatePasscode(whatsapp, passcode, expiryMinutes = 2) {
  const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
  await pool.query(
    `UPDATE public."user"
     SET passcode = $1,
         "passcodeExpiry" = $2,
         updated = NOW()
     WHERE whatsapp = $3`,
    [passcode, expiry, whatsapp]
  );
}
