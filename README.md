# NiveshRaksha

**Check. Understand. Protect.**

A hackathon-ready prototype for the SANGYAN tracks:

- Track A — Digital Fraud & Scam Resilience
- Track B — Investor Awareness, Rights & Grievance
- Track E — Misinformation & Content Literacy

## Included prototype features

- ScamCheck with transparent rule-based risk scoring
- TruthLens for misleading-content patterns
- Explainable red flags and safe next steps
- Investor rights / evidence guidance
- Grievance wizard
- English / Hindi / Tamil UI
- Low Data Mode
- Privacy Center
- Local demo history with delete functionality
- Demo scenarios
- Mobile-first responsive design
- AI-ready architecture: the rule engine can later be replaced/augmented by an API service

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

For a production build:

```bash
npm run build
npm run preview
```

## Important

This prototype intentionally does not provide stock tips, buy/sell/hold recommendations, investment predictions, broker promotion or investment-product promotion. It is an educational investor-safety prototype.

The current AI layer is represented by a deterministic rule engine so the prototype works without an API key. For the hackathon, a backend AI service can be added behind an environment-variable-protected API.

## Suggested next implementation

1. Add Node/Express backend.
2. Add an AI provider abstraction.
3. Add official-source verification service.
4. Add secure image/OCR processing for screenshots.
5. Add real speech-to-text.
6. Expand regional language coverage.
7. Add test cases for scam patterns and false positives.
