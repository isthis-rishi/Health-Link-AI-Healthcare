# HealthLink — AI-Powered Community Healthcare System

> **Your health, connected. Anytime. Anywhere.**

**Live Project:** [HealthLink](https://health-link-khaki.vercel.app/)


HealthLink is an AI-powered community healthcare platform designed to connect patients, clinics, healthcare providers, and pharmacies in one place. It aims to make healthcare coordination easier through symptom checking, emergency SOS requests, appointment booking, prescription management, nearby-service discovery, and medicine inventory tracking.

## Contents
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Typical Workflow](#typical-workflow)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Security and Privacy](#security-and-privacy)
- [Testing Checklist](#testing-checklist)
- [Limitations and Medical Disclaimer](#limitations-and-medical-disclaimer)
- [Future Scope](#future-scope)
- [Team](#team)
- [License](#license)

## Research Publication

**HealthLink: Design and Implementation of an AI-Powered Community Healthcare Ecosystem for Accessible and Equitable Care**

Published in the *International Journal of Innovative Research in Technology (IJIRT)*.

[Read the published paper](https://ijirt.org/article?manuscript=197571)

## Project Links

| Resource | Link |
|---|---|
| Live Application | [https://health-link-khaki.vercel.app/](https://health-link-khaki.vercel.app/) |

## Publication

A research paper based on this project was published in the **International Journal of Innovative Research in Technology (IJIRT)**.

- **Paper title:** *HealthLink: Design and Implementation of an AI-Powered Community Healthcare Ecosystem for Accessible and Equitable Care*
- **Registration ID:** 197571
- **Publication date:** April 2026

## Research Publication

**Paper:** *HealthLink: Design and Implementation of an AI-Powered Community Healthcare Ecosystem for Accessible and Equitable Care*

**Journal:** IJIRT (International Journal of Innovative Research in Technology)

**Publication link:** [Read the published paper](ADD_IJIRT_PAPER_URL_HERE)

> Replace `ADD_IJIRT_PAPER_URL_HERE` with the direct URL to your published IJIRT paper.

## Overview

Healthcare workflows can become difficult when patients, clinics, and pharmacies use disconnected processes. Finding suitable care, requesting emergency help, booking appointments, and checking medicine availability can take extra time.

HealthLink is designed as a shared digital platform for these needs. It combines patient-facing tools with clinic and pharmacy portals, with AI-assisted symptom analysis and emergency coordination as core project features.

## Problem Statement

HealthLink aims to address common community healthcare challenges:
- Delays in contacting nearby medical facilities during emergencies.
- Limited visibility into medicine availability at local pharmacies.
- Difficulty connecting preliminary symptom assessment with professional care.
- Fragmented appointment, prescription, and patient-information workflows.
- The need to protect sensitive health information and control access to it.

## Key Features

### AI Symptom Checker
Users can describe symptoms and receive preliminary AI-assisted guidance. The planned AI layer uses natural-language processing and machine-learning techniques to process symptom descriptions and identify possible conditions. It supports early assessment; it does not replace a clinician's diagnosis.

### Emergency SOS
The SOS workflow is designed to help users request assistance during an emergency:
- SOS activation from the patient interface.
- Location sharing, subject to device and browser permissions.
- Alerts intended for nearby registered clinics and pharmacies.
- Status updates where supported by the configured application.

Actual delivery depends on permissions, network availability, backend configuration, and enabled notification services.

### Role-Based Portals
- **Patient:** Symptom checker, SOS, appointments, prescriptions, nearby services, and health information.
- **Clinic / Provider:** Emergency requests, appointment management, and patient-related workflows.
- **Pharmacy:** Prescription handling and medicine inventory.
- **Administrator:** System-level management where implemented.

### Appointment Booking
Patients can request and manage clinic appointments. Provider-side views support handling appointment requests and related status updates.

### Prescription Management
Users can submit and track prescriptions, while pharmacy users can review prescription-related requests where supported.

### Pharmacy Inventory
The pharmacy portal supports medicine inventory workflows, including medicine names, stock quantities, and prices. Inventory accuracy depends on pharmacies keeping records current.

### Nearby Healthcare Services
The platform is designed to help users discover nearby clinics and pharmacies. Location-based features require appropriate permissions and correctly configured service-location data.

### Patient Dashboard and Health Insights
The patient dashboard brings together health profile information and activity such as appointments and prescriptions. The interface also includes analytics, health trends, risk indicators, and preventive recommendations. These insights are informational and depend on the available data and implemented logic.

## User Roles

| Role | Main purpose |
|---|---|
| Patient | Access symptom guidance, SOS, appointments, prescriptions, nearby services, and personal health information |
| Clinic / Healthcare Provider | Review emergency requests and manage appointments and patient-related workflows |
| Pharmacy | Manage inventory and handle prescription-related workflows |
| Administrator | Manage system-level access and operations where implemented |

## Typical Workflow

1. Create an account or sign in and select the appropriate role.
2. Describe symptoms in the symptom checker for preliminary guidance.
3. Choose an action: request an appointment, explore nearby services, manage a prescription, or use SOS in an emergency.
4. Share location when required; location-based features need device or browser permission.
5. Clinics and pharmacies use their portals to handle incoming requests and update relevant information.
6. Review available appointments, prescriptions, and health insights from the patient dashboard.

## Architecture

HealthLink is designed as a full-stack application with user-interface, application/API, AI-processing, and data components.

```text
┌───────────────────────────────────────────┐
│ Frontend                                  │
│ React · Tailwind CSS / Material UI         │
│ Patient, Clinic, Pharmacy Portals          │
└─────────────────────┬─────────────────────┘
                      │ HTTP / real-time events
┌─────────────────────▼─────────────────────┐
│ Application Backend                       │
│ Node.js · Express · JWT Authentication     │
└──────────────┬────────────────┬───────────┘
               │                │
┌──────────────▼─────────┐  ┌───▼───────────────┐
│ AI / NLP Service       │  │ Real-time Services│
│ Python · NLP / ML      │  │ Firebase/WebSockets│
└──────────────┬─────────┘  └──────────────────┘
               │
┌──────────────▼────────────────────────────┐
│ Data Layer                                │
│ MySQL · Firebase Realtime Database        │
└───────────────────────────────────────────┘
```

This diagram describes the intended component separation. Exact service boundaries, integrations, and deployment details should be checked against the current source code.

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | Interactive user interface |
| UI styling | Tailwind CSS / Material UI | Responsive layouts and reusable components |
| Backend runtime | Node.js 20.x | Application server runtime |
| Backend framework | Express.js | API and request handling |
| AI runtime | Python 3.11 | Symptom-processing service |
| AI / NLP libraries | NLTK, spaCy, scikit-learn | Text processing and machine-learning workflows |
| Relational database | MySQL 8.0 | Structured application data |
| Real-time data | Firebase Realtime Database | Real-time updates where configured |
| Authentication | JWT | Token-based authentication |
| Password security | bcrypt | Password hashing |
| Real-time communication | WebSockets | Live notifications and status updates where implemented |
| Containerization | Docker | Application packaging and deployment |

Some project specifications also mention alternative technologies and optional integrations. Not every optional service should be assumed to be enabled in every deployment.

## Getting Started

### Prerequisites
Install the tools required by the components you intend to run:
- Git
- Node.js 20.x and npm
- Python 3.11
- MySQL 8.0
- Firebase project/configuration, if using Firebase-backed features
- Docker, if using containers

Verify core installations:

```bash
git --version
node --version
npm --version
python --version
mysql --version
```

On some systems, use `python3` instead of `python`.

### 1. Clone the repository

Replace `<repository-url>` with the clone URL from your GitHub repository.

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install frontend dependencies

Change to the frontend directory used by your repository:

```bash
cd frontend
npm install
```

The exact directory name and available npm scripts depend on the repository layout. Check `package.json` before running the application.

### 3. Set up the Python AI environment

If the AI/NLP service is maintained as a separate Python component, create a virtual environment in that component's directory.

**Windows PowerShell**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

If the component includes a `requirements.txt`, install its dependencies:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Confirm the actual service directory and dependency file in your repository.

### 4. Set up MySQL

Start MySQL 8.0 and create a local development database:

```sql
CREATE DATABASE healthlink;
```

Configure the application with the database connection details it expects. Review the actual schema or migration files before initializing tables; the required commands depend on the implementation.

### 5. Configure Firebase, if required

If your local setup uses Firebase Realtime Database, configure the Firebase project credentials and database URL expected by the application. Keep private credentials out of source control.

### 6. Configure environment settings

Inspect the source code for required settings, which may include:
- Database connection details
- JWT signing secret
- Firebase configuration, if enabled
- AI service URL or settings, if the AI service runs separately
- Frontend API base URL
- Mapping, SMS, or other third-party credentials, if enabled

The exact environment-variable names depend on the code and are not assumed here. If possible, provide a sanitized `.env.example` with placeholder values. Never commit real credentials.

## Running Locally

Commands depend on the scripts defined in each component.

### Frontend
From the frontend directory, inspect `package.json`. If a `dev` script exists, start it with:

```bash
npm run dev
```

Open the local URL printed in the terminal.

### Backend
From the backend directory, install dependencies using the package manifest and run the development or start script defined in `package.json`. For example, an npm-based project may provide:

```bash
npm run dev
```

Check that this script actually exists before using it.

### AI / NLP service
Activate the Python virtual environment and use the startup command defined by the AI service. The entry point depends on the implementation.

### Local integration checks
- Confirm the frontend can reach the backend.
- Confirm the backend can connect to MySQL.
- Verify Firebase-backed features if configured.
- Check location permission for location-dependent features.
- Confirm authentication and role-specific access behave as expected.
- Verify external integrations only if they are configured.

## Security and Privacy

Health information is sensitive. The project design identifies JWT authentication, bcrypt password hashing, consent-based access, and AES-256 encryption as security approaches. Verify each control in the actual implementation before relying on it.

Recommended practices:
- Keep secrets and service-account credentials out of Git.
- Use HTTPS in deployed environments.
- Enforce role-based authorization on the server, not only in the UI.
- Validate incoming data on the backend.
- Restrict access to personal and medical records.
- Share location only when necessary and with appropriate permission.
- Avoid real patient data in development and demo environments.
- Prevent logs from exposing tokens or sensitive health information.
- Review database access, backups, retention, and auditing.
- Follow applicable privacy and healthcare regulations.

## Testing Checklist

- [ ] Registration and sign-in work as expected.
- [ ] Users can access only the portal and data allowed for their role.
- [ ] Symptom checker handles input safely.
- [ ] SOS flow handles location permission being granted or denied.
- [ ] Emergency requests and status updates work where configured.
- [ ] Appointment requests can be created and reviewed.
- [ ] Prescription workflows behave as expected.
- [ ] Pharmacy inventory changes are reflected correctly.
- [ ] Database and Firebase connections work where configured.
- [ ] Errors are handled without exposing private data.
- [ ] The interface works on desktop and mobile screen sizes.

Automated test commands depend on the test files and scripts present in the repository.

## Limitations and Medical Disclaimer

HealthLink is an academic software project intended to support healthcare coordination and provide preliminary, AI-assisted information. It is **not a substitute for professional medical advice, diagnosis, or treatment**.

- Symptom-checker output may be incomplete or incorrect and must not be treated as a diagnosis.
- Do not delay emergency care while using the application. Contact local emergency services when urgent assistance is needed.
- SOS delivery depends on device permissions, connectivity, server availability, and configured notification services. Do not assume an alert reached a provider unless the application confirms it.
- Nearby-service and medicine-stock information may be incomplete or outdated.
- Health analytics and risk indicators are informational and should be reviewed by a qualified healthcare professional.
- Use real patient data only with appropriate authorization, safeguards, and compliance procedures.

## Future Scope

Possible areas for further development include:
- Improving and validating symptom-analysis models with suitable clinical oversight.
- Improving real-time communication and emergency notification reliability.
- Expanding appointment and consultation workflows.
- Improving medicine inventory updates and availability visibility.
- Extending mobile support and accessibility.
- Strengthening privacy, auditing, and consent-management controls.
- Evaluating performance, reliability, and usability through structured testing.

These are potential enhancements, not a claim that every item is already implemented.

## Team

| Team Member | Registration Number |
|---|---|
| Gurinder Singh | 25MCA10097 |
| Rishi Kumar | 25MCA10100 |
| Shantanu Pandit | 25MCA10083 |
| Jatin Guleria | 25MCA10080 |

**Project guide:** Dr. M. K. Jayanthi, Professor.

## License

Add the license that applies to your repository before distributing the project. If no license file is present, users should not assume they have permission to reuse, modify, or redistribute the code.

---

**HealthLink — connecting people, healthcare providers, and pharmacies for more coordinated community care.**
