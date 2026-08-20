# Frontend EmailJS Migration & Backend SMTP Removal Walkthrough

## 1. Executive Summary
This document provides a comprehensive record of the migration of the contact notification mechanism in **Manufolio** from backend JavaMailSender (SMTP) to the frontend EmailJS browser SDK (`@emailjs/browser`). 

The migration completely resolves production connection timeouts (`SocketTimeoutException`) on Render when attempting outbound connections to `smtp.gmail.com:587` / `smtp.gmail.com:465`, while maintaining database persistence in MySQL, Admin/CMS functionality, CORS rules, and existing UI/UX animations.

---

## 2. Original Architecture
Previously, contact form submissions followed a single linear path:
```
React Contact Form → Axios POST /api/contact/submit → Spring Boot ContactController → ContactServiceImpl → MySQL Persistence → Transaction Commit → ContactSubmittedEvent → ContactEventListener → @Async("mailExecutor") → EmailNotificationServiceImpl → JavaMailSender → Gmail SMTP → Owner Inbox
```

---

## 3. Production SMTP Failure
In production on Render (`https://manufolio.onrender.com`), outbound TCP socket connections to Gmail SMTP were consistently blocked or timed out:
```
MailConnectException: Couldn't connect to host, port: smtp.gmail.com, 587 / 465
java.net.SocketTimeoutException: Connect timed out
```
Despite the email delivery failure, database persistence succeeded (e.g. `messageId=57`).

---

## 4. Root Cause
Render free/hosted application environments restrict outbound TCP connections to external SMTP ports (587 / 465) to prevent spam abuse. Since backend SMTP cannot establish direct sockets, email delivery must be decoupled from the Spring Boot container and executed from the client browser via HTTPS API calls (EmailJS).

---

## 5. New Architecture
```
                        ┌──────────────────────┐
                        │   React Contact Form │
                        └──────────┬───────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
                ┌────────────────┐   ┌─────────────────┐
                │ Spring Boot API│   │ EmailJS Browser │
                └───────┬────────┘   └────────┬────────┘
                        │                     │
                        ▼                     ▼
                   ┌─────────┐          ┌───────────┐
                   │  MySQL  │          │  EmailJS  │
                   └────┬────┘          └─────┬─────┘
                        │                     │
                        ▼                     ▼
                   Admin/CMS                Gmail
                                              │
                                              ▼
                                         Owner Inbox
```

---

## 6. Files Inspected
- **Frontend**:
  - `frontend/package.json`
  - `frontend/src/components/Contact/Contact.jsx`
  - `frontend/src/api/services/contactService.js`
  - `frontend/src/pages/admin/AdminDashboard.jsx`
  - `frontend/.env.example`
- **Backend**:
  - `backend/pom.xml`
  - `backend/src/main/resources/application.properties`
  - `backend/.env.example`
  - `backend/src/main/java/com/manufolio/controller/ContactController.java`
  - `backend/src/main/java/com/manufolio/service/impl/ContactServiceImpl.java`
  - `backend/src/main/java/com/manufolio/entity/Contact.java`
  - `backend/src/main/java/com/manufolio/dto/ContactDTO.java`

---

## 7. Files Modified
- [`frontend/package.json`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/package.json): Added `@emailjs/browser` dependency.
- [`frontend/src/api/services/emailService.js`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/src/api/services/emailService.js): Created frontend EmailJS service to handle configuration and email dispatch.
- [`frontend/src/components/Contact/Contact.jsx`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/src/components/Contact/Contact.jsx): Modified submission flow to trigger EmailJS after backend database confirmation and handle success/failure matrix.
- [`frontend/.env.example`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/frontend/.env.example): Added EmailJS variable placeholders.
- [`backend/src/main/java/com/manufolio/service/impl/ContactServiceImpl.java`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/src/main/java/com/manufolio/service/impl/ContactServiceImpl.java): Removed `ApplicationEventPublisher` and `ContactSubmittedEvent` invocation.
- [`backend/pom.xml`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/pom.xml): Removed `spring-boot-starter-mail` dependency.
- [`backend/src/main/resources/application.properties`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/src/main/resources/application.properties): Removed `spring.mail.*` and `app.mail.*` configuration.
- [`backend/.env.example`](file:///c:/Users/Manu%20Anandan/Desktop/My%20Projects/Manufolio/backend/.env.example): Removed obsolete `MAIL_*` environment variable templates.

---

## 8. Files Removed
- `backend/src/main/java/com/manufolio/listener/ContactEventListener.java`
- `backend/src/main/java/com/manufolio/event/ContactSubmittedEvent.java`
- `backend/src/main/java/com/manufolio/service/EmailNotificationService.java`
- `backend/src/main/java/com/manufolio/service/impl/EmailNotificationServiceImpl.java`
- `backend/src/test/java/com/manufolio/service/EmailNotificationServiceTest.java`
- `backend/src/main/java/com/manufolio/config/AsyncConfig.java`

---

## 9. EmailJS Configuration
Environment variables used by Vite:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Template parameters mapped in `emailService.js`:
- `from_name`: `contactData.name`
- `from_email`: `contactData.email`
- `phone`: `contactData.phone`
- `message`: `contactData.message`
- `reply_to`: `contactData.email`
- `submitted_at`: Formatted timestamp (IST)

---

## 10. Failure Matrix Implementation
1. **Database Success + EmailJS Success**: Full success state ("Message Sent Successfully!").
2. **Database Success + EmailJS Failure**: Success state displaying saved status with a non-destructive notice: *"Your message was received and saved in database, but email notification delivery failed."* (Does NOT ask user to resubmit).
3. **Database Failure**: EmailJS is NOT triggered. Server error message shown ("Unable to reach the server right now.").
4. **EmailJS Unconfigured**: Warning logged in console, DB persistence completes smoothly.

---

## 11. Security Audit
- No Gmail passwords, App Passwords, or private keys exist in frontend code or environment files.
- Frontend includes only public, browser-safe EmailJS keys.
- `.env` files remain protected by `.gitignore`.

---

## 12. Verification & Testing
- **Frontend Build**: `vite build` completed successfully with 0 errors.
- **Frontend Lint**: `eslint` passed with 0 errors.
- **Backend Tests**: `mvn clean test` completed with all test cases passing.
- **Database Persistence**: `POST /api/contact/submit` creates records in MySQL independently of EmailJS status.
- **Admin/CMS**: `AdminDashboard` and `AdminController` functionality preserved without disruption.

---

## 13. User Action Required
To enable live email delivery:
1. Sign up / log into [EmailJS](https://www.emailjs.com/).
2. Create an Email Service connected to your Gmail account.
3. Create an Email Template with fields `from_name`, `from_email`, `phone`, `message`, `submitted_at`, and set `Reply-To: {{reply_to}}`.
4. Copy **Service ID**, **Template ID**, and **Public Key**.
5. Add variables to local `.env` and Vercel environment settings (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`).
6. Redeploy frontend on Vercel.
