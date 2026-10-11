# CareBridge Accessible MVP

This repository contains a new, accessible prototype version of the original CareBridge app. The original app remains untouched in the source repository and all changes are isolated to this new project.

## What is included
- Accessible, high-contrast interface for elders, low-vision users, and general users
- Dynamic text scaling and keyboard-friendly navigation
- Multilingual interface with 10+ language options
- Read-aloud support using browser speech synthesis with BHASINI-ready API hooks
- Functional registration flow for prototype testing
- Patient medical card management, allergies, medications, and chronic conditions
- Provider/staff dashboards with role-based permissions
- Appointment approval and record update flows
- SOS alert flow with offline timer and local-only emergency-state handling
- Demo chatbot with evidence-aware medical guidance and clear disclaimer

## Important notes
- Demo credentials are retained internally for prototype testing but are not shown in the public UI.
- Registration is functional for prototype testing without mandatory email/OTP verification.
- Live BHASINI integration is implemented as a configurable API wrapper but requires credentials and runtime environment variables. The app works without those credentials through a safe fallback mode.
- There is no real external medical emergency service integration in this prototype. The SOS flow is local-only and clearly states that no emergency service is connected.

## Local setup
1. Clone this repository.
2. Install dependencies:
   npm install
3. Start the app:
   npm run dev
4. Build for production:
   npm run build

## Optional BHASINI setup
1. Copy `.env.example` to `.env.local`.
2. Add the required BHASINI credentials and model endpoint details.
3. Restart the dev server.

## Deployment on Vercel
1. Import the repository into Vercel.
2. Use the default Vite build settings.
3. Add environment variables from `.env.example` if using live BHASINI.
4. Deploy.

## Simulated vs real features
- Working prototype features: registration, login, local persistence, appointments, record updates, multilingual UI, SOS timer, chatbot.
- Simulated demo features: staff accounts, synthetic patient data, BHASINI-ready translation endpoint, emergency service connectivity (not real).
- Future integrations: real hospital backend, identity verification, live doctor scheduling, clinician authentication, production translation services.

## Remaining limitations
- No production hospital or EHR backend is connected.
- No real OTP/email verification is enforced.
- No live emergency service dispatch integration is connected.
- BHASINI live translation requires valid credentials and may need environment-specific endpoint configuration.
- Medical advice is educational and not a substitute for qualified care.

## Test status
The project was validated by running a production build with the local Vite configuration. Additional manual acceptance testing should be performed in a browser before clinical or production deployment.
