# Ripple Invitation Animation Goals (MD Spec Content)

## 🎯 Purpose

Create an animated, interactive ripple invitation screen that:
- Visually reinforces the idea of spreading influence through sharing
- Lets users choose between Personal Invite, Public Post, or Apply for Affiliate
- Builds anticipation with animated ripple layers and subtle interactivity

## 🌀 Visual and Interaction Goals

- Five concentric ripple layers fade in as the user lands on the page
- Each ripple layer contains gray placeholder circles, which later fill in with animated responses as new people join via invite
- Ripple circles gently float and shift (subtle oscillation / parallax)
- Hovering the mouse near any circle causes a soft glow or color highlight
- Clicking "Share" triggers a chain-light animation that pulses outward from the center circle, passing through each layer
- As users invite others and those people join, circles light up and animate as they become active
- If a full ring (e.g. 5 directs) is filled, that ring switches to a clean counter instead of individual circles

## 🧩 UI Elements

**Central circle labeled "Your Name Here"**
- Shows real name if known
- Hover reveals ✏️ pencil icon to edit
- If name unknown, popup: "Step 1: Enter your name"

**Three Invite Bubbles:**
- Personal Invite → Enter recipient's name & optional message
- Public Post → Copy/paste tools for social + shows inviter's name
- Apply for Affiliate → Triggers form (platform, follower count, promo plan)

**Subtle animated background ripple texture** (preloaded before entering this screen)

**"Skip for now" link** (bottom corner)

**"Learn how it works" link** or down-arrow that leads to full info portal

**Placeholder endorsement line:**
"This is for sure the coolest thing you have seen this year –MH"
(To be replaced with AI-powered social proof later)

## 🛠 Recommended Tech Stack (Options for Brave Devs)

| Function | Option 1 | Option 2 |
|----------|----------|----------|
| Animation & interaction | Framer Motion (React) | GSAP (for SVG logic) |
| Visual ripple rendering | SVG or Canvas | WebGL (if needed later) |
| UI styling | Tailwind CSS | Magic UI (optional) |
| Hover + proximity logic | Framer / Custom JS | SVG hover states |

## ✅ Full Bolt Prompt (Referencing This Spec)

Build a visually engaging and interactive ripple invitation page based on the specifications in `ripple-invite-structure.md`. This page appears right after onboarding, before the user sees their actual ripple dashboard.

### 🧠 Purpose:
To let users choose how to invite their first ripple and show the five-layer referral structure in an animated, intuitive way.

### 📌 Key Interactions:
- Animated ripple layers form around the central user circle
- Hovering or tapping near ripple nodes triggers soft animation and highlight
- Clicking Share sends a glowing animation down the chain of circles
- Ripple layers animate subtly even when idle (floating effect)
- As real people join, circles fill in and animate, replacing gray placeholders
- Once a ring is full, it condenses into a summary counter

### 📎 User Interface:
- Center: "Your Name Here" (editable if known, prompt if unknown)
- Three invite options: Personal Invite, Public Post, Apply for Affiliate
- Optional message input for personal invites
- "Skip for now" link at bottom
- "Learn more" link or down-arrow leads to explanation portal
- Social proof message below or near invite buttons

### 🛠 Tech:
Use Tailwind CSS for styling.
Use Framer Motion for smooth and responsive animation.
Use SVG or Canvas for drawing ripple paths and circles.
Use React or Next.js compatible libraries for logic and reactivity.

Refer to the markdown spec file for animation rules, layout, and user logic.