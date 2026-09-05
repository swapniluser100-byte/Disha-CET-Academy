-- Reference only. This reflects the actual customers table fields you shared,
-- plus one addition: a unique_id column that another script of yours will
-- populate/map for each site (per your note — I'm not building that mapping here).
--
-- Table name assumed to be "customers" — if it's actually named something else,
-- change the FROM clause in worker.js to match.

-- Existing columns (as given):
--   id INTEGER PRIMARY KEY AUTOINCREMENT
--   business_name TEXT NOT NULL
--   contact_name TEXT
--   phone TEXT
--   address TEXT
--   next_payment_due_date TEXT       -- 'YYYY-MM-DD'
--   next_payment_due_amount REAL
--   created_at TEXT DEFAULT CURRENT_TIMESTAMP

-- Addition needed for the site gate to look a customer up by unique_id
-- (handled by your other script, shown here only for reference):
-- ALTER TABLE customers ADD COLUMN unique_id TEXT;
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_unique_id ON customers(unique_id);

-- Example:
-- UPDATE customers SET unique_id = 'GzrMTOY0dCmV7br' WHERE id = 1;