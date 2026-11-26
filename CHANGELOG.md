# Changelog

## v0.12.12 · Hachiko · 26 Nov 2026 · commit __COMMIT__
- The slim header only unfolds when you pull down at the top of the list with your finger, not when a quick swipe coasts back up to the top.

## v0.12.11 · Hachiko · 26 Nov 2026 · commit 0b19f3f
- Smoother folding header: it now snaps to its slim size in one step and the list slides up, instead of resizing frame by frame.

## v0.12.10 · Hachiko · 26 Nov 2026 · commit 363459e
- More room for your tasks: scroll down the list and the score header folds into a slim bar with just the dogs and the score. Scroll back to the top, or tap the bar, to bring it back.

## v0.12.9 · Hachiko · 26 Nov 2026 · commit 9d5d4cf
- New size: Very hard (15 points), between Hard and Epic.
- When you add a task, choose where it goes: Today, This week or Later. There's a new step for it, and you can change it on the summary.
- Feedback notes from the app are now stored encrypted, so only you can read them.

## v0.12.8 · Hachiko · 24 Nov 2026 · commit 9344c17
- You now get a notification when a new version is out. If you're reading this as a notification, it works!

## v0.12.7 · Hachiko · 24 Nov 2026 · commit 0d3e789
- Settings › Nudges now shows whether notifications work on this phone, with a Turn on button when they don't.
- If a phone can't connect to the notification service, the reason is now saved so it can be fixed.

## v0.12.6 · Hachiko · 23 Nov 2026 · commit 03533a8
- Your list is now split into Today, This week and Later. Drag tasks between them, or use ⋯ › Move to.
- Anything in Today that isn't done slides into This week the next day, so nothing falls off your plan.
- Tasks you'd put in To do are now under This week.

## v0.12.5 · Hachiko · 23 Nov 2026 · commit 795b190
- Push notifications work again. If you'd allowed notifications on your phone, the app sometimes didn't save that, so nudges and reminders were never sent. It's saved now whenever you open the app.

## v0.12.4 · Hachiko · 23 Nov 2026 · commit e48de39
- Task notes now save. Before, whatever you typed in Notes was lost when you saved the task. Notes show in the task summary, with a note icon on the task in the list.

## v0.12.3 · Hachiko · 23 Nov 2026 · commit 496cc24
- "No points" is now the first size option instead of the last.

## v0.12.2 · Hachiko · 18 Nov 2026 · commit 43bc54a
- New badge art: Fetch. If you've already earned it, its chest opens again.

## v0.12.1 · Hachiko · 18 Nov 2026 · commit 0fec834
- Typing works properly on Android now: holding backspace clears the whole field and spaces no longer go missing.
- New size option "No points" for things you just want on the list. They give no points and never count toward badges.
- Fix your own done tasks until the week ends: tap the pencil to change the name or the size. Your partner sees the change.
- Plan each other's lists: drag your partner's tasks into their To do. Turn it off in Settings › Planning if you'd rather they didn't.
- New app icon with both dogs, so the launch screen leads straight into the stand-off. Android can take a few days to update the home-screen icon.

## v0.12.0 · Hachiko · 13 Nov 2026 · commit 3b39a74
- New loading screen: your two dogs give each other the stink eye, with HOUSEHOLD BATTLE below. It shows the moment you open the app.

## v0.11.3 · Balto · 13 Nov 2026 · commit c26b85c
- Shorter hint in the empty To do section: "Drag and drop tasks here".

## v0.11.2 · Balto · 13 Nov 2026 · commit e35f49f
- New badge art: Bone Finder and Bounty Hunter. If you've already earned them, their chests open again.
- Task notes now show in the task summary, next to Worth and Size.

## v0.11.1 · Balto · 11 Nov 2026 · commit b82f45e
- Fixed: after an update the app could think it was still the old version, so the reload bar kept coming back and What's new never showed.

## v0.11.0 · Balto · 11 Nov 2026 · commit bb0bfcc
- Plan your day: your lists now have a To do section on top. Long-press a task and drag it above the line to plan it, or use ⋯ → Move to To do.
- Notes on tasks: add details when you create or edit a task. Tasks with notes get a small note icon.
- New badge art: Smash! and Snatch!.

## v0.10.0 · Laika · 10 Nov 2026 · commit cc32c3b
- Every release now gets a famous dog's name. This one is Laika, the first dog in orbit.
- A What's new card like this one shows the first time you open a new version.
- When a new version comes out while the app is open, a bar at the top lets you reload.
- Dragging a task up or down now scrolls the list when you reach the edge.

## v0.9.13 · 10 Nov 2026 · commit fd6401c
- Reminders per task: Off, Once, 2× a day (09:00 and 18:00), Daily, Every 2 days, Weekly. Bundled, quiet hours respected.
- New repeat: Twice a day (done before 12:00, back at 12:00; after that, back next morning).
- Bounty On/Off per task; repeating tasks' bounty capped at their repeat gap (daily never).
- Badges give no XP any more.
- New badges: Good Boy (silver) and Howl at the Moon (bronze, rare). Early Bird is now bronze.
- Art: new bronze tint for Now it begins, First Blood, On a Roll, Blood Hound, Early Bird, Howl at the Moon; new Alpha and Good Boy.

## v0.9.10 · 9 Nov 2026 · commit c9a2dc5
- Fix: the badge reveal no longer plays twice when the screen redraws (e.g. a sync) while a chest is open.

## v0.9.9 · 9 Nov 2026 · commit 448e8f5
- New badge art: Daily Walkies and Slaver's Dog.
- Badge replay once more: earned badges go back into chests (XP paid once).

## v0.9.8 · 9 Nov 2026 · commit 8bf7a30
- Points vs XP: the weekly battle uses points (pts); your level uses XP. Every point is also XP; badges give XP only.
- Badge XP counts toward your level only, not the weekly score.
- New badge art: Now it begins, First Blood, On a Roll, Beast of Burden, Blood Hound, Epic Win, Are you not entertained!? (used exactly as drawn).
- Badges twice as big in the chest and badge view; the badge flips once; chests give no hint of metal or rarity before opening.
- One-time badge replay: earned badges go back into chests and open one after another (XP paid once).
- Suggestions only show when Mine is empty.
- More space above section labels; no dog on the level path; feedback pencil moves top-right while a sheet is open.

## v0.9.1 · 9 Nov 2026 · commit a686f1f
- Feedback button moved to the bottom-left corner; it steps aside while a message is showing.

## v0.9.0 · 9 Nov 2026 · commit 8d784d7
- Duplicate tasks: ⋯ → Duplicate on any task, or the copy icon on the Done tab. Opens the add drawer filled in.
- Drag and drop: long-press a task and drag it. Each of you has your own order; new tasks land on top. Tap-to-sort is gone.
- Feedback mode (Patrik only): pencil button → tap a spot → write a note. Notes are copied into feedback/inbox.md by the 5-minute job.

## v0.8.0 · 8 Nov 2026 · commit 495e26c
- Both: tasks for both of you, with their own tab. Either of you does it, you both get the base XP.
- Can't be stolen: new grace option Never.
- Mark done for your partner, behind the ⋯ in the task sheet. They get the XP.
- Sorting: tap the active filter to cycle Newest first, Easiest first, A to Z.
- Missed challenges: the challenger has as many days as the challenge ran to collect the bonus, then it lapses.
- Push notifications for challenges, rewards and help requests. The job now runs every 5 minutes.
- Up for grabs tasks no longer get a yellow border.
- Removed the Busy Body badge (v0.7.2 in the prototype).

## v0.7.1 · 6 Nov 2026 · commit fb7befd
- Level path runs top to bottom (level 1 first) and opens at the top, so closing it is easy.
- Removed the flag and "…and beyond" from the end of the path.

## v0.7.0 · 5 Nov 2026 · commit 490cb5d
- Smart suggestions from Gemini (free tier): seasonal and Sweden-aware ideas, shared by both phones, refreshed weekly.
- Badges: 20 badges in bronze, silver and gold, revealed in a chest you hold to open after a task is confirmed. XP is paid when you collect. Chore Dodger for empty weeks. Badges without finished art share one placeholder.
- Week summary on the first open of a new week: the winner, head-to-head stats, all-time weeks won, and a taunt to send.
- Boosts: win the week to bank a +10 XP comeback card, kept for 4 weeks, playable only when you're behind. Boost XP is blue in the score bar.
- Help: ask for help with your task, or offer help with your partner's. The helper gets no XP now but banks 1.5× the task as a boost.
- Nudges: a short setup (when you do chores, how pushy, quiet hours, notifications), editable in Settings. At most one a day, around the hour you actually finish tasks.
- Push notifications: an hourly job (GitHub Actions) runs the nudge rules and sends them through Firebase Cloud Messaging. Tapping one opens the right task.
- Behind-lines get blunter the further behind you are. Header chips for underdog removed (replaced by boosts).

## v0.4.0 · 4 Nov 2026 · commit 9390c12
- New header: big dogs at the edges behind the score bar, scores beside them, names under the bar. Bar has a dark rim and shadow so it stands out from the dogs.
- "Suggested for you" on Mine: your rhythm (overdue compared to how often you usually do it), jobs not done in 6+ months, end-of-month bills, seasonal ideas for Sweden and easy-to-forget classics. Add, Not now (a week), Never.
- Level badges (Bronze, Silver, Gold, Ruby, Amethyst, Legend) and a level path: tap the level card on Score.
- New 17-level ladder, from Couch Potato to Immortal Housekeeper.

## v0.3.0 · 4 Nov 2026 · commit a2b68f1
- Tips: new, easier-to-read card; 18 tips that rotate each time you open the app (plus Next tip). Closing hides tips until midnight.
- The score bar fills up when the app opens, then bulges.
- Settings → History: clear this week, or clear all history. Your partner has to accept.
- Settings sections are clearly separated; week score reads "Your XP: 12".
- Every page has the same top bar: title in the same place, same background.
- System events (joined, pause accepted, history cleared, expired challenges) span the full width in Activity.
- Android back button: closes what's open, otherwise goes back to Quests.

## v0.2.0 · 4 Nov 2026 · commit 57f575d
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

## v0.1.0 · 4 Nov 2026 · commit 13143ac
- First real version: Google sign-in, household invite code, live sync between both phones, works offline, installable.
