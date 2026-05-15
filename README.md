# Apex Sales Objection Training Simulator

A choose-your-own-adventure style sales training tool for Apex Leadership Co. franchisees. Six scenarios, branching conversations, real-time coaching, post-conversation email practice with AI feedback, and targeted skill drills.

## Features

- **6 objection scenarios**: Revenue split, classroom time (Live/Flex), no outside organizations, Boosterthon competitor, DIY fundraiser, existing fundraiser
- **5-6 decision points per scenario** with branching dialogue trees
- **Real-time coaching** grounded in SPIN Selling, Tactical Empathy, Gap Selling, Challenger Sale, and Apex's sales playbook
- **Randomized option order** so the best answer isn't always "A"
- **Post-conversation email practice** with AI-powered evaluation (requires Anthropic API key)
- **Spaced skill drilling** that targets your weakest principle across sessions
- **Persistent score tracking** across browser sessions

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g. `apex-sales-trainer`)
2. Push this project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/apex-sales-trainer.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `apex-sales-trainer` repository
4. Vercel auto-detects Vite — click "Deploy"
5. Your app is live at `https://apex-sales-trainer.vercel.app`

### Step 3: Add the API Key (for email evaluation feature)

1. In your Vercel project dashboard, go to **Settings > Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com/settings/keys)
3. Redeploy (Vercel > Deployments > redeploy latest)

The email evaluation feature is the only part that needs the API key. Everything else works without it.

### Step 4: Custom Domain (Optional)

In Vercel: Settings > Domains > Add `sales-trainer.apexleadershipco.com` (or whatever subdomain you want). Then add a CNAME record in your DNS.

## Project Structure

```
apex-trainer/
  api/
    evaluate-email.js    # Vercel serverless function (proxies Claude API)
  public/
    favicon.svg
  src/
    App.jsx              # Main game component (all scenarios, drills, email practice)
    main.jsx             # React entry point
  index.html
  package.json
  vercel.json            # Vercel routing config
  vite.config.js
```

## How It Works

- **Scenarios**: Branching dialogue trees stored as static JSON in App.jsx. Each node has 3 options rated excellent/okay/poor with coaching feedback and sales principles.
- **Email Practice**: After each scenario, franchisees write a follow-up email. The serverless function at `/api/evaluate-email` sends the email to Claude for evaluation against scenario-specific criteria and returns a score, strengths, improvements, and a model rewrite.
- **Skill Drills**: Cumulative scores stored in localStorage. When any principle drops below 75% across all completed scenarios, a targeted drill appears on the menu screen.
- **Score Persistence**: localStorage tracks cumulative empathy, discovery, framing, and momentum scores across sessions.

## Customization

- **Add scenarios**: Add a new scenario object to the `SCENARIOS` array in `App.jsx`
- **Add drills**: Add entries to the `DRILLS` object in `App.jsx`
- **Add email contexts**: Add entries to `EMAIL_CTX` in `App.jsx`
- **Change branding**: Update the `C` color object at the top of `App.jsx`
