# Changelog

## v0.7.0 · 5 Nov 2026 · commit __COMMIT__
- Smart suggestions from Gemini (free tier): seasonal and Sweden-aware ideas, shared by both phones, refreshed weekly.
- Badges: 20 badges in bronze, silver and gold, revealed in a chest you hold to open after a task is confirmed. XP is paid when you collect. Chore Dodger for empty weeks. Badges without finished art share one placeholder.
- Week summary on the first open of a new week: the winner, head-to-head stats, all-time weeks won, and a taunt to send.
- Boosts: win the week to bank a +10 XP comeback card, kept for 4 weeks, playable only when you're behind. Boost XP is blue in the score bar.
- Help: ask for help with your task, or offer help with your partner's. The helper gets no XP now but banks 1.5× the task as a boost.
- Nudges: a short setup (when you do chores, how pushy, quiet hours, notifications), editable in Settings. At most one a day, around the hour you actually finish tasks.
- Push notifications: an hourly job (GitHub Actions) runs the nudge rules and sends them through Firebase Cloud Messaging. Tapping one opens the right task.
- Behind-lines get blunter the further behind you are. Header chips for underdog removed (replaced by boosts).

## v0.4.0 · 4 Nov 2026 · commit 5afb375
- New header: big dogs at the edges behind the score bar, scores beside them, names under the bar. Bar has a dark rim and shadow so it stands out from the dogs.
- "Suggested for you" on Mine: your rhythm (overdue compared to how often you usually do it), jobs not done in 6+ months, end-of-month bills, seasonal ideas for Sweden and easy-to-forget classics. Add, Not now (a week), Never.
- Level badges (Bronze, Silver, Gold, Ruby, Amethyst, Legend) and a level path: tap the level card on Score.
- New 17-level ladder, from Couch Potato to Immortal Housekeeper.

## v0.3.0 · 4 Nov 2026 · commit 0fdcee7
- Tips: new, easier-to-read card; 18 tips that rotate each time you open the app (plus Next tip). Closing hides tips until midnight.
- The score bar fills up when the app opens, then bulges.
- Settings → History: clear this week, or clear all history. Your partner has to accept.
- Settings sections are clearly separated; week score reads "Your XP: 12".
- Every page has the same top bar: title in the same place, same background.
- System events (joined, pause accepted, history cleared, expired challenges) span the full width in Activity.
- Android back button: closes what's open, otherwise goes back to Quests.

## v0.2.0 · 4 Nov 2026 · commit 2c07add
- New font scale (12 · 14 · 16 · 18 · 22 · 32 · 56). Body text is 14, nothing is smaller than 12.
- Page titles: QUESTS, SCORE · WEEK n, ACTIVITY in one consistent style.
- Tap an avatar to open the Score page for that person (You / partner switch, level card, badges).
- Activity and quest threads are laid out like a chat: your things on the right, your partner's on the left.
- Bottom sheets can be dragged down to close, and grow to full height when needed.
- Buttons press in and spring back. Phone vibrates on completing, stealing, levelling up and taking the lead.
- Game feel: dogs flash, bounce and flinch; stolen quests zip away; scores pop; badges wobble in.
- Adding a quest no longer opens the keyboard straight away.
- Delete / discard buttons now sit on the right.
- "Install" banner and a Settings button to put the app on the home screen.

## v0.1.0 · 4 Nov 2026 · commit 048c79e
- First real version: Google sign-in, household invite code, live sync between both phones, works offline, installable.
