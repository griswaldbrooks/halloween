# How escape rooms and short puzzle games are designed, applied to the Halloween 2026 game

Scout report, 2026-10-08. Task `hw-research-escape-design`. Web research only. Nothing in the halloween repo, the handoff, the notes or the storyboard was changed.

This is the escape-room half of a research pair. A GPT worker covers immersive theater, horror, seance shows, larp and asymmetric co-op.

## Short answer

The handoff's instincts are mostly right by the standards of the people who design escape rooms for a living. One objective sentence, puzzles that carry the story, a relic hub that triggers the turn, a soundtrack as the clock, curses the players put on themselves: each of these matches a named rule from Nicholson, Elumir, Wiemker and Clare, or Room Escape Artist. Three things are missing or at risk, and the sources are clear about all three.

1. There is no hint channel. The medium does not know the history and the mother is learning it too, so nobody in the fiction can nudge a stuck group. Every source agrees the hint system decides whether a game works, and that most players will not ask. The medium needs a defined, in-character way to hint that does not require her to know the answer.
2. Hub-and-spoke is a sequential structure. Nicholson's survey says sequential works for small teams that stay together, which is this game. The cost is the bottleneck: if one spoke puzzle can be worked by one person, three people watch. Each spoke must be built so all four work at once, and spoke puzzles must be short and easy, because linear sections cannot absorb a stall.
3. The finale as sketched is four parallel single-sense puzzles. That is an open structure, which the survey says is the hardest to pace and which the finale sources say should end with a linear last step so everyone is watching the same thing. The failure ending is undesigned, which Room Escape Artist calls the most common failing in the industry.

A 20-minute run for four is tight but possible if each spoke is one gate, not a chain. Options are in section 4.

## 1. What I did

I read the handoff, the running notes, the review log, and the finding sections of the storyboard, simulation and finale-research reports. I then read the primary sources below, fetching PDFs and extracting their text locally with `pdftotext` where the fetch tool could not read them. I did not reach four sources the brief named, listed at the end of section 2.

## 2. Sources

Each entry: who wrote it, why it counts, and what it taught me. Quotes are verbatim from the fetched text.

### 2.1 Scott Nicholson, "Peeking Behind the Locked Door: A Survey of Escape Room Facilities" (2015)
https://scottnicholson.com/pubs/erfacwhite.pdf. Nicholson is a professor of game design at Wilfrid Laurier University. This is a survey of 175 facilities worldwide and the most cited data set in the field.

- Puzzle organization: path-based 45 percent of described games, sequential 37 percent, open 13 percent, plus hybrids. "Sequential... works better in smaller rooms or when puzzles require the entire team to work together in a series of linear tasks." Open structures are "more difficult to use when creating a scaffolded, flow-based experience where the game gets more challenging as time goes on." Path-based lets the designer "start with simpler puzzles and then move into more difficult puzzles as the players grow in confidence."
- The pyramid hybrid: several paths feed a meta-puzzle, which starts a sequence, which opens another set of paths leading to a "meta-meta puzzle."
- Hints: a gamemaster gives help in 82 percent of facilities. In 23 percent players cannot request hints and the gamemaster offers them when appropriate; in 42 percent players request as needed; in 23 percent hints are capped, usually at two or three. "Proprietors report that even though players may have the ability to request hints, many do not and instead suffer in frustration, eventually leaving the room in a bad mood." And: "it is very frustrating for players to be on the cusp of a breakthrough and then to have that moment taken away by a poorly-timed hint."
- Success: average escape rate 41 percent. Rooms reported as low, medium and high mental challenge averaged 61.7, 48.5 and 36.3 percent. When teams fail, 68 percent of facilities "talk the team through the rest of the puzzles," and 73 percent schedule a debrief.
- Average team size 4.58. Most common puzzle types: searching 78 percent, team communication 58 percent, light 54 percent, hearing 26 percent, touch 12 percent.
- An actor as adversary and difficulty control: the Trapped in a Room with a Zombie franchise chains an actor to the wall and "every five minutes, the chain grows longer." That is a diegetic clock the players can read without a display.
- Designers split evenly on red herrings; one said they "create a bad experience for a player who spends considerable time on a puzzle or a path that is not important."
- Citing Matt DuPlessie of 5 Wits: players consistently enjoyed "being part of a spectacle, feeling heroic, and engaging with something challenging."

### 2.2 Nicholson, "The State of Escape: Escape Room Design and Facilities" (2016)
https://scottnicholson.com/pubs/stateofescape.pdf. Revised portion of the survey, presented at Meaningful Play.

- Three levels of narrative integration: theme only ("a movie set without a script"); a narrative frame where "the puzzles done throughout the room do not necessarily move the narrative"; and rooms where "the puzzles are part of the storytelling and move the narrative along. The puzzles cannot be separated from the narrative." He adds that "none of these are the 'right' design path," because some players only want puzzles. This game wants the third level.
- Only 8 percent of surveyed narratives were "engage with the supernatural," and 13 percent of themes were horror. A seance game is unusual, which matters for how much players already know how to behave.

### 2.3 Nicholson, "Ask Why: Creating a Better Player Experience Through Environmental Storytelling and Consistency in Escape Room Design" (2016)
https://scottnicholson.com/pubs/askwhy.pdf. The earlier finale research used this paper too. I pulled the parts that bear on puzzle structure.

- "A designer should look at each element of the player experience of an escape room and ask 'Why is this here?'" Answers rank from worst to best: escape room logic ("players like black lights"), genre expectation, setting, and story.
- "The players should have a meaningful reason for taking on a task other than 'it's the next thing to do in the room'."
- Meaningful play, after Salen and Zimmerman, needs actions that are "discernable, meaning the player understands the result of what they are doing, and integrated, meaning the actions the player takes in the game make a difference."
- Start shallow: "If the game starts off requiring too deep of an engagement with the setting, the players may be confused as to why things are happening."
- A challenge is more meaningful when it gives the player a tool for a later conflict, "a physical tool, such as a magnet or a rope, or a mental tool, such as an encoding scheme or a new way of understanding something."

### 2.4 Markus Wiemker, Errol Elumir, Adam Clare, "Escape Room Games: Can you transform an unpleasant situation into a pleasant one?" (2015)
https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf. Elumir designs puzzles for theatrical escape events and puzzle hunts; Clare wrote the first book on escape room design, Escape the Game; Wiemker teaches game studies in Germany. This is the paper that fixed the linear, open and multi-linear vocabulary.

- The puzzle loop: "a challenge, a solution, and a reward." Every puzzle "should follow the game loop and be a part of the greater whole of the room experience."
- Linear: "easier for players to solve, as well as for room owners to design. The negative of a linear puzzle structure is a player bottleneck: if the advancement of the game relies on one puzzle, and if the puzzle can be worked on by only one person, then that leaves the rest of the team doing nothing."
- Open: "more difficult for players to solve since there isn't a clear indication on where to start," but "conducive to large groups."
- Multi-linear: "a series of linear path puzzles which can be done in parallel," and the paths "can be revealed over the course of the game, whether it be by a timed effect, or from the solution of other puzzle paths."
- Meta puzzle: "the final answer is derived from solving previous puzzles," their example being a jigsaw whose pieces are earned one per puzzle. Clare's own site uses the same definition.
- Flow: "A well designed game keeps players between a state of frustration and boredom."
- Hint policies catalogued: set number, unlimited, earned, purchased, penalized, guided with hints on request, guided without hints, none.

### 2.5 Errol Elumir, "13 Rules for Escape Room Puzzle Design" (2018)
https://thecodex.ca/13-rules-for-escape-room-puzzle-design/. The most-shared designer checklist in the enthusiast community.

- Rule 1: "Puzzles Should Be Fair – You are on the Player's Side."
- Rule 2: "Clue Everything and Remove Ambiguities – Don't Make Players Guess," including answer format and where the answer goes.
- Rules 3 and 4: one answer, and "A Puzzle Should Have a Self Validating Answer," so players know they are right before they try a lock.
- Rule 5: "Clues and Puzzles Should Be Clearly Linked" by theme or space, not labels.
- Rule 7: "A Puzzle Should Not Take More than 5 minutes to Complete" for a player who knows the method. A single-person puzzle that holds up the game is a bottleneck and "everyone is miserable."
- Rule 9: no destroyable states. Rule 10: puzzles give feedback. Rule 11: follow the patterns you set.
- Rule 12: "Your Puzzles will be too hard – Beta Test and Iterate." Enthusiasts judge time and fairness; newcomers judge fun.
- Rule 13 lists the community basics: no red herrings, no outside knowledge, solvable without hints.

### 2.6 Elumir, "How Escape Rooms Do Difficulty Wrong – The Player Loop" (2019)
https://thecodex.ca/?p=2924.

- Definitions: a gate is "a surmountable obstacle that prevents the team from progressing"; a clue is in-game information needed to pass a gate; a hint is out-of-game help.
- The loop: identify gates, collect clues, select a gate, solve (the aha), complete (the process), input the answer, repeat.
- Frustration enters at searching, at picking which gate to work, and at answer input when the lock is the problem. "A puzzle doesn't get harder to solve, it just takes longer to do." "Slow us down with more puzzles. Don't slow us down with tedium."
- Too many aha puzzles exclude newcomers, "for whom everything is an Aha."

### 2.7 David Spira, "An Exploration of Escape Room Hint Systems," Room Escape Artist (2019)
https://roomescapeartist.com/2019/10/24/escape-room-hint-systems/. Room Escape Artist has reviewed well over a thousand games and runs the industry's main conference.

- "Hints are surrender; clues are the game." A hint request means the team "is no longer having fun," feels time pressure, wants to skip something, or hit a malfunction.
- Hint rate is a design metric: a puzzle that needs the same hint half the time needs refinement; one that almost always needs a hint is broken.
- Triggers: player-requested, gamemaster discretion (his favorite "when the gamemaster is competent and attentive"), time-released, and automated. The three-hint cap is "arbitrary."
- Delivery: screens clash with sets; written notes can be in character and let a team wait; an in-room actor "can be magical with a skilled actor."
- "Don't let teams stew on one puzzle for too long." "A game's success will frequently be built on its hint system."

### 2.8 Richard Burns, "My Favorite Escape Room Hinting Styles," Room Escape Artist (2021)
https://roomescapeartist.com/2021/09/17/my-favorite-escape-room-hinting-styles/.

- Optional hint reception: the host places an unrequested, concealed hint (a note under the door, a screen behind a flap) that players reveal when they choose. It gives "the comfort of knowing hints are currently available" without a public admission.
- Narrator-delivered hints: an outside voice narrates the players' actions and slips hints into the narration, so a hint "seems like a discovered clue." His example: "Our smallest adventurer noticed some curious symbols." Establish the narrator early, at the opening and act breaks.

### 2.9 Richard Burns, "Actors As Escape Room Gamemasters on The Hayden Farm," Room Escape Artist (2021)
https://roomescapeartist.com/2021/12/15/actors-as-escape-room-gamemasters-on-the-hayden-farm/.

- Four in-character actors roamed and gamemastered while a fifth person ran a control room.
- "Their knowledge of all the games allowed them to provide in-character hints that didn't feel like hints."
- Slower teams "received just enough hints to keep progressing"; faster teams were sabotaged "only to the degree that they still escaped on time."
- Actors cued off audio from other rooms. This is the closest published model to a medium plus an effects operator.

### 2.10 David Spira, "5 Rules For Actors in Room Escapes," Room Escape Artist (2017)
https://roomescapeartist.com/2017/02/19/5-rules-for-actors-in-room-escapes-design-tips/.

- Build trust fast: "We have to learn that you aren't harmful."
- "You're going to have to play to us because most of us can't play to you."
- Read the whole team, not the loudest member.
- "Tell your story. Do your thing. But please, for the love of puzzles, do it quickly."
- Use power over the game with restraint.

### 2.11 Matthew Stein, "Make Failure Fun, But Don't Hide Fun Behind Failure," Room Escape Artist (2025)
https://roomescapeartist.com/2025/07/22/make-failure-fun/.

- The ending is "the most underdesigned part of the vast majority of escape rooms." Failure usually ends with a host saying time is up.
- "Meaningful stakes equals meaningful failure." Failure endings should be "as exciting as success endings."
- Tiered win conditions: an accessible core objective earns a good ending; harder side objectives earn better ones.
- Instant-fail with time still on the clock "leaves players feeling powerless."
- Do not hide the best content behind failure; forced failure only when it serves the design, and sparingly.
- Fairness test: a player should be able to look back and think "I could have solved that."

### 2.12 Richard Burns, "Untie Your Escape Room Stories," Room Escape Artist (2021)
https://roomescapeartist.com/2021/10/09/untie-escape-room-stories.

- Most games stop at the climax: "The story isn't concluded. There is no denouement."
- "If the world has changed, let us see evidence of that," through a short cooldown of play after the climax.
- "Leave space for that to happen, for it to sink in, in the game world, before the host breaks the immersion."

### 2.13 David Spira, "Escape Room Design Basics," Room Escape Artist (2015), and Lisa Spira, "Room Escape Artist Dos and Don'ts" (2016)
https://roomescapeartist.com/2015/03/20/room-design-basics and https://roomescapeartist.com/2016/07/17/the-room-escape-artist-dos-and-donts/.

- "Keep your rules clear, minimal, and consistent." Nothing hidden high, out a window, or in the electrics, and say so.
- "Repetition is the enemy of fun." "Every puzzle in your room should be great, unique, and a standalone moment." "Discard your throwaway puzzles."
- Check setup before every game: the wrong lock on a chest cannot be undone.
- From the dos and don'ts: "Do watch out for clue bottlenecks." "Don't let it be possible to miss big puzzles." "Do have a climax / finale." "Do have a game master who is actively involved during gameplay." "Do offer a walkthrough, group picture, and debrief session after the game."

### 2.14 Emily Short, "Learning about Multiplayer Puzzle Design from Escape Rooms" (2016)
https://emshort.blog/2016/06/02/learning-about-multiplayer-puzzle-design-from-escape-rooms/. Short is a leading interactive-fiction designer; the post reports on Time Run and other London rooms, with comments from Andrew Plotkin and David Spira.

- Not every player needs to solve every puzzle; a group of three to five is natural, and some Time Run puzzles "would be harder with three and impossible with two."
- Give specific players props or abilities so each has a job; use distributed stations and simultaneous actions.
- Escape rooms "separate information from where it's used."
- Before a big reveal, focus everyone on the right place, "by requiring a set of props to be gathered or by making the reveal depend on a bottleneck puzzle." An attention-grabbing sound or light, then the reveal a few seconds later. Timer-triggered reveals are harder to stage than solution-triggered ones.
- Time Run keeps a hint-giver on an open line who nudges when the team seems stuck; her team "spent less time actively stuck" than in a request-only game.
- New puzzle content "is revealed on a regular basis," which keeps the pace up.
- Adam Clare's advice, relayed: make the failure ending interesting too.

### 2.15 The Logic Escapes Me, "Live Escape Salisbury: SPECTRE" (2017) and "When Escape Rooms Go Wrong!" (2017)
https://thelogicescapesme.com/review/live-escape-salisbury-spectre/ and https://thelogicescapesme.com/?p=4278. Ken Ferguson's blog, over 400 games played, well regarded by UK designers.

- SPECTRE ran two hint channels: "an ethereal voice that can provide the most subtle of hints" and "another clue mechanism which can give you more tangible hints if something more visual would be helpful." Hints scaled from "just a single word pointer" to "a more involved clue."
- Pacing: "a fair amount of open puzzling, with pinch points to bring the team back together, and eventually a linear finish to ensure everyone is watching the final moments."
- On breakage: "There should never be a puzzle or component whose failure ends the game." Map the critical path, plan a response for each prop, and praise gamemasters who cover in character, as Bewilder Box's did.

### 2.16 Jan Matoušek, "Escape room design," lecture, Czech Technical University in Prague
https://courses.fit.cvut.cz/NI-ESC/lectures/files/esc-room-design.pdf. A university course lecture that synthesizes the designer literature; useful because it states the structural rules as rules.

- "Dependency of puzzles/doors and clues/keys form a graph. The graph should be acyclic."
- Linear: good for storytelling, slows the game; "players may get stuck," "part of team may get bored." Branching: stuck players try other puzzles, but "hard to progress story."
- Choke points: "Ideal for final puzzles, but also for important story points."
- "Don't make the game strictly linear. If you need to make some part linear, use very easy puzzles." "Use branching to split players and to make all of them busy. Use chokepoints and linear parts to progress the story."
- "Make hint system part of the room's theme." "Each clue is used exactly once." "Don't put red herrings. The players are clueless already."
- "In a dark room, do give players a source of light or a sound to navigate." "Do always provide a mean to leave the room in case of emergency." He cites the 2019 Koszalin fire, where five players died.

### 2.17 Laura E. Hall, interviewed by Ben Coleman, Portland Mercury (2017)
https://www.portlandmercury.com/?p=176813. Hall designed rooms for 60 Minutes to Escape and gave the GDC 2017 talk "Lessons from Escape Rooms," which is behind the GDC Vault login.

- "Make it diegetic, make it make sense for whoever was inhabiting the space." "I don't want anything they encounter to ever break that spell."
- Pace by gating: "There needs to be a set of information that's gated at certain steps, to prevent people from doing it too quickly."
- Everything "is meant to be used"; a prop with no readable purpose is a mistake.
- "You see the clock start and your adrenaline sort of takes over. Your focus narrows. So you can anticipate how you might need to direct their attention."
- "Every single thing in there is going to be touched, and probably broken."

### 2.18 Dan Suleski, "Reinventing The Escape Room Hints System," The Escape Effect, Orlando (2020), and Breakout Games, "How Often Do People Win Escape Rooms?"
https://theescapeeffect.com/blog/reinventing-the-escape-room-hints-system and https://breakoutgames.com/blog/escape-room-success-rates. Two operators, one independent and one national chain.

- The Escape Effect dropped the "3 hints and done" model it says was copied venue to venue, replaced it with unlimited hints by button, and offers an optional cooldown timer for teams who want a challenge.
- Breakout gives unlimited hints and says "It's very rare that a group will break out with no hints." Players set difficulty by how much they ask. Published industry escape rates run "anywhere from 20-75%."

### 2.19 Lock Paper Scissors, "5 Key Aspects Of A Memorable Escape Room Experience" and "How this family hosted the escape room party of the decade!"
https://lockpaperscissors.co/?p=587978 and https://lockpaperscissors.co/?p=235591. Lock Paper Scissors sells print-and-play home escape kits; these are their hosting pages.

- "An escape room is only as good as the people running it." "The key is always to be one step ahead."
- Parties run "anywhere from 30 minutes to 2 hours."
- The Adams family party ran four rooms of about 15 minutes each, a new group every 15 minutes, a 30-second reset per room, props for each room in one bin, and the family's children as gamemasters who "learned when to give a hint and when to let players work it out."

### 2.20 Stairville AF-40 DMX fog machine manual (Thomann)
https://img.static-thomann.de/pics/atg/atgdata/document/manual/307680_c_307680_v3_en_online.pdf. A manufacturer's manual, used here for fog safety numbers.

- "The distance of persons and objects to the fog nozzle must be at least fifty centimetre (1.6 feet)." The nozzle is hot and "hot fluid drops may escape."
- "Do not direct the fog to floors. Floors and surfaces can become slippery by condensed fog."
- "During operation, ensure that the visibility in the room does not fall below 2 m so that everyone in the room can still orient themselves safely."
- "The haze or mist generated by the device may trigger smoke alarms." "Maintain a safety distance of 1 m to flammable materials."

### 2.21 Trust-walk facilitation guides (Teampedia, SessionLab)
https://teampedia.net/wiki/Trust_Walk and https://www.sessionlab.com/methods/trust-walk. Community facilitation pages, not escape-room sources; I found no escape-room guideline on blindfolds. The shared rules: the sighted guide carries full responsibility, walk the route in advance and remove any doubtful obstacle, brief on contact and distress signals before starting, and tell participants they may remove the blindfold at any time.

### Sources I could not reach

- GDC Vault, Laura Hall, "Lessons from Escape Rooms" (2017): login wall. The Mercury interview stands in.
- r/escaperooms "Linear vs non linear" (April 2025): reddit and two mirrors refused the fetch. The search summary reported one designer saying non-linear is usually best but "if you want throughput and lots of players, make it linear," and another describing a room "linear for the first half, dictated by the story, then shifts to non-linear after a narrative twist." Treat as unverified.
- Nicholson and Cable, "Unlocking the Potential of Puzzle-based Learning" (Sage, 2021): paywalled; only the table of contents was visible (chapter 5 "Concepts for puzzle design," chapter 6 "Designing specific puzzle types," chapter 9 on running the game).
- Live Escape Salisbury's gamemaster blog on hint timing: HTTP 403. The search summary said their games have time estimates for milestones and that the gamemaster waits an extra minute before offering help because teams often solve the puzzle right as the hint is about to be given. Unverified.
- Elumir's "5 Tips for New Puzzle Designers" and "6 Mindsets to Overcome" are video-only.

## 3. Principles

Rules a builder can apply, each with the sources behind it.

### Structure

1. Pick the structure by team size and story need. Sequential suits a small team that stays together and puzzles that need everyone; path-based lets a team split and lets difficulty ramp; open suits large groups and is hardest to pace. Most real rooms are hybrids. (Nicholson 2015, 2.1; Wiemker 2.4.)
2. Any linear stretch must be short and easy, and no puzzle on the critical path may be workable by one person only. "If you need to make some part linear, use very easy puzzles." (Matoušek 2.16; Wiemker 2.4; Elumir rule 7, 2.5.)
3. Use branching to keep all hands busy and chokepoints to move the story. End with a linear finish "to ensure everyone is watching the final moments." (Matoušek 2.16; Logic Escapes Me 2.15.)
4. The finale is a meta-puzzle: its answer is assembled from what earlier puzzles produced, and the pieces should be physical. (Wiemker and Clare 2.4; Nicholson's pyramid 2.1.)
5. Separate information from where it is used, and give each player a prop or ability that makes them necessary. (Short 2.14; Wiemker 2.4 on puzzles that need several people.)
6. The dependency graph must be acyclic, each clue is used once, and nothing big can be missed. (Matoušek 2.16; Spira dos and don'ts 2.13.)

### Objective legibility

7. Ask why of every object and task. The player needs "a meaningful reason for taking on a task other than 'it's the next thing to do in the room'." (Nicholson Ask Why 2.3.)
8. Actions must be discernable and integrated: players see the result of what they did, and it changes the game. Puzzles give feedback and answers self-validate. (Nicholson 2.3; Elumir rules 4 and 10, 2.5.)
9. Players must be able to tell which gates are open and which clue belongs to which gate. (Elumir 2.5 rule 5, 2.6.)
10. Rules are stated once, clearly and in the fiction, and never violated by the game. (Spira 2.13; the earlier finale research's ARGNet note on The Man From Beyond.)
11. A clock can be diegetic if it is legible: the zombie's chain lengthens every five minutes. Solution-triggered reveals are easier to stage than timer-triggered ones. (Nicholson 2.1; Short 2.14.)
12. Players' focus narrows under a clock; plan where their attention will be and direct it. (Hall 2.17.)

### Hints

13. The hint system is part of the design, not an afterthought. A hint request means the fun has stopped; hint rate per puzzle is a tuning metric. (Spira 2.7.)
14. Most players will not ask. A gamemaster watching and intervening on their own judgment beats request-only, and open-line nudging reduces time stuck. (Nicholson 2.1; Spira 2.7; Short 2.14.)
15. Caps of two or three hints are arbitrary and push players to suffer rather than ask. Operators who dropped caps did not regret it. (Spira 2.7; Suleski and Breakout 2.18.)
16. Time hints so you never take the breakthrough away. Operators use milestone times and a short wait before stepping in. (Nicholson 2.1; Live Escape, unverified, 2 end.)
17. Size hints from a single-word pointer upward, and run two channels: a subtle one and a tangible one. (Logic Escapes Me 2.15.)
18. Hints in character "don't feel like hints." Narrator and optional-reception styles let players take a hint without admitting defeat. Make the hint system part of the theme. (Burns 2.8, 2.9; Matoušek 2.16.)
19. An in-room actor must build trust fast, play to the players, read the quiet ones, keep monologues short, and use their power with restraint. (Spira 2.10.)

### Pacing and reveals

20. Keep players between frustration and boredom; release new content on a regular beat. (Wiemker 2.4; Short 2.14.)
21. No puzzle over five minutes for a player who knows the method; add puzzles, not tedium. Too many aha puzzles shut out newcomers. (Elumir 2.5, 2.6.)
22. Every puzzle is a standalone memorable moment; vary types; cut the throwaways. (Spira 2.13.)
23. Before a reveal, bottleneck the group so everyone is looking at the same place, then cue with sound or light. (Short 2.14; Matoušek 2.16 on chokepoints for story points.)
24. Story reveals should change play: a challenge that yields a tool, a new encoding, or a new understanding is more meaningful than one that yields a code. (Nicholson 2.3; Nicholson 2.2 on puzzles that move the narrative.)
25. Start shallow and deepen; players confused by the setting at minute one stay confused. (Nicholson 2.3.)
26. After the climax, show evidence the world changed and leave space before the host breaks immersion. (Burns 2.12.)

### Fail states

27. Design the failure ending as a set piece as exciting as the win. "Meaningful stakes equals meaningful failure." (Stein 2.11; Clare via Short 2.14.)
28. Tier the win: a core objective most groups reach, harder objectives for a better ending. Avoid instant fail with time left. (Stein 2.11.)
29. Most facilities walk a failed team through the rest and debrief; players should leave knowing what they missed. (Nicholson 2.1; Spira dos and don'ts 2.13.)
30. Full-escape rates around 40 percent are normal for commercial rooms; hosts tune that live through hints. (Nicholson 2.1; Breakout 2.18.)

### Practicality

31. No prop whose failure ends the game; map the critical path and plan a bypass for each prop; be ready to cover in character. (Logic Escapes Me 2.15.)
32. Check the set before every group. Props will be broken. No destroyable puzzle states. (Spira 2.13; Hall 2.17; Elumir 2.5.)
33. A home room can run 15-minute slots with 30-second resets if each room's props live in one bin and nothing has to be re-hidden. (Lock Paper Scissors 2.19.)
34. Fog: keep visibility at 2 m or more, never aim at floors, 50 cm from the nozzle, expect smoke alarms. In a dark room give a light or a sound to navigate by. Always a way out. (Manual 2.20; Matoušek 2.16.)
35. Blindfolds: a sighted guide owns the blind player's safety, the route is walked in advance, the blindfold can come off at any time. (Trust-walk guides 2.21; Matoušek 2.16 on never making players do unsafe things.)
36. "An escape room is only as good as the people running it." One actor in the room plus one person on effects is the published working model; the actor must know every puzzle cold. (Lock Paper Scissors 2.19; Burns 2.9; Nicholson 2.1 on in-room actors in 10 percent of rooms.)

### Mistakes experienced designers name

- Puzzles too hard; nobody tests with newcomers. (Elumir rule 12.)
- Difficulty faked with tedium: more screws, more searching, more counting. (Elumir 2.6.)
- Red herrings. (Elumir, Matoušek, a Nicholson respondent.)
- Ambiguity about which clue goes where, and locks that become the puzzle. (Elumir 2.5, 2.6.)
- Objects with no story reason, "escape room logic." (Nicholson 2.3.)
- Flimsy builds, repeated lock types, throwaway puzzles. (Spira 2.13.)
- Long monologues from actors; actors who do not read the whole team. (Spira 2.10.)
- An ending that is a host saying "time's up," and a story that stops at the climax. (Stein 2.11; Burns 2.12.)
- A non-linear room where several puzzles are partly available but none can be finished, so players "cannot tell what is relevant." (Room Escape Artist's Trapped Room 9 review, seen only in a search summary.)
- Hidden hint caps and hint penalties that stop players asking. (Nicholson 2.1; Suleski 2.18.)

## 4. What this means for our game

### 4.1 Where hub-and-spoke sits in the taxonomy

The settled structure (seance room, out to one child's puzzle, back, repeat four times, then the turn) is a sequential game at the top level: four stages in a fixed order, the whole team at each. Each spoke is a short linear chain. The relic placement at the hub is the meta-puzzle of Nicholson's pyramid, with physical pieces as Wiemker and Clare recommend. Nicholson's data says sequential is the right call for a small team that stays together, which the October 1 notes already decided.

The known cost is the bottleneck. The sources give three conditions that make a sequential game work, and all three apply to every spoke:

- The spoke's puzzle must be workable by all four at once. Short's "separate information from where it is used" and Wiemker's several-people puzzles are the pattern: the hands-child's spoke, for instance, should put the thing to be manipulated in one place and the knowledge of how to manipulate it in another, so two people fetch and read while two act.
- The spoke must be short and easy. Matoušek: linear parts use "very easy puzzles." Elumir: under five minutes. At a 20-minute target that means one gate per spoke, not a chain.
- The spoke's answer must self-validate and give feedback at the hub. The relic is the feedback; placing it must visibly do something (a candle, a sound layer, the mother's reaction) so the group knows the stage is done. (Elumir rules 4 and 10.)

### 4.2 Where the handoff already follows good practice

- One sentence of objective, success and failure that can be stated plainly (handoff sections 1, 13, 14.1 and 14.2). This is Ask Why's "meaningful reason" and Room Escape Artist's "do have a climax."
- Each child's spoke reveals both a role and a fate (section 5). This is Nicholson's third level of narrative, puzzles that cannot be separated from the story, and his "challenge that yields a tool or a new understanding."
- The fourth relic triggers the turn (section 9). Short's rule for reveals is exactly this: bottleneck the group at one spot, then cue with sound and light. A solution-triggered turn is also easier to stage than a timer-triggered one.
- The soundtrack as the clock, with puzzle successes removing layers (section 10). That is Nicholson's lengthening zombie chain and Elumir's feedback rule in one device, and it avoids a display that would break Hall's "never break the spell."
- Curses the players put on themselves under a rule stated at the seance (section 8). Spira's "rules clear, minimal, consistent" and the dos-and-don'ts "rules explanation" both say to teach the rule once, early, in the fiction.
- No arbitrary codes (section 11). Ask Why and Elumir's rule 6 say the same thing from the other side: every correlation must make sense in the setting.
- Blind player stationary (section 8 safety note). Matches Matoušek's dark-room rule and the trust-walk guides.
- The "best next design session" page asks the three questions before building puzzles. Stein and Burns would approve; the ending is where most rooms fail, and the sources say to build the final chain backward from the winning action.

### 4.3 Where the handoff violates or risks violating the rules

1. No hint channel exists. The medium "does not know the complete historical truth" (section 4) and the mother is learning it too (section 5). Both are good story choices. But the hint sources are unanimous that a game lives or dies on its hint system and that most players will not ask (Nicholson, Spira, Short). As written, nobody in the fiction can nudge a stuck group without breaking character. Section 4.5 proposes how the medium can hint without knowing the history.
2. The finale is sketched as four parallel single-sense puzzles (section 10). With four players each missing a sense, that is an open structure, which Nicholson calls the hardest to pace and Wiemker says gives "no clear indication on where to start." The SPECTRE pattern and Matoušek's chokepoint rule say the last step must be linear so everyone watches the same thing. The four cursed tasks can exist, but they should converge on one final physical act.
3. The run is over target because the spokes are chains. The simulation found 24 minutes of scenes at rev 07. The CTU and Elumir rules cap any linear step at a few minutes, which means each spoke gets one gate. Four spokes with two gates each cannot fit in 20 minutes with hub returns.
4. Arrival, seance and reveal have no game in them (simulation finding 4). Ask Why says to initiate players shallowly, and Spira's actor rules say to do the story quickly. The seance should contain the first gate: the moment the "if the spirit calls you, obey" rule is used once for real, so players learn the hint channel and the curse rule by doing, not by being told.
5. The failure state is undefined (section 13). Stein: the ending is the most underdesigned part of most rooms; failure must be a set piece; tiered wins are the fix. With four children, the tier is obvious: each child put to rest is a step, all four is the full win, and the ending the group gets is determined by the count. The earlier finale research's roll call already has this shape.
6. Sensory curses stack with fog and dark. The manual's 2 m visibility rule, the slippery-floor warning and the smoke-alarm warning mean the fire must be light haze, not fog, and the blind player's station must be set before the turn, with one named sighted guide.
7. Players must not be able to miss a spoke or finish one early. The dos-and-don'ts "don't let it be possible to miss big puzzles" and Matoušek's acyclic graph mean each spoke's relic must gate the next spoke's opening (the medium only sends them out again after a relic lands).
8. Reset. The Adams family ran 30-second resets by keeping each room's props in a bin and re-hiding nothing. Four spokes plus a hub with candles, cards and relics is more than that; the handoff asks for a reset procedure per prop (section 10) and the sources agree. The notes accept up to 15 minutes, so this is a cost to design down, not a blocker.

### 4.4 Pacing options for a 20-minute four-player run

Numbers below are my arithmetic from the sources' per-step limits, not published run sheets. The sources give per-puzzle caps and a hint rule of thumb for 60-minute rooms; I scaled them.

| Segment | Option A: four equal spokes | Option B: front-loaded teaching spoke | Option C: paired spokes |
|---|---|---|---|
| Seance opening, includes the tutorial gate | 3 min | 3 min | 3 min |
| Spoke 1 | 3 min, one gate | 4 min, one gate, taught slowly | 4 min, two children's gates side by side |
| Spoke 2 | 3 min | 3 min | 4 min, the other two |
| Spoke 3 | 3 min | 2.5 min | none |
| Spoke 4 | 3 min | 2.5 min | none |
| Turn, curses self-applied | 1 min | 1 min | 1 min |
| Finale | 4 min | 4 min | 6 min |
| Denouement and walk out | 1 min | 1 min | 2 min |
| Total | 21 min | 21 min | 20 min |

- Option A is the straight reading of the settled structure. Each spoke is find, one puzzle, relic, return. Hub returns cost about 15 seconds each if the spokes are adjacent rooms; the simulation budgeted one minute of movement for the whole run.
- Option B follows Nicholson's scaffolding: the first spoke teaches the pattern (and the hint channel) and later spokes repeat it faster, which also matches Elumir's rule 11, follow the patterns you set. The last two spokes can be the same puzzle shape with new content.
- Option C breaks the settled "one child, come back, repeat" rhythm and is listed only because it is the one that reliably lands under 20. It halves the hub returns and gives a longer finale. It is a captain call, not a recommendation.

Finale length: no source gives a number. The SPECTRE and Hayden Farm reviews describe finales as a few minutes of linear play; Stein warns against ending early. Four to six minutes of a 20-minute run, with the soundtrack as the clock, is my proposal.

Steps per spoke: one gate, with searching and feedback around it, so the whole loop in Elumir's terms (identify, collect, select, aha, process, input) runs once per spoke. Two gates per spoke only fits if the second is under a minute and needs no hint.

Hint timing at this scale: Elumir's five-minute cap and Breakout's five-minute stall rule are for hour-long rooms. At 20 minutes a five-minute stall is a quarter of the run. My scaled proposal, to be tested: first nudge at about 90 seconds of no visible progress on a spoke, a direct push at three minutes, and a hard bypass (the medium or the mother does it) at four, so no spoke ever exceeds its slot. These are starting values for rehearsal, not source numbers.

### 4.5 In-character hints from a medium who does not know the answer

The constraint is that Tamari's character is sincere and ignorant of the history. The sources offer three channels that fit that:

1. Attention hints by the medium's craft. Burns' narrator style, reshaped: the medium reads the table, not the puzzle. "She keeps turning toward the hearth." "The cards went cold when you put that down." She names where to look, never what to do. This needs only that Tamari knows the puzzles cold, as the Hayden Farm actors did, not that her character does.
2. One-word answers from the spirit. SPECTRE's "single word pointer" through a channel the players already trust: raps on the table, a card turned, a word through the medium's mouth. The spirit knows her own house, so this is diegetic. The captain, on effects, can trigger it, which keeps the medium's timing honest.
3. Optional hint reception. A face-down card per child on the seance table, revealed when the group chooses. Burns' point is that it removes the admission of defeat. The cost can be nothing, or it can be tied to the curse economy the notes have not settled; that is a captain call.

The command channel already in the handoff, "if the spirit calls you, obey it," is the fourth tier: the direct push and the bypass are the spirit telling a named player to do a thing. Teaching it at the seance (section 4.3 item 4) means no hint ever breaks character.

### 4.6 The three open questions, as the sources frame them

- What does the mother intend? The sources do not decide this, but they constrain it. Ask Why: the last task must be the thing the story needs done. Nicholson: an in-room adversary works as difficulty control. Stein: do not hide the best content behind failure, and use forced failure sparingly. Whichever intent is chosen, the finale should let the group both succeed and partly succeed.
- What happens in ten minutes if nobody stops her? Stein and Burns: the failure must be a staged ending with its own beat and a denouement, never a host saying time is up, and never an instant stop with time left. Nicholson: afterwards, walk the group through what they missed.
- What physical action is victory? Elumir and Short: a single act that self-validates, that the whole group watches, and that visibly removes the threat. The soundtrack layers already give the feedback mechanism; the last layer going silent is the win signal.

## 5. Evidence trail

- Context read: `data/halloween_escape_room_design_handoff.md` in full; `data/halloween-2026-notes.md` and `data/halloween-review-2026-10-06-log.md` in full; section headings plus findings and proposals from `data/halloween-finale-research/report.md`, `data/halloween-game-sim/report.md`, `data/halloween-storyboard/report.md`.
- PDFs fetched and extracted locally with `pdftotext -layout` into the session scratchpad: Nicholson 2015, 2016 (two papers), 2018; Wiemker, Elumir and Clare 2015; Matoušek lecture; Stairville AF-40 manual; Chalmers 2021 "Escape Room Generator" thesis (read for its progression-structure section, which restates Nicholson's linear and pyramid forms and adds a DAG form; not cited above because it adds nothing beyond the primary papers).
- Web pages fetched: the Room Escape Artist, Codex, Logic Escapes Me, Emily Short, Portland Mercury, Escape Effect, Breakout, Lock Paper Scissors, Teampedia and SessionLab pages listed in section 2.
- Fetches that failed: GDC Vault (login), reddit and two mirrors (404, 429, blocked), live-escape.co.uk (403), Nicholson and Cable (paywall).
- No file in the halloween repo or in the data directory other than this report was written.
