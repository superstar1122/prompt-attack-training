# Prompt Injection Training – The Guardian

Interactive browser game to practice prompt‑injection and prompt‑attack techniques. Your goal: convince the Guardian to reveal each level’s secret password. After each success, the Guardian hardens its defenses and you advance to the next level.

## Quick start (Windows)
- Use a local PHP server (the app calls PHP SSE endpoints; Python’s simple server won’t run them):
  - Option A: PHP built-in server
    - Open PowerShell in the project folder
    - `php -S localhost:8000 -t .`
    - Then open http://localhost:8000/
  - Option B: VS Code extension that supports PHP serving (or any local AMP stack like XAMPP/WAMP)
- If you already use XAMPP/WAMP or a local web root at http://localhost:
  - Place this folder under the web root (e.g., `htdocs/prompt-training`)
  - Open http://localhost/prompt-training/ (or http://localhost/ if this project is set as the root)
- Click the single card (KI‑Duell: Das Passwort‑Orakel) to start.

## Gameplay loop
1. Chat with the Guardian to elicit or reconstruct the current level’s password.
2. Submit the password (type it in chat or click the Key button).
3. You’ll see a congrats message and the next level’s welcome banner (image + intro).
4. Repeat through Level 6.

Progress is saved in your browser (localStorage); you can reset from the menu.

## Features
- Six levels with escalating defenses and difficulty (very‑easy → insane)
- Multilingual detection (EN/DE) with fuzzy matching and typo tolerance
- Streaming AI responses (SSE via php/api.php)
- Persistent progress and chat history per character
- Guardian banner with per‑level image, title, and intro
- Reset flow with confirmation (SweetAlert2)

## Project structure
- `index.html` – UI & modal
- `js/app.js` – Core logic: chat, levels, detection, banner/FAB, persistence
- `json/level.json` – Level definitions (password, difficulty, title, intro, image, triggers)
- `json/lang.json` – Localized UI strings
- `json/config.json` – Runtime options (streaming, toggles)
- `php/api.php` – SSE backend for streaming responses
- `style/` – CSS (Bootstrap + custom)
- `img/` – Icons, guardian/level images

## Level system (from level.json)
Each level contains:
- `id`, `password`, `difficulty` (very-easy, easy, medium, hard, very-hard, insane)
- `title`, `intro`, `image`
- `directAskPatterns`, `leakTriggers`, and optional `systemPrompt`

Advancement rules:
- You advance only when you submit the password (typed or Key button).
- Level 1 may reveal the password on direct ask, but still requires submission.
- On higher levels, a fully leaked password may auto‑advance.

## Detection & defense logic
Core helpers in `js/app.js`:
- `normalizeText()` – lowercasing, diacritics removal, leet fixes, collapse repeats
- `levenshtein()` + `approxIncludes()` – fuzzy matching for misspellings
- `detectDirectPasswordAsk()` – looks for ask verbs + password keywords (DE/EN)
- `detectLeakTrigger()` – matches indirect strategies (rephrasing, rhyme, encoding)
- `detectStructuralIntent()` – asks like length, first/last char, Base64, justification
- `shouldLeak()` – combines level rules with difficulty‑based probability
- `generateLeakResponse()` / `generateRefusal()` – response templates per level

Leak probabilities by difficulty:
- very‑easy: 100%
- easy: 85%
- medium: 55%
- hard: 35%
- very‑hard: 15%
- insane: 5%

## Persistence & banner behavior
- Level progress stored under `game-level` in localStorage.
- Chat history stored under `oracle_chat_v1` (per character).
- Guardian banner is visual‑only and re‑rendered fresh after opening/refresh; it’s not stored as a text message. The banner image/title/intro are refreshed once `level.json` is loaded to avoid race conditions.

## Resetting levels
Use the top‑right menu’s reset action. You’ll see a confirmation dialog; on confirm:
- Level set to 1
- All chats cleared
- Level 1 banner displayed only

## Troubleshooting
- Always serve via HTTP (not file://). The app fetches JSON and uses SSE via PHP.
- If you changed `level.json` paths for images, ensure the files exist and paths are correct.
- If audio TTS buttons don’t show, check `display_audio_button_answers` in `json/config.json`.
- If you see a reference error in console, hard refresh (Ctrl+F5) to clear cached scripts.
- If SSE doesn’t stream on Windows, try the PHP built-in server command above. On custom stacks, disable output buffering for the SSE endpoint (`php/api.php`).

## Development tips
- Main hooks: `sendUserChat()`, `getResponse()`, `loadChat()`, `appendGuardianWelcome()`
- To adjust difficulty or triggers, edit `json/level.json` and tweak patterns.
- UI tweaks: `style/custom.css` (Guardian FAB, banner spacing, etc.)

## License
Specify a license for your project here.
