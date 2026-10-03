---
name: Airlink email testing
description: Restrictions on testing Airlink's SMTP enquiry notifications.
---

For Airlink, do not send test emails to customers without explicit approval.

**Why:** The user identified this as an official business website with real company mailboxes.

**How to apply:** Verify SMTP with a connection/authentication check such as Nodemailer's `verify()`; do not send a test message to the configured recipients.