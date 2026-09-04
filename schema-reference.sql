-- Reference only — this is the schema the worker.js query assumes.
-- If sitepragati-db already has a "customers" (or similarly named) table with
-- different column names, don't run this — just edit the SQL in worker.js
-- to match your real columns instead of creating a duplicate table.

CREATE TABLE IF NOT EXISTS customers (
  unique_id TEXT PRIMARY KEY,          -- e.g. 'GzrMTOY0dCmV7br'
  customer_name TEXT,
  next_payment_due_date TEXT,          -- 'YYYY-MM-DD'
  next_payment_due_amount REAL,        -- 0 when fully paid up
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Example row for this site:
-- INSERT INTO customers (unique_id, customer_name, next_payment_due_date, next_payment_due_amount)
-- VALUES ('GzrMTOY0dCmV7br', 'Disha CET Academy', '2026-10-01', 12000);
