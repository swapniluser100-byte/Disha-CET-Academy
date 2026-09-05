(function () {
  // Unique customer id for this site, looked up in sitepragati-db.
  var CUSTOMER_ID = "GzrMTOY0dCmV7br";

  // TODO: replace with your deployed worker URL, e.g.
  // "https://disha-cet-access-check.YOUR-SUBDOMAIN.workers.dev/check-access"
  var CHECK_URL = "https://disha-cet-access-check.YOUR-SUBDOMAIN.workers.dev/check-access";

  function overlay() {
    return document.getElementById("access-gate-overlay");
  }

  function showRenewalScreen(detail) {
    var el = overlay();
    if (!el) return;
    var dueLine = "";
    if (detail && detail.nextPaymentDueDate) {
      dueLine =
        '<div style="font-size:13px;color:#8F97AD;margin-top:16px;">Due since ' +
        detail.nextPaymentDueDate +
        (detail.nextPaymentDueAmount
          ? " · Amount due: ₹" + detail.nextPaymentDueAmount
          : "") +
        "</div>";
    }
    var intro = detail && detail.businessName
      ? "The subscription for " + detail.businessName + " is overdue."
      : "This website's subscription payment is overdue.";
    el.innerHTML =
      '<div style="max-width:440px;text-align:center;padding:32px;">' +
      '<div style="font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#E8A33D;margin-bottom:14px;">Site access</div>' +
      '<div style="font-family:\'Source Serif 4\',serif;font-size:28px;color:#fff;margin-bottom:14px;">Renewal required</div>' +
      '<div style="font-size:14.5px;color:#C9CFDD;line-height:1.6;">' + intro + ' Please contact SitePragati to renew access and restore the site.</div>' +
      dueLine +
      "</div>";
    el.style.pointerEvents = "auto";
  }

  function removeOverlay() {
    var el = overlay();
    if (el) el.parentNode.removeChild(el);
  }

  fetch(CHECK_URL + "?id=" + encodeURIComponent(CUSTOMER_ID))
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data && data.renewalRequired) {
        showRenewalScreen(data);
      } else {
        removeOverlay();
      }
    })
    .catch(function (err) {
      // Network/worker unreachable — fail OPEN so an outage in the checker
      // doesn't take the whole live site down. Flip this to showRenewalScreen()
      // if you'd rather fail closed.
      console.warn("Access check failed, allowing access:", err);
      removeOverlay();
    });
})();
