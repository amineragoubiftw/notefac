# Remix of Grade Weaver

Act as an expert UI/UX Designer and React/Tailwind Developer. Build a professional, interactive "University Grade & Credit Calculator" Web Application based on a specific Tunisian university grading system.

🎨 1. DESIGN SYSTEM & AESTHETICS (Crucial)

Theme: Premium, modern, and sleek. Use a dark mode theme with a vibrant, deep mesh gradient background (e.g., deep purples, blues, and dark violet).

Glassmorphism (Blur): I want a heavy "frosted glass" effect. All cards, forms, and containers must use backdrop-blur-xl, bg-white/10 (or bg-black/20), with subtle semi-transparent borders (border-white/20).

Typography & Polish: Use a clean sans-serif font (like Inter). Add smooth hover effects, subtle entrance animations (framer-motion if possible, or tailwind transitions), and glowing accents for calculated results.

⚙️ 2. CORE LOGIC & FORMULAS

Module Final Note: (0.7 * Examen) + (0.2 * DS) + (0.1 * CC). (Clamp inputs between 0 and 20).

UE Average (Moyenne UE): Sum(Module Final Note * Module Coef) / Sum(Module Coef) for all modules in that specific UE.

Semester Average (Moyenne Semestre): Sum(UE Average * UE Coef) / Sum(UE Coef).

Credits Acquired: If a UE Average >= 10, the user gets the credits for that UE. Total credits = Sum of acquired credits.

📊 3. DATA STRUCTURE (Hardcode this state into the app) Semester 1:

UE1 (Coef: 3, Credits: 6): "Technologies multimedias" (Coef 1.5), "Logique formelle" (Coef 1.5)

UE2 (Coef: 3.5, Credits: 7): "Algorithmique" (Coef 2), "Atelier programmation 1" (Coef 1.5)

UE3 (Coef: 3.5, Credits: 7): "Systeme exploitation 1" (Coef 1.5), "Architecture ordinateurs" (Coef 2)

UE4 (Coef: 3, Credits: 6): "Analyse 1" (Coef 1.5), "Algebre 1" (Coef 1.5)

UE5 (Coef: 2, Credits: 4): "Communication 1" (Coef 1), "Anglais 1" (Coef 1)

Semester 2:

UE1 (Coef: 3, Credits: 6): "Analyse 2" (Coef 1.5), "Algebre 2" (Coef 1.5)

UE2 (Coef: 2, Credits: 4): "Base de donnees" (Coef 2)

UE3 (Coef: 3.5, Credits: 7): "Reseaux" (Coef 2), "Systeme exploitation 2" (Coef 1.5)

UE4 (Coef: 3.5, Credits: 7): "Python" (Coef 1), "Algorithme" (Coef 1.5), "Atelier programmation 2" (Coef 1)

UE5 (Coef: 3, Credits: 6): "Communication 2" (Coef 1), "Anglais 2" (Coef 1), "Culture" (Coef 1)

🖥️ 4. UI LAYOUT & UX

Header: Title of the App.

Toggle Switch: A sleek glassmorphic pill-shaped toggle to switch between "Semestre 1" and "Semestre 2".

Main Form (Left/Center): Group the modules by UE. For each module, display its name and 3 sleek input fields (Examen, DS, CC). Auto-calculate the module's final score and display it next to the inputs dynamically.

Sticky Results Panel (Right or Bottom): A prominent, glowing glass card that displays:

Real-time "Moyenne Semestre" (Highlight in Green if >= 10, Red if < 10).

Real-time "Total Credits Valider" (Out of 30).

A mini breakdown showing the average for each UE.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://notefac.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c3374b2d-9fda-4a8c-903c-890fc994066f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
