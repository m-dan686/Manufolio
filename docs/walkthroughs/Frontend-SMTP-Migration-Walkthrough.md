# Frontend Email Notification Migration — SMTP Egress Decoupling Walkthrough

## 1. Executive Summary
This walkthrough documents the technical architecture migration for the **Manufolio** contact notification system. Email delivery has been moved out of the Spring Boot backend while maintaining database persistence in MySQL, Admin CMS functionality, and existing UI/UX animations.

---

## 2. Before Migration Architecture
```text
React/Vite Frontend
        │
        ▼
Spring Boot Backend (Render)
        │
        ├──────────────────────► MySQL Persistence
        │
        └───────(SMTP 587/465)─► Gmail SMTP Server ──► Owner Inbox
```

---

## 3. Production Failure Analysis & Root Cause

### Error Log
```text
MailConnectException: Couldn't connect to host, port: smtp.gmail.com, 465
java.net.SocketTimeoutException: Connect timed out
```

### Technical Root Cause
Render's free/hosted container environment blocks outbound TCP socket connections to external SMTP ports (`587` and `465`) to prevent email spam abuse. 
While Spring Boot successfully persisted every submission to MySQL (e.g. `messageId=57`), the JavaMailSender asynchronous thread (`@Async("mailExecutor")`) consistently timed out attempting outbound TCP socket handshakes with `smtp.gmail.com`.

---

## 4. Why Direct Browser-to-SMTP is Impossible & Unsafe

### Impossible
Browser JavaScript engines (Web APIs) do NOT support raw TCP socket connections required by standard SMTP protocols (`smtp.gmail.com:587` / `465`).

### Unsafe
Hardcoding SMTP passwords, Gmail App Passwords, or private keys inside client-side JavaScript (`VITE_*`) exposes credentials to all web visitors via browser Developer Tools.

---

## 5. Target Architecture

```text
React/Vite Frontend
        │
        ├──────────────────────────► Spring Boot Contact API ──► MySQL
        │
        └─(HTTPS Public API)───────► Browser-Safe Gateway (EmailJS) ──► SMTP/Gmail Service ──► Owner Inbox
```

- **Spring Boot API**: Handles validation, idempotency, and MySQL database persistence. Requires zero SMTP credentials or outbound SMTP socket egress on Render.
- **Browser-Safe Gateway**: Initiates email delivery via client HTTPS requests using public, browser-safe identifiers (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`). EmailJS handles the authenticated SMTP transport to Gmail on its own secure backend.

---

## 6. Detailed Contact Submission Flow

```text
User Submits Form
       │
       ▼
Frontend Validation (GSAP button state "Sending...")
       │
       ▼
POST /api/contact/submit (Spring Boot API)
       │
       ├── FAILURE ─────► Show server error state ("Unable to reach server right now.")
       │                  DO NOT trigger email notification.
       │
       ▼
Backend Confirms MySQL Persistence (201 CREATED)
       │
       ▼
Frontend Calls sendContactEmail() (EmailJS HTTPS API)
       │
       ├── SUCCESS ─────► Display normal success UX ("Message Sent Successfully!").
       │
       └── FAILURE ─────► Display saved confirmation with non-destructive notice:
                          "Your message was received and saved in database, but email notification delivery failed."
                          (User is NOT asked to resubmit; duplicate DB records avoided).
```

---

## 7. Security Analysis & Public Credentials Policy

### Frontend Exposed Keys (Allowed)
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

### Prohibited Credentials (Strictly Excluded)
- `MAIL_PASSWORD` / `SMTP_PASSWORD`
- `GMAIL_APP_PASSWORD`
- EmailJS Private Keys
- Backend Secret Tokens

---

## 8. Timestamp & Formatting Specification
Submission timestamps are formatted using explicit local time zone standards (IST):
```javascript
const now = new Date();
const formattedDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata"
}).format(now) + " IST";
```
Example Output: `20 August 2026, 11:45 AM IST`.

---

## 9. Code Modifications Summary

### Frontend
- [`frontend/package.json`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/package.json): Added `@emailjs/browser`.
- [`frontend/src/api/services/emailService.js`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/src/api/services/emailService.js): Created dedicated EmailJS service.
- [`frontend/src/components/Contact/Contact.jsx`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/src/components/Contact/Contact.jsx): Integrated `sendContactEmail` post-persistence. Preserved GSAP, validation, and double-click prevention (`isSubmitting`).
- [`frontend/.env.example`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/.env.example): Added EmailJS variable template.

### Backend
- [`backend/src/main/java/com/manufolio/service/impl/ContactServiceImpl.java`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/src/main/java/com/manufolio/service/impl/ContactServiceImpl.java): Removed `ApplicationEventPublisher` and `ContactSubmittedEvent`.
- [`backend/pom.xml`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/pom.xml): Removed `spring-boot-starter-mail`.
- [`backend/src/main/resources/application.properties`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/src/main/resources/application.properties): Removed `spring.mail.*` and `app.mail.*`.
- [`backend/.env.example`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/.env.example): Removed obsolete `MAIL_*` environment variable templates.

### Removed Files
- `backend/src/main/java/com/manufolio/listener/ContactEventListener.java`
- `backend/src/main/java/com/manufolio/event/ContactSubmittedEvent.java`
- `backend/src/main/java/com/manufolio/service/EmailNotificationService.java`
- `backend/src/main/java/com/manufolio/service/impl/EmailNotificationServiceImpl.java`
- `backend/src/test/java/com/manufolio/service/EmailNotificationServiceTest.java`
- `backend/src/main/java/com/manufolio/config/AsyncConfig.java`

---

## 10. Testing & Verification

1. **Frontend Linting**: `npm run lint` — **PASSED (0 errors)**.
2. **Frontend Build**: `npm run build` — **PASSED (0 errors)**.
3. **Backend Unit/Integration Tests**: `mvn clean test` — **PASSED (8 tests run, 0 failures, 0 errors)**.
4. **Idempotency & DB Verification**: Tested `POST /api/contact/submit` idempotency retry handling. DB records created successfully without duplicates.
5. **Admin CMS Verification**: Verified stats, listing, search, mark read, and delete API endpoints.

---

## 11. User Setup Steps
1. Create an EmailJS service connected to Gmail.
2. Create an Email Template (`from_name`, `from_email`, `phone`, `message`, `submitted_at`, `Reply-To: {{reply_to}}`).
3. Add `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` to Vercel environment settings.
4. Redeploy frontend on Vercel.
