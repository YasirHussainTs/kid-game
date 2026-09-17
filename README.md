# Rasla Studio — Vercel edition

The latest animated kids’ version, including Easy Peasy and Colour Challenge,
six cartoon outfits and expressions, makeup brushing, a cheerful picnic / party / parade ending,
a happy dance, sound controls, and a downloadable picture.

## Deploy using GitHub and Vercel

1. Extract this ZIP on your computer.
2. Create a new GitHub repository, for example `rasla-studio-game`.
3. Upload the extracted contents: the `public` folder, `vercel.json`, and this README.
   Keep `vercel.json` at the repository root. Upload the files, not the ZIP.
4. In Vercel, choose Add New → Project and import that GitHub repository.
5. Keep Root Directory at the repository root. The included configuration sets:
   - Framework Preset: Other
   - Build Command: empty (no build needed)
   - Output Directory: public
6. Click Deploy. Open the deployment URL shown by Vercel.

No database, API keys, environment variables, npm install, or paid AI API are needed.
Images are already included. Google Fonts loads the optional typefaces online;
the game also includes system-font fallbacks.

## Local preview

From the extracted project folder, if Python is installed:

```bash
python -m http.server 8000 --directory public
```

Open http://localhost:8000 in your browser. Use a local server instead of opening
index.html as a file so the canvas picture download works reliably.

## Files to edit

- public/index.html — screens and labels
- public/style.css — colours, layout and animations
- public/app.js — game logic, sounds, difficulty and picture export
- public/rasla-cartoon.png — cartoon expression and outfit sheet
- vercel.json — Vercel static-site settings

## Quick check after deployment

- Easy: choose an adventure, any outfit, brush three times, then head to your adventure.
- Challenge: match the colour clue, brush five times, then head to your adventure.
- Check sound, restart, departure dance and Save our happy picture on your phone.

This is a standalone export. Vercel deployment access is configured in your
Vercel account; it does not inherit the private access settings of the ChatGPT site.

Official Vercel static-site build settings:
https://vercel.com/docs/builds/configure-a-build#skip-build-step

## Save the edited picture on a phone

At the ending, tap Save our happy picture. The preview includes the chosen outfit and makeup. Use Download picture, or Save / share on my phone when available. You can also press and hold the preview to save it. The exact save options depend on the phone and browser. Open in Safari or Chrome if an in-app browser prevents saving.
