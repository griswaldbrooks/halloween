# Playtest: the rage / vengeance finale

Task `hw-play-rage`, 2026-10-08. I copied the engine into the worktree (`sim/`), played the investigation as written three times driving all four players, then added the rules the rage direction needs and played it to a win and a loss with all four curses on. The engine folder under `data/` is untouched. Nothing in the halloween repo changed; no push, no PR. Everything in this report comes from the transcripts in the worktree; the finale excerpts and the full scratch diff are appended, because the worktree is discarded.

## 1. The three sentences (PROPOSAL)

- **She now intends to** put her husband into the fire: to condemn him as he condemned her, and let the haunting burn him as it burned the children.
- **If the players fail,** the fire reaches him: his voice joins the children's screams, then the soundscape cuts to silence, the lights drop, and the medium closes the circle with six spirits unresolved.
- **The players win when they** assemble the four parts of his reason from the four relics on the table and one of them says it aloud to her before the fire reaches him.

The medium's objective line, in character (the immersive report's template: intent, deadline cue, winning action, objects, confirmation, first action):

> "She means to put him in the fire. Before it reaches him, you must find in the four relics why he did what he did, and one of you must say it to her. You will know it worked when the screaming stops. Start with the relics on the table."

Every element is in the handoff: the husband is one of the six spirits and spirits may be recorded voices (section 12); the fire soundscape with screams (6, 10); the relics on the table (9); his reason (3); the soundscape as the clock, with a layer removed per success (10). The one thing the handoff does not say is that the relics carry his reason; that is rule R5 below, and it is the direction's main strain.

## 2. Part 1: the game as written

Three runs, rage variant, default jitter, no finale loaded (the handoff has none), all four players driven by me. Full transcripts (every player's observation after every move) are `sim/transcripts/run1_group.txt`, `run2_split.txt`, `run2b_split_nohint.txt`; the moves I played are the `.moves` files beside them. Driver: `sim/drive.py` (replays a moves file; `python3 drive.py MOVES OUT --seed N --variant rage [--set K=V]`).

How I played: everyone reads each clue; the player bound to the room's child works the prop; the other three watch; the group asks the medium after about ninety seconds stuck (the escape report's scaled first nudge). Rooms in table order, because nothing in the fiction points at a door.

| stage | run 1: group, seed 1 | run 2b: split, seed 2, no hints |
|---|---|---|
| opening | 2:00 | 2:00 |
| Deliverance room | 3:47 | 4:16 alone |
| Waitstill room | 3:49 | 2:41 alone |
| Mindwell room | 3:45 | 3:58 alone |
| Remember room | 4:11 | 3:26 alone |
| each return to the table | 0:30 | 0:30 |
| fourth relic lands | 20:17 | 7:06 |
| turn, four invocations, four curses | 2:30 | 2:30 |
| first legal finale action | 22:02 | 9:36 |
| hints taken | 0 | 0 |
| run ended by | question 10 (rage: where is his motive, what act proves it) | question 10 |

Run 2a is the same split start as 2b; it ended at 4:10 on question 1 (where is the medium) the first time a lone player asked for help.

### Opening: nobody knows which door

The whole briefing is two lines, and the legal moves are four doors:

```
2:00 -           (opening)        all: The seance opens. Each of you is bound to one child and holds its object. If the spirit calls you, obey it. | The mother asks: find my children; discover what became of them.   [next deliverance]
can: wait, go deliverance, go waitstill, go mindwell, go remember, relay waitstill, relay mindwell, relay remember, confer
```

Nothing names a first room and nothing says to stay together. Four doors, four children, four players: in run 2 they split, and the design is silent on it. The first lone player who got stuck asked for the medium and the rules ran out:

```
4:10 deliverance deliverance work deliverance: deliverance_1: no result yet (1:30 of effort so far).   [next mindwell]
4:10 deliverance deliverance hint    [next deliverance]
== UNDEFINED ==
Run ended at 4:10: the rules do not say: Where is the medium when the players are in different rooms? (one live medium; hub-and-spoke)
```

### Each child's room: one works, three watch

Every room ran the same way: four people read for twenty seconds, then one person worked for one to two and a half minutes while the others stood there. From run 1, Deliverance's first prop:

```
2:55 deliverance deliverance work deliverance: deliverance_1: no result yet (0:15 of effort so far).
2:55 waitstill   wait (sync)      
2:55 mindwell    wait (sync)      
2:55 remember    wait (sync)      
3:10 deliverance deliverance work deliverance: deliverance_1: no result yet (0:30 of effort so far).
3:10 waitstill   wait (sync)      
3:10 mindwell    wait (sync)      
3:10 remember    wait (sync)      
3:25 deliverance deliverance work deliverance: deliverance_1: no result yet (0:45 of effort so far).
3:25 waitstill   wait (sync)      
3:25 mindwell    wait (sync)      
3:25 remember    wait (sync)      
3:29 deliverance deliverance work all: deliverance_1 is solved.
3:29 waitstill   wait (sync)      
```

Per watcher that is about 9:30 of the 18:17 of investigation spent watching. The research warned of exactly this (immersive: "four people travelling together do not guarantee four people playing"). The engine's effort rule (two people on one prop do not halve it) is the honest version of a single prop.

### The hint never lands

The medium's offer becomes legal after sixty seconds of effort on a step. The group, asking when it felt stuck, asked three times and was refused three times; the one time the offer was open they solved the prop before asking:

```
offer open at 4:34 on deliverance_2:  can: wait, go seance, go waitstill, go mindwell, go remember, examine, work, hint, relay deliverance, relay mindwell, relay remember, confer
5:47 deliverance deliverance hint !! nothing is stalled here
16:48 remember    remember hint    !! the medium does not offer a hint yet (0:00 of effort on remember_2 since the last hint; she waits for 1:00)
19:02 remember    remember hint    !! nothing is stalled here
```

Twenty-two minutes, zero hints, three refusals. A timer-triggered offer and a human asking when stuck do not meet; the escape report (4.3 item 1) says the channel itself is undefined, and the engine confirms that the one modelled channel is one nobody used.

### The return to the table does nothing

Each return is walk 0:20, place 0:10, "X places X_relic on the table.", walk out 0:20. Nothing changes at the table, nobody gains anything, and the fiction gives no reason to go back except that the doors only connect through the hub. The immersive report asks each return to be an advance; as written it is a corridor.

### The turn: the truth is told, not found

```
20:17 remember    remember place   all: The mother understands. She breaks. | Crackling, then screaming. The soundscape begins. | Deliverance. deliverance, the spirit calls you. | remember places remember_relic on the table. | The fourth relic lands. The truth...
21:47 mindwell    mindwell curse   deliverance: Remember. remember, the spirit calls you. | mindwell is now muffled. | The medium turns to remember.; waitstill: Remember. remember, the spirit calls you.; mindwell: mindwell is now muffled. | You apply your curs...
22:02 remember    remember curse   deliverance: Uncover and prove the full truth about the husband before she completes her destructive act. | remember is now silenced. | Objective: Uncover and prove the full truth about the husband before she completes her de...
```

Each player's knowledge at 20:17 is four lines of "part of what happened to X". The fourth relic does not complete a deduction; the engine declares the truth. In split play it is worse: every player saw only their own child's reveal, so at the turn:

```
deliverance knows ['deliverance_1', 'deliverance_2'], waitstill knows ['waitstill_1', 'waitstill_2'], mindwell knows ['mindwell_1', 'mindwell_2'], remember knows ['remember_1', 'remember_2']
```

Ledger question 6 (do the first three spokes each reveal a death?) decides whether the fourth relic can be a discovery at all.

Two more things the turn showed. The soundscape starts at 20:17 and the first action the players can take is at 22:02: 2:30 of a ten-minute clock is spent being cursed (engine question 4, still open). And the muffled player hears nothing after their own curse: at 21:47 Mindwell did not hear "Remember, the spirit calls you", and got the objective only as the engine's note, not as the medium's voice.

In split play the fast finishers stood at an empty table: Waitstill from 5:31, Remember from 6:16, until the fourth relic at 7:06:

```
5:31 waitstill   waitstill place  waitstill: waitstill places waitstill_relic on the table.
6:16 remember    remember place   waitstill: remember places remember_relic on the table.; remember: remember places remember_relic on the table.
7:51 deliverance deliverance place all: The mother understands. She breaks. | Crackling, then screaming. The soundscape begins. | Deliverance. deliverance, the spirit calls you. | deliverance places d...
9:36 remember    remember curse   deliverance: Uncover and prove the full truth about the husband before she completes her destructive act. | remember is now silenced. | Objective: Uncover and prove t...
```

### The finale as written: no move exists

```
== UNDEFINED ==
Run ended at 22:02: the rules do not say: Where in the house is the husband's true motive found, and what physical act proves it to her? No spoke reveal contains it: spokes reveal each child's role and fate (handoff 5). (handoff 13, rage)
can after the fourth curse: []
```

Three engine notes for the owner, not design findings: the stage table is wrong in split mode (run 2a prints "remember 2:10" because stages assume the group moves together); a prop's `by` player did not have to know the prop (the pristine engine let Waitstill's knowledge drive Mindwell's box with Mindwell's clock untouched; fixed in scratch as R7); and knowledge is not timestamped, so a player acting at an earlier clock can use what another player learned at a later one.

## 3. Rules added, scratch only

One list. "Captain call" means it is one of the handoff's three sentences or a question the ledger assigns him; "designer choice" means a content designer can settle it inside those sentences. Question numbers are the engine report's section 3; ledger numbers are the unknowns ledger's "Answer these first".

| id | rule | answers | owner | where |
|---|---|---|---|---|
| R1 | She intends to put him in the fire. Her act advances at three marks on the fire clock (7:30, 5:00, 2:30 left), each spoken by her and visible as the light shifts, so the muffled player sees it. | ledger 1 (F1); engine Q10, the act | captain call (the sentence); designer choice (the three marks) | `VARIANTS["rage"].objective`, `RAGE_STAGES`, `Game.advance` |
| R2 | At expiry the fire reaches him: his voice joins the screams, silence, dark, the medium closes the circle. | ledger 2 (F2); engine Q5 for this direction | captain call | `VARIANTS["rage"].loss` |
| R3 | The win is the testimony: any player who can still speak says his reason to her, and it cannot start until the three pieces are assembled. Solving it ends the run as won. | ledger 3 (F3) and 4 (F8: the reason is the win, by construction); engine Q8, Q10 (what act proves it) | captain call | `Step.requires`, `do_work`, `Game.win`, `win_step` |
| R4 | `show`: point, mime or write a word; the shower needs hands, the one shown needs eyes; 25 s. Relay to the muffled and from the silenced is refused at no cost instead of ending the run. | engine Q6, Q7 | designer choice (the immersive "Curses" table lists gestures, pointing, writing as what silence and deafness leave) | `do_show`, `legal`, `do_relay`, `SHOW_SECONDS` |
| R5 | The proof is in the four relics on the table: four pieces, which are the handoff's own floated props (section 10) read as the four parts of his reason. Deliverance, Waitstill and Remember hold theirs in their heads; Mindwell must work theirs. Any order, at the same time. | engine Q10, where it is found | designer choice; no new content, but one new fact about the props (see section 5). The "holds it in the head" part is the engine's assumption 10, unchanged and still unanswered | `FINALE_PRESETS["rage"]`, `pick_step`, `sight`, `legal` |
| R6 | Each solved piece: a layer of the soundscape falls silent and a visible cue lands at the table (placeholder: a candle), so the solve is legible to whoever cannot hear. | handoff 10; immersive "a short acknowledgment plus a persistent prop or light state" | designer choice | `do_work` |
| R7 | The player a piece is bound to must know it before working it. | none; an engine fix. Without it Mindwell's piece was done by whoever knew it and the curse removed nothing | designer choice | `do_work` |

Not a rule, but changed: finale pieces get the same per-run jitter as spoke steps (a piece is as uncertain as a spoke), and `FIRE_TIMER_STARTS` stays `"turn"` because question 4 is the captain's.

## 4. Win and loss

Win: run 3, seed 1, group together, default jitter: the run 1 investigation followed by the finale, four cursed players at the table, pieces worked in parallel. Loss: run 4, seed 5 (the slowest of seeds 0 to 9), jitter 1.2 to 1.6 on every step, group together, five hints, the finale played one piece at a time with everyone watching, which is what the investigation taught them.

| | win (run 3) | loss (run 4) |
|---|---|---|
| fourth relic, fire starts | 20:17 | 22:22 |
| fourth curse, first action | 22:02 | 24:52 |
| fire left at first action | 7:30 | 7:30 |
| lookout done | 23:06 | 28:47 |
| courier done | 23:09 | 26:59 |
| overheard done | 24:34 | 31:34 |
| testimony | 25:20, 4:12 left | never: shown at 31:34 with 0:48 left |
| finale length | 3:17 | 7:30, expired |
| total run | 25:20 | 32:22 |
| hints | 0 | 5 |

Finale of the win (from the fourth relic; the acting player's clock, their move, what players perceived; waits cut):

```
20:17 remember    remember place   all: The mother understands. She breaks. | Crackling, then screaming. The soundscape begins. | Deliverance. deliverance, the spirit cal...   [next deliverance fire 9:15]
20:47 deliverance deliverance curse deliverance: Waitstill. waitstill, the spirit calls you. | deliverance is now gloved. | You apply your curse: you are gloved. | The me...   [next waitstill fire 8:45]
21:17 waitstill   waitstill curse  deliverance: Mindwell. mindwell, the spirit calls you. | waitstill is now blindfolded. | The medium turns to mindwell.; waitstill: Mind...   [next mindwell fire 8:15]
21:47 mindwell    mindwell curse   deliverance: Remember. remember, the spirit calls you. | mindwell is now muffled. | The medium turns to remember.; waitstill: Remember....   [next remember fire 7:45]
22:02 remember    remember curse   deliverance: She names him. (7:30 of fire left) | She means to put him in the fire. Before it reaches him, you must find in the four re...   [next deliverance fire 7:30]
22:22 deliverance deliverance confer deliverance: The players confer.; waitstill: The players confer.; remember: The players confer.   [next deliverance fire 7:10]
22:37 deliverance deliverance grind lookout deliverance: lookout: no result yet (0:15 of effort so far).   [next waitstill fire 7:10]
22:42 waitstill   waitstill examine overheard waitstill: You take in the clue for overheard.   [next mindwell fire 7:10]
22:22 mindwell    mindwell grind overheard !! mindwell must know what overheard asks for before working it; have it shown or told to you   [next mindwell fire 7:10]
22:37 remember    remember grind courier remember: courier: no result yet (0:15 of effort so far).   [next deliverance fire 6:55]
22:52 deliverance deliverance grind lookout deliverance: lookout: no result yet (0:30 of effort so far).   [next mindwell fire 6:55]
22:37 mindwell    mindwell grind overheard !! mindwell must know what overheard asks for before working it; have it shown or told to you   [next mindwell fire 6:55]
22:52 remember    remember grind courier remember: courier: no result yet (0:30 of effort so far).   [next waitstill fire 6:50]
23:07 waitstill   waitstill show mindwell deliverance: waitstill shows mindwell what they know.; mindwell: waitstill shows mindwell what they know.; remember: waitstill s...   [next deliverance fire 6:40]
23:06 deliverance deliverance grind lookout deliverance: A layer of the soundscape falls silent: lookout is done. | lookout is solved. | A candle on the table lights itse...   [next remember fire 6:40]
23:07 remember    remember grind courier remember: courier: no result yet (0:45 of effort so far).   [next deliverance fire 6:26]
23:22 mindwell    mindwell grind overheard mindwell: overheard: no result yet (0:15 of effort so far).   [next remember fire 6:25]
23:09 remember    remember grind courier deliverance: A layer of the soundscape falls silent: courier is done. | courier is solved. | A candle on the table lights itself:...   [next deliverance fire 6:25]
23:37 mindwell    mindwell grind overheard mindwell: overheard: no result yet (0:30 of effort so far).   [next remember fire 6:10]
23:52 mindwell    mindwell grind overheard mindwell: overheard: no result yet (0:45 of effort so far).   [next remember fire 5:55]
24:07 mindwell    mindwell grind overheard mindwell: overheard: no result yet (1:00 of effort so far).   [next remember fire 5:40]
24:22 mindwell    mindwell grind overheard mindwell: overheard: no result yet (1:15 of effort so far).   [next remember fire 5:25]
24:34 mindwell    mindwell grind overheard deliverance: She pronounces his sentence. (5:00 of fire left) | A layer of the soundscape falls silent: overheard is done. | Th...   [next remember fire 5:10]
24:47 remember    remember show deliverance deliverance: remember shows deliverance what they know.; mindwell: remember shows deliverance what they know.; remember: remem...   [next waitstill fire 5:10]
25:02 deliverance deliverance grind testimony deliverance: testimony: no result yet (0:15 of effort so far).   [next waitstill fire 4:45]
25:17 deliverance deliverance grind testimony deliverance: testimony: no result yet (0:30 of effort so far).   [next waitstill fire 4:30]
25:20 deliverance deliverance grind testimony deliverance: testimony is solved.; mindwell: testimony is solved.; remember: testimony is solved.   [next waitstill fire 4:15]

== WON ==
You won because deliverance spoke his reason to her at 25:20, with 4:12 of the fire left. The screaming stops; the fire light steadies; she answers him.
total run length: 25:20 (target 20:00)
time per stage:
  opening        2:00
  deliverance    3:47
  seance         0:30
  waitstill      3:49
  seance         0:30
  mindwell       3:45
  seance         0:30
  remember       4:11
  seance         0:30
  turn           2:30
  finale         3:17
hints used: 0
curses active at each finale step:
  curse:deliverance 20:32  deliverance=gloved, waitstill=-, mindwell=-, remember=-
  curse:waitstill  21:02  deliverance=gloved, waitstill=blindfolded, mindwell=-, remember=-
  curse:mindwell   21:32  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=-
  curse:remember   22:02  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  lookout          23:06  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  courier          23:09  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  overheard        24:34  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  testimony        25:20  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
undefined rules hit:
  -  none
```

Finale of the loss:

```
23:07 remember    remember place   all: The mother understands. She breaks. | Crackling, then screaming. The soundscape begins. | Deliverance. deliverance, the spirit cal...   [next deliverance fire 9:15]
23:37 deliverance deliverance curse deliverance: Waitstill. waitstill, the spirit calls you. | deliverance is now gloved. | You apply your curse: you are gloved. | The me...   [next waitstill fire 8:45]
24:07 waitstill   waitstill curse  deliverance: Mindwell. mindwell, the spirit calls you. | waitstill is now blindfolded. | The medium turns to mindwell.; waitstill: Mind...   [next mindwell fire 8:15]
24:37 mindwell    mindwell curse   deliverance: Remember. remember, the spirit calls you. | mindwell is now muffled. | The medium turns to remember.; waitstill: Remember....   [next remember fire 7:45]
24:52 remember    remember curse   deliverance: She names him. (7:30 of fire left) | She means to put him in the fire. Before it reaches him, you must find in the four re...   [next deliverance fire 7:30]
25:12 deliverance deliverance confer deliverance: The players confer.; waitstill: The players confer.; remember: The players confer.   [next deliverance fire 7:10]
25:27 deliverance deliverance work deliverance: courier: no result yet (0:15 of effort so far).   [next mindwell fire 7:10]
25:42 deliverance deliverance work deliverance: courier: no result yet (0:30 of effort so far).   [next mindwell fire 6:55]
25:57 deliverance deliverance work deliverance: courier: no result yet (0:45 of effort so far).   [next mindwell fire 6:40]
26:12 deliverance deliverance work deliverance: courier: no result yet (1:00 of effort so far).   [next mindwell fire 6:25]
26:27 deliverance deliverance work deliverance: courier: no result yet (1:15 of effort so far).   [next mindwell fire 6:10]
26:42 deliverance deliverance work deliverance: courier: no result yet (1:30 of effort so far).   [next mindwell fire 5:55]
26:57 deliverance deliverance hint courier deliverance: Hint for courier.; waitstill: Hint for courier.; remember: Hint for courier.   [next deliverance fire 5:25]
26:59 deliverance deliverance work deliverance: A layer of the soundscape falls silent: courier is done. | courier is solved. | A candle on the table lights itself: couri...   [next mindwell fire 5:25]
26:59 deliverance deliverance relay mindwell !! mindwell cannot hear you; show them instead (rage rule R4 answers engine report question 6)   [next deliverance fire 5:22]
27:19 deliverance deliverance confer deliverance: The players confer.; waitstill: The players confer.; remember: The players confer.   [next deliverance fire 5:02]
27:34 deliverance deliverance work lookout deliverance: She pronounces his sentence. (5:00 of fire left) | The light shifts: the fire has moved toward him. (5:00 of fire ...   [next waitstill fire 5:02]
27:49 deliverance deliverance work lookout deliverance: lookout: no result yet (0:30 of effort so far).   [next waitstill fire 4:47]
28:04 deliverance deliverance work lookout deliverance: lookout: no result yet (0:45 of effort so far).   [next waitstill fire 4:32]
28:19 deliverance deliverance work lookout deliverance: lookout: no result yet (1:00 of effort so far).   [next waitstill fire 4:17]
28:34 deliverance deliverance work lookout deliverance: lookout: no result yet (1:15 of effort so far).   [next waitstill fire 4:02]
28:47 deliverance deliverance work lookout deliverance: A layer of the soundscape falls silent: lookout is done. | lookout is solved. | A candle on the table lights itsel...   [next waitstill fire 3:47]
28:47 deliverance deliverance hint lookout !! no open finale step named 'lookout'; open: overheard, testimony   [next deliverance fire 3:35]
28:47 deliverance deliverance work lookout !! no open finale step named 'lookout'; open: overheard, testimony   [next deliverance fire 3:35]
28:47 deliverance deliverance work lookout !! no open finale step named 'lookout'; open: overheard, testimony   [next deliverance fire 3:35]
28:47 deliverance deliverance work lookout !! no open finale step named 'lookout'; open: overheard, testimony   [next deliverance fire 3:35]
28:47 deliverance deliverance work lookout !! no open finale step named 'lookout'; open: overheard, testimony   [next deliverance fire 3:35]
28:47 deliverance deliverance work lookout !! no open finale step named 'lookout'; open: overheard, testimony   [next deliverance fire 3:35]
29:07 deliverance deliverance examine overheard deliverance: You take in the clue for overheard.   [next waitstill fire 3:35]
29:07 deliverance deliverance show mindwell !! you cannot point or write with gloved hands; say it instead   [next deliverance fire 3:15]
29:22 deliverance deliverance relay waitstill deliverance: deliverance tells waitstill what they know.; waitstill: deliverance tells waitstill what they know.; remember: ...   [next mindwell fire 3:15]
29:47 waitstill   waitstill show mindwell deliverance: waitstill shows mindwell what they know.; mindwell: waitstill shows mindwell what they know.; remember: waitstill s...   [next remember fire 3:00]
30:02 mindwell    mindwell work overheard deliverance: The fire turns toward him. (2:30 of fire left) | The light shifts: the fire has moved toward him. (2:30 of fire lef...   [next remember fire 2:35]
30:17 mindwell    mindwell work overheard mindwell: overheard: no result yet (0:30 of effort so far).   [next remember fire 2:20]
30:32 mindwell    mindwell work overheard mindwell: overheard: no result yet (0:45 of effort so far).   [next remember fire 2:05]
30:47 mindwell    mindwell work overheard mindwell: overheard: no result yet (1:00 of effort so far).   [next remember fire 1:50]
31:02 mindwell    mindwell work overheard mindwell: overheard: no result yet (1:15 of effort so far).   [next remember fire 1:35]
31:17 mindwell    mindwell work overheard mindwell: overheard: no result yet (1:30 of effort so far).   [next remember fire 1:20]
31:32 mindwell    mindwell hint overheard deliverance: Hint for overheard.; waitstill: Hint for overheard.; remember: Hint for overheard.   [next deliverance fire 0:50]
31:34 mindwell    mindwell work overheard deliverance: A layer of the soundscape falls silent: overheard is done. | overheard is solved. | A candle on the table lights it...   [next remember fire 0:50]
31:34 mindwell    mindwell work overheard !! no open finale step named 'overheard'; open: testimony   [next mindwell fire 0:48]
31:34 mindwell    mindwell work overheard !! no open finale step named 'overheard'; open: testimony   [next mindwell fire 0:48]
31:34 mindwell    mindwell work overheard !! no open finale step named 'overheard'; open: testimony   [next mindwell fire 0:48]
31:34 mindwell    mindwell work overheard !! no open finale step named 'overheard'; open: testimony   [next mindwell fire 0:48]
31:59 remember    remember show deliverance deliverance: remember shows deliverance what they know.; mindwell: remember shows deliverance what they know.; remember: remem...   [next waitstill fire 0:48]
32:14 deliverance deliverance work testimony deliverance: testimony: no result yet (0:15 of effort so far).   [next waitstill fire 0:23]
32:22 deliverance deliverance work testimony    [next waitstill fire 0:08]

== LOST ==
You lost because the fire soundtrack ran out at 32:22, 10:00 after the turn, and the fire reached him: his voice joined the children's screams, then silence and darkness; the medium closed the circle with six spirits unresolved.
total run length: 32:22 (target 20:00)
time per stage:
  opening        2:00
  deliverance    4:26
  seance         0:30
  waitstill      5:02
  seance         0:30
  mindwell       4:46
  seance         0:30
  remember       4:05
  seance         0:30
  turn           2:30
  finale         7:30
hints used: 5
curses active at each finale step:
  curse:deliverance 23:22  deliverance=gloved, waitstill=-, mindwell=-, remember=-
  curse:waitstill  23:52  deliverance=gloved, waitstill=blindfolded, mindwell=-, remember=-
  curse:mindwell   24:22  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=-
  curse:remember   24:52  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  courier          26:59  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  lookout          28:47  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  overheard        31:34  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
undefined rules hit:
  32:22  What physically and visibly happens to the players when the ten minutes run out? (handoff 'Best next design session', question 2)
```

Against the research:

- **One linear final act everyone watches** (escape 4.3 item 2): yes for the testimony, which cannot start until the three pieces are done and which all four were on at once (Remember showed Deliverance; Deliverance spoke; the screaming stopped). The three pieces before it are open and parallel, which is what the win needed and what 4.3 says is hard to pace.
- **Failure legible and staged** (4.3 item 5): three marks and an expiry. In the loss the group heard "She names him", "She pronounces his sentence", "The fire turns toward him" and saw the light shift each time, with three candles lit of four when the fire reached him. Partial credit is visible; a tiered ending for one, two or three candles is not defined.
- **Each curse redistributed work rather than removing it** (immersive "Curses" table): Deliverance, gloved: directed the courier piece, read the lookout piece, spoke the testimony; the busiest player. Waitstill, blind: listened for the overheard piece in the soundscape, showed Mindwell by hand, and in the loss supplied the hands for the courier. Mindwell, muffled: worked one piece after being shown it, and could have been the speaker; missed the spoken objective and the last invocation. Remember, silenced: hands on the courier piece in the win, then one 25-second show. That last one is custody, not judgment, which the immersive report names as the failure to catch.
- **The blind player stayed at the table**: yes in both runs; no `go` after the curse, and the finale never needed one.

## 5. Verdict

The direction works as a game loop. A win and a loss both exist, the objective fits one sentence, the win is a performable act, the loss is a staged event, and every curse forces a hand-off. The margin is thin: parallel play won with 4:12 left; sequential play lost by about twenty seconds; the difference is whether the group splits the pieces, and nothing before the finale teaches that. The investigation teaches the opposite.

What it needed: a non-verbal channel (R4), the proof located somewhere (R5), a gate so the testimony is last (R3), a fix so Mindwell's piece is Mindwell's (R7), and marks on the fire clock (R1).

What it strains:

- The relics gain a second meaning. The handoff gives the relics no content about the husband. R5 is the smallest place to put his reason, but it is a new fact about the props, and the content pass has to write four pieces of a motive the handoff states in one sentence.
- Remember's role is custody. The silenced player holds the form of the proof and shows it once. The research says a role needs recurring judgment.
- Three players "know" their piece when the finale starts. The handoff says "may possess" and never how. Nothing in the spokes put it there.
- Her act is a timer. The pieces give feedback but do not slow her; only the testimony stops her. That is fine for rage, but it means the mother's progress and the players' progress are two separate meters.
- 7:30 of the ten minutes is playable; 2:30 is being cursed. On the slow group that is the whole loss: the same group with the clock starting after the fourth curse finishes with about 1:25 to spare.
- The run is 25 minutes on a fast seed and 32 on a slow one. The finale adds 3 to 7:30 on top of a 22-minute investigation.

What still has no answer: engine question 4 (when the soundtrack starts), the holder "how", where the reason physically is (R5 is a placement, not a prop), the ending for one to three candles, and questions 2 and 3 (the turn with a player away; a called player who does something else), which no run reached.

The three things that would most improve it:

1. **Teach the split before the curses.** One spoke, or the opening gate, should need two people on two things at once, so parallel work is a pattern the group has already run (escape 4.3 item 4; Elumir's "follow the patterns you set"). In the sim this is the entire difference between the win and the loss.
2. **Give Remember judgment, not custody.** Make the form of the testimony something the silenced player assembles from the three pieces as they land, so they work through the finale instead of waiting to show one card. This is a shape, not a puzzle.
3. **Start the ten minutes after the fourth curse, or cut the invocation beat.** With `FIRE_TIMER_STARTS=after_curses` the slow group wins; with `turn` it loses. That is engine question 4 and it is the captain's.

Captain calls in this report: the three sentences and the medium's line in section 1 are a proposal for the decision already held on `halloween-2026-review`; question 4 (soundtrack start) should join that hold. No new held task was created.

## 6. Scratch changes

All under the worktree's `sim/`. Pristine copy committed first, so the diff below is exactly the change.

- `sim/engine.py`, `sim/config.py`, `sim/test_engine.py`: the rules R1 to R7 and the finale jitter; two tests updated (relay refusals; the questions count 10 to 8). `python3 -m unittest test_engine`: 17 tests, OK.
- `sim/drive.py`: new, the replay driver with `sync`, `all`, `grind`, `grind_all`, `autosplit`, per-player queues (`q`, `run`).
- `sim/transcripts/run1_group.*`, `run2_split.*`, `run2b_split_nohint.*`, `run3_rage_win.*`, `run4_rage_loss.*`: moves and full transcripts; `*_finale_excerpt.txt`: the finale lines quoted above; `scratch.diff`: the diff below.

Commands to reproduce in a copy of the engine with the diff applied:

```
python3 drive.py transcripts/run1_group.moves out.txt --seed 1 --variant rage
python3 drive.py transcripts/run2_split.moves out.txt --seed 2 --variant rage --set GROUP_MOVES_TOGETHER=False
python3 drive.py transcripts/run2b_split_nohint.moves out.txt --seed 2 --variant rage --set GROUP_MOVES_TOGETHER=False
python3 drive.py transcripts/run3_rage_win.moves out.txt --seed 1 --variant rage --finale rage
python3 drive.py transcripts/run4_rage_loss.moves out.txt --seed 5 --variant rage --finale rage --set "STEP_TIME_JITTER=(1.2,1.6)"
python3 sim.py bot --variant rage --finale rage --quiet     # the bot does not know `show`, so it stops at the first refused relay
```

### Diff against the pristine engine

```diff
diff --git a/sim/config.py b/sim/config.py
index 82358cf..e56dca5 100644
--- a/sim/config.py
+++ b/sim/config.py
@@ -37,3 +37,6 @@ CURSE_APPLY_SECONDS = 15         # the called player putting on their own gloves
 INVOCATION_ORDER = ("deliverance", "waitstill", "mindwell", "remember")  # the handoff gives no order; this is the table order of handoff section 2
 FIRE_TIMER_SECONDS = 600         # handoff 10: "a fixed soundtrack of perhaps ~10 minutes"
 FIRE_TIMER_STARTS = "turn"       # "turn": the soundtrack starts at the fourth relic, before the curses (handoff 9 order: fire audio is step 3, curses step 6); "after_curses": starts once all four are cursed
+# --- rage finale (scratch additions for the hw-play-rage playtest; each is a proposal, see report) ---
+SHOW_SECONDS = 25                # one player pointing, miming or writing a word for one other player to see: slower than saying it (RELAY_SECONDS)
+RAGE_STAGES = ((450, "She names him."), (300, "She pronounces his sentence."), (150, "The fire turns toward him."))  # (seconds of fire left, the mother's act advancing): spoken by her, and visible as the light shifts, so the muffled player sees it too
diff --git a/sim/engine.py b/sim/engine.py
index 9b55e79..051f68d 100644
--- a/sim/engine.py
+++ b/sim/engine.py
@@ -34,8 +34,9 @@ VARIANTS = {
         missing="What player action prevents the resurrection ritual, and how is the ritual's progress shown to the players? (handoff 13, resurrection)",
     ),
     "rage": dict(
-        objective="Uncover and prove the full truth about the husband before she completes her destructive act.",
-        loss="she completed her destructive act; the handoff does not say what the act is",
+        objective="She means to put him in the fire. Before it reaches him, you must find in the four relics why he did what he did, and one of you must say it to her. You will know it worked when the screaming stops. Start with the relics on the table.",
+        loss="the fire reached him: his voice joined the children's screams, then silence and darkness; the medium closed the circle with six spirits unresolved",
+        win_step="testimony",  # PROPOSAL: the players win when one of them speaks his reason to her before the fire reaches him
         missing="Where in the house is the husband's true motive found, and what physical act proves it to her? No spoke reveal contains it: spokes reveal each child's role and fate (handoff 5). (handoff 13, rage)",
     ),
     "loop": dict(
@@ -61,6 +62,14 @@ FINALE_PRESETS = {
         ("lookout", "eyes", "eyes", "waitstill", None, 60, "handoff 10 Waitstill: blind player has the knowledge, others are the eyes"),
         ("testimony", "voice", "eyes", "remember", None, 60, "handoff 10 Remember: a final message must be voiced despite the silence curse"),
     ],
+    # PROPOSAL (hw-play-rage): the four parts of the husband's reason, one per relic on the table, in any order and
+    # at the same time; then the proof spoken to her. The eighth field lists what must be done before a step can start.
+    "rage": [
+        ("courier", "hands", "eyes", "deliverance", None, 60, "Deliverance's relic: the gloved player knows how it opens; another pair of hands opens it", ()),
+        ("lookout", "eyes", "eyes", "waitstill", None, 60, "Waitstill's relic: the blind player knows what the lookout saw; another pair of eyes finds it", ()),
+        ("overheard", "hands", "ears", None, "mindwell", 60, "Mindwell's relic: what was overheard is in the soundscape; others hear it and show the muffled player, who works it", ()),
+        ("testimony", "voice", "any", "remember", None, 30, "Remember's relic: the silenced player holds the form of the proof; someone else must speak it to her, once the three parts are assembled", ("courier", "lookout", "overheard")),
+    ],
 }
 
 
@@ -87,9 +96,10 @@ class Player:
 
 
 class Step:
-    def __init__(self, sid, room, needs, clue, seconds, holder=None, by=None, src=""):
+    def __init__(self, sid, room, needs, clue, seconds, holder=None, by=None, src="", requires=()):
         self.id, self.room, self.needs, self.clue = sid, room, frozenset(needs), clue
         self.base, self.holder, self.by, self.src = seconds, holder, by, src
+        self.requires = frozenset(requires)  # steps that must be done before this one can be worked
         self.remaining = seconds
         self.worked = 0
         self.hinted_at = 0  # effort at the last hint: the medium waits HINT_AFTER_SECONDS again before the next
@@ -124,8 +134,10 @@ class Game:
                 s.remaining = s.base * self.rng.uniform(*C.STEP_TIME_JITTER)
                 self.steps[s.id] = s
         for row in FINALE_PRESETS[finale]:
-            sid, needs, clue, holder, by, secs, src = row
-            self.steps[sid] = Step(sid, HUB, {needs}, clue, secs, holder, by, src)
+            sid, needs, clue, holder, by, secs, src = row[:7]
+            self.steps[sid] = Step(sid, HUB, {needs}, clue, secs, holder, by, src, row[7] if len(row) > 7 else ())
+            self.steps[sid].remaining = secs * self.rng.uniform(*C.STEP_TIME_JITTER)  # a finale piece is as uncertain as a spoke step
+        self.stages_fired = set()
         self.finale_steps = [r[0] for r in FINALE_PRESETS[finale]]
         for p in self.players.values():
             p.t = C.SEANCE_OPENING_SECONDS
@@ -164,6 +176,16 @@ class Game:
         steps = self.active_steps(room)
         return steps[0] if steps else None  # steps within a room are sequential
 
+    def pick_step(self, p, to):
+        """Which step an action means. In a child's room the steps are sequential; at the table in the
+        finale the pieces lie side by side and `to` names one (default: the first still open)."""
+        if to and p.room == HUB and self.phase == "finale":
+            s = self.steps.get(to)
+            if not s or s.room != HUB or s.done:
+                raise Illegal("no open finale step named %r; open: %s" % (to, ", ".join(x.id for x in self.active_steps(HUB))))
+            return s
+        return self.current_step(p.room)
+
     def perceives(self, p, ev):
         if ev["who"] == p.id and ev["kind"] != "spoken":
             return True
@@ -194,12 +216,14 @@ class Game:
         out = ["room: %s" % p.room, "others here: %s" % (", ".join(here) or "nobody")]
         if p.room == HUB:
             out.append("relics on the table: %s" % (", ".join(self.relics) or "none"))
-        s = self.current_step(p.room)
-        if s:
-            out.append("current step: %s (needs %s; clue is %s%s)" % (s.id, "+".join(sorted(s.needs)), s.clue,
-                       "; only %s has it" % s.holder if s.holder else ""))
-        elif p.room != HUB:
-            out.append("this room is finished")
+        steps = self.active_steps(p.room) if (p.room == HUB and self.phase == "finale") else [self.current_step(p.room)]
+        for s in steps:
+            if s:
+                out.append("%s: %s (needs %s; clue is %s%s%s%s)" % ("open" if p.room == HUB else "current step", s.id, "+".join(sorted(s.needs)), s.clue,
+                           "; only %s has it" % s.holder if s.holder else "", "; %s must work it" % s.by if s.by else "",
+                           "; after %s" % "+".join(sorted(s.requires)) if s.requires else ""))
+            elif p.room != HUB:
+                out.append("this room is finished")
         return out
 
     def legal(self, p):
@@ -210,14 +234,18 @@ class Game:
         can = ["wait"]
         if "eyes" in p.faculties:
             can += ["go %s" % r for r in ROOMS if r != p.room]
-        s = self.current_step(p.room)
-        if s:
-            can += ["examine", "work"]
-            if s.worked - s.hinted_at >= C.HINT_AFTER_SECONDS:
-                can.append("hint")
+        finale_table = p.room == HUB and self.phase == "finale"
+        for s in (self.active_steps(HUB) if finale_table else [self.current_step(p.room)]):
+            if s and not (s.requires - {x for x in self.steps if self.steps[x].done}):
+                sfx = " " + s.id if finale_table else ""
+                can += ["examine" + sfx, "work" + sfx]
+                if s.worked - s.hinted_at >= C.HINT_AFTER_SECONDS:
+                    can.append("hint" + sfx)
         others = [q for q in self.present(p.room) if q is not p]
         if others and "voice" in p.faculties:
             can += ["relay %s" % q.id for q in others] + ["confer"]
+        if others and "hands" in p.faculties:
+            can += ["show %s" % q.id for q in others if "eyes" in q.faculties]
         if p.relic and p.room == HUB:
             can.append("place")
         return can
@@ -236,12 +264,23 @@ class Game:
             return False
         for p in players:
             p.t = end
+        if self.deadline is not None and self.variant_name == "rage":
+            for left, text in C.RAGE_STAGES:
+                at = self.deadline - left
+                if start < at <= end and left not in self.stages_fired:
+                    self.stages_fired.add(left)
+                    self.say("mother", HUB, "%s (%s of fire left)" % (text, fmt(left)))
+                    self.emit("sight", HUB, "The light shifts: the fire has moved toward him. (%s of fire left)" % fmt(left), None, "eyes", t=at)
         return True
 
     def lose(self, why):
         self.over = dict(result="lost", t=self.now(), why="You lost because " + why + ".")
         self.stages.append(("end", self.now()))
 
+    def win(self, why):
+        self.over = dict(result="won", t=self.now(), why="You won because " + why + ". The screaming stops; the fire light steadies; she answers him.")
+        self.stages.append(("end", self.now()))
+
     # ---- actions ------------------------------------------------------------------------------------
     def act(self, pid, action):
         """action: dict with 'action' and optional 'to'. Returns a result dict; never raises."""
@@ -305,8 +344,8 @@ class Game:
     def players_relic_outstanding(self, child):
         return not self.steps["%s_%d" % (child, C.SPOKE_STEP_COUNT)].done
 
-    def do_examine(self, p, _):
-        s = self.current_step(p.room)
+    def do_examine(self, p, to):
+        s = self.pick_step(p, to)
         if not s:
             raise Illegal("nothing to examine here")
         if s.holder:
@@ -321,15 +360,20 @@ class Game:
         p.knows.add(s.id)
         self.note("You take in the clue for %s." % s.id, p.id)
 
-    def do_work(self, p, _):
-        s = self.current_step(p.room)
+    def do_work(self, p, to):
+        s = self.pick_step(p, to)
         if not s:
             raise Illegal("nothing to work on here")
+        missing = [x for x in s.requires if not self.steps[x].done]
+        if missing:
+            raise Illegal("%s cannot start until %s is done (%s)" % (s.id, "+".join(missing), s.src))
         if s.by and p.id != s.by:
             raise Illegal("%s must be worked by %s (%s)" % (s.id, s.by, s.src))
         knowers = [q for q in self.present(p.room) if s.id in q.knows]
         if not knowers:
             raise Illegal("nobody here knows what %s asks for; examine it or get it relayed" % s.id)
+        if s.by and p not in knowers:
+            raise Illegal("%s must know what %s asks for before working it; have it shown or told to you" % (p.id, s.id))
         crew, have = [], set()
         for q in sorted(knowers, key=lambda q: (q is not p, q.t)):
             if s.needs - have:
@@ -353,6 +397,12 @@ class Game:
         self.emit("sight", p.room, "%s is solved." % s.id, None, "eyes")
         if s.id in self.finale_steps:
             self.finale_log.append((s.id, p.t, {q.id: q.curse for q in self.players.values()}))
+            if s.id == self.variant.get("win_step"):
+                self.win("%s spoke his reason to her at %s, with %s of the fire left" % (p.id, fmt(p.t), fmt(self.deadline - p.t)))
+                return
+            # handoff 10: a success removes a layer of the soundscape; a visible change confirms it for whoever cannot hear
+            self.say("fire", HUB, "A layer of the soundscape falls silent: %s is done." % s.id)
+            self.emit("sight", HUB, "A candle on the table lights itself: %s is done." % s.id, None, "eyes")
             if not self.active_steps(HUB):
                 raise Undefined("The four floated props are complete at %s. Does that constitute victory under the %s variant? The handoff names no winning action (handoff 'Best next design session', question 3)." % (fmt(p.t), self.variant_name))
             return
@@ -368,8 +418,8 @@ class Game:
         self.emit("reveal", child, "Fate revealed: part of what happened to %s." % child, None, "eyes")
         self.note("%s takes %s." % (p.id, p.relic), p.id)
 
-    def do_hint(self, p, _):
-        s = self.current_step(p.room)
+    def do_hint(self, p, to):
+        s = self.pick_step(p, to)
         if not s:
             raise Illegal("nothing is stalled here")
         if s.worked - s.hinted_at < C.HINT_AFTER_SECONDS:
@@ -398,9 +448,9 @@ class Game:
         if not q or q.room != p.room or q is p:
             raise Illegal("%r is not another player in this room" % to)
         if "voice" not in p.faculties:
-            raise Undefined("How does the voice-cursed player pass on what only they know? (handoff 10 Remember; a silenced player cannot relay)")
+            raise Illegal("you are silenced; show them instead (rage rule R4 answers engine report question 7)")
         if "ears" not in q.faculties:
-            raise Undefined("How is information relayed to the hearing-cursed player? (handoff 10 Mindwell: 'relay information to the hearing-impaired player')")
+            raise Illegal("%s cannot hear you; show them instead (rage rule R4 answers engine report question 6)" % q.id)
         if not self.advance([p, q], C.RELAY_SECONDS):
             return
         self.say(p.id, p.room, "%s tells %s what they know." % (p.id, q.id))
@@ -408,6 +458,21 @@ class Game:
             if "ears" in r.faculties:
                 r.knows |= p.knows
 
+    def do_show(self, p, to):
+        """Non-verbal: point, mime or write a word. The shower needs hands, the one shown needs eyes.
+        Answers engine report questions 6 and 7 (the muffled player is shown; the silenced player shows)."""
+        q = self.players.get(to)
+        if not q or q.room != p.room or q is p:
+            raise Illegal("%r is not another player in this room" % to)
+        if "hands" not in p.faculties:
+            raise Illegal("you cannot point or write with gloved hands; say it instead")
+        if "eyes" not in q.faculties:
+            raise Illegal("%s cannot see what you show; tell them instead" % q.id)
+        if not self.advance([p, q], C.SHOW_SECONDS):
+            return
+        self.emit("sight", p.room, "%s shows %s what they know." % (p.id, q.id), None, "eyes")
+        q.knows |= p.knows
+
     def do_confer(self, p, _):
         here = self.present(p.room)
         if len(here) < 2:
diff --git a/sim/test_engine.py b/sim/test_engine.py
index 24ca7cc..23d402c 100644
--- a/sim/test_engine.py
+++ b/sim/test_engine.py
@@ -131,13 +131,20 @@ class Curses(Turn):
         self.assertIn("a spoken line", g.observe(g.players["deliverance"])["hears"])
         self.assertEqual(g.observe(g.players["waitstill"])["sees"], [])
 
-    def test_silenced_relay_and_relay_to_deaf_are_undefined(self):
+    def test_silenced_relay_and_relay_to_deaf_are_refused_show_works(self):
+        # rage scratch rule R4: relay is refused at no cost; `show` is the non-verbal channel
         g = self.cursed()
-        act(g, "remember", action="relay", to="deliverance")
-        self.assertIn("voice-cursed", g.over["why"])
-        g = self.cursed()
-        act(g, "deliverance", action="relay", to="mindwell")
-        self.assertIn("hearing-cursed", g.over["why"])
+        r = act(g, "remember", action="relay", to="deliverance")
+        self.assertFalse(r["ok"]); self.assertIn("show", r["error"]); self.assertIsNone(g.over)
+        r = act(g, "deliverance", action="relay", to="mindwell")
+        self.assertFalse(r["ok"]); self.assertIn("show", r["error"]); self.assertIsNone(g.over)
+        g.players["remember"].knows.add("secret")
+        r = act(g, "remember", action="show", to="mindwell")
+        self.assertTrue(r["ok"], r); self.assertIn("secret", g.players["mindwell"].knows)
+        r = act(g, "deliverance", action="show", to="mindwell")   # gloved: cannot point or write
+        self.assertFalse(r["ok"])
+        r = act(g, "mindwell", action="show", to="waitstill")     # blind: cannot be shown
+        self.assertFalse(r["ok"])
 
     def test_gloved_holder_relays_then_other_works_satchel(self):
         g = self.cursed()
@@ -162,7 +169,7 @@ class Cli(Base):
         names = [n for n, _, _ in sim.config_lines()]
         self.assertIn("FIRE_TIMER_SECONDS", names)
         self.assertEqual(len(names), len([k for k in vars(C) if k.isupper()]))
-        self.assertGreaterEqual(len(sim.questions()), 10)
+        self.assertGreaterEqual(len(sim.questions()), 8)  # rage scratch: questions 6 and 7 are answered by `show`
 
     def test_split_strategy_hits_medium_location_question(self):
         self.saved.update(fixed(GROUP_MOVES_TOGETHER=False, HINT_AFTER_SECONDS=0))
```
