/**
 * Disha CET Academy — access-gate worker.
 *
 * Looks up a customer by unique_id in the sitepragati-db D1 database and
 * reports whether the site should be blocked for "renewal required":
 * the site is blocked only if the next payment due date is in the past
 * AND the next payment due amount is not zero.
 *
 * Deploy with: wrangler deploy
 * Endpoint:    GET /check-access?id=<unique_id>
 */

const ALLOWED_ORIGIN = "*"; // TODO: replace with your real site origin, e.g. "https://dishacet.example.in"

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname !== "/check-access") {
      return json({ error: "Not found" }, 404);
    }

    const uniqueId = url.searchParams.get("id");
    if (!uniqueId) {
      return json({ error: "Missing id parameter" }, 400);
    }

    try {
      // Table: customers (name assumed — adjust FROM clause if it's called something else).
      // Confirmed columns: business_name, next_payment_due_date ('YYYY-MM-DD'), next_payment_due_amount.
      // unique_id is expected to be added/populated by a separate script per your setup.
      const row = await env.DB
        .prepare(
          "SELECT business_name, next_payment_due_date, next_payment_due_amount FROM customers WHERE unique_id = ?"
        )
        .bind(uniqueId)
        .first();

      if (!row) {
        // No matching customer — fail closed so an unrecognised/mistyped id doesn't silently grant access.
        return json({ found: false, renewalRequired: true });
      }

      const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const dueDate = row.next_payment_due_date;
      const dueAmount = Number(row.next_payment_due_amount ?? 0);

      const isOverdue = Boolean(dueDate) && dueDate < today;
      const renewalRequired = isOverdue && dueAmount !== 0;

      return json({
        found: true,
        renewalRequired,
        businessName: row.business_name,
        nextPaymentDueDate: dueDate,
        nextPaymentDueAmount: dueAmount,
      });
    } catch (err) {
      // On a server/query error we fail OPEN (don't block the live site over an infra hiccup).
      // The client script also fails open on network errors for the same reason.
      return json({ error: "Server error", detail: String(err) }, 500);
    }
  },
};
