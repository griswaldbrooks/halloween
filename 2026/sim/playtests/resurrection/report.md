# Halloween 2026: playing the simulation, and a resurrection finale that runs

Task `hw-play-resurrection`, 2026-10-08. Scout report; nothing in the halloween repo, the storyboard, the notes or the engine folder was changed. All work was done on a copy of `data/hw-sim-engine/` inside a disposable worktree (`sim/`). This report is the only survivor: it carries the rule diff (section 6), the driver (appendix B) and the transcripts (appendix C).

What I did: played the investigation by hand three times through `sim.py protocol` (one group run, two split runs), driving all four players from what each could see and hear; then added the rules for the resurrection direction to the scratch engine, played the finale by hand to one win and two losses with all four curses on, and checked the scripted bot on ten seeds.

Short version: the investigation as written runs 21 minutes before the turn and 23:42 before anyone can act, with three of four players idle in most rooms and hints that cost as much time as they save. The resurrection finale can be made playable with four rules, no new story and no new communication channel; it gives a legible, staged failure and keeps the blind player seated. Its weak points are a 15-second margin on the first child when the soundtrack starts at the fourth relic, the Remember player having nothing of their own, and "the bearer knows the way" being asserted by the engine rather than earned in a spoke.

## 1. The three sentences and the medium's line (PROPOSAL)

PROPOSAL, not design. Written for handoff section 13's resurrection direction and the "Best next design session" page; the captain owns all three.

- **She now intends to** put each of her four dead children into the living guest who carries that child's mark, one child at a time, in the order she called them.
- **If the players fail,** the fire ends with the mother calling her children's names and the guests answering from where they sit: each guest she took goes still, their mark goes dark, and their child's scream in the fire has become a voice answering her; the medium ends the seance to release the guests. With fewer than four taken, the ending names which children she has and which are safe.
- **The players win when they** cut each child's hold on its bearer before that child's scream reaches them: the bearer, who has lost the faculty, tells the way, and another guest who still has that faculty does the act; the fourth cut, before the fourth scream, ends the ritual.

The medium's one-sentence objective, in character, on the immersive report's template (danger, action, deadline, confirmation, first move):

> "She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first."

That is three sentences, not one; the one-sentence form is "Cut each child's hold on its bearer before their scream reaches them; the bearer tells, the rest of you do." The longer form is what the engine speaks at the end of the curses (`VARIANTS["resurrection"]["objective"]`).

## 2. Part 1: the investigation as written

Three runs, default jitter, no engine changes. Clocks are the acting player's clock after the action; `-> player` lines are what another player heard or noticed. Full transcripts in appendix C.

| run | settings | reached the turn | run ended | ended on |
|---|---|---|---|---|
| group 1 | seed 1, group moves together | 21:12 (fourth relic) | 23:42 | question 9 (resurrection: what do the players do) |
| split A | seed 2, `GROUP_MOVES_TOGETHER=False` | never | 3:40 | question 1 (where is the medium when the group is split) |
| split B | seed 2, split, nobody asks for a hint | 7:06 | 9:36 | question 9 |

Group run 1 by stage (hand-played; the engine report's bot on seed 0 gives the same shape):

| stage | start | length | hints | who did anything (accepted actions) |
|---|---|---|---|---|
| opening | 0:00 | 2:00 | | scripted |
| Deliverance room | 2:00 | 3:58 | 1 | deliverance 12, waitstill 6, mindwell 2, remember 2 |
| table | 5:58 | 0:30 | | deliverance places |
| Waitstill room | 6:28 | 3:52 | 1 | waitstill 12, the other three 0 |
| table | 10:20 | 0:30 | | |
| Mindwell room | 10:50 | 5:00 | 2 | mindwell 16, remember 11 (two confers), the other two 0 |
| table | 15:50 | 0:30 | | |
| Remember room | 16:20 | 4:20 | 2 | remember 14, deliverance 2 |
| table, fourth relic | 20:40 | 0:30 | | turn at 21:12 |
| turn: truth, fire, four curses | 21:12 | 2:30 | | everyone, in order |
| first free action | 23:42 | | | soundtrack has 7:30 left |

### Opening: nobody knows which door

At 2:00 the mother has asked "find my children" and the players stand at the table with four doors and no reason to pick one. The engine lists all four; the fiction gives nothing. We took table order because Deliverance was named first.

```
NEXT deliverance @2:00 in seance
  sees: relics on the table: none
  can: wait, go deliverance, go waitstill, go mindwell, go remember, relay ..., confer
```

The same gap repeats at every return: the only reason to come back to the table is `place`, and the only reason to pick the next door is the order the children were named in. The engine forbids walking spoke to spoke (`SPOKE_TO_SPOKE_DIRECT=False`), so each return costs 0:30 the fiction never motivates.

### Deliverance room: two work, two watch; the hint arrives when the step is nearly done

All four read the clue (realistic: everyone leans in). Then the step needs hands and everyone has hands, so one or two players work and the rest stand there. Step 1 fell in 49 s with no hint. Step 2 ran long; at 1:00 of effort the engine offered the hint and the bored pair said "ask her":

```
 21 4:49 deliverance work              | deliverance_2: no result yet (1:00 of effort so far).
 23 5:04 deliverance hint              | Hint for deliverance_2.
 24 5:48 deliverance work              | deliverance_2 is solved.; Role revealed: ...; deliverance takes deliverance_relic.
```

The hint cost 15 s and the step fell in the next 15 s chunk: the remaining effort before the hint was under 30 s. The hint saved at most 15 s. With `HINT_AFTER_SECONDS` equal to the base step time, the hint is offered exactly when an average step is about to fall, so it only pays on the slow tail of the jitter. The same thing in the Waitstill room:

```
 38 8:23 waitstill   hint              | Hint for waitstill_1.
 39 8:34 waitstill   work              | waitstill_1 is solved.
```

Eleven seconds after a fifteen-second hint. In the Mindwell and Remember rooms the hints did pay (32 s and 43 s of work after the hint on the second steps, against a step that would otherwise have run to 1:30 or more). Six hints in the run; two were worth it.

### Waitstill room: three players have nothing to do for 3:52

Only the Waitstill player read and worked; the engine gives the other three no verb that matters. Their transcript for the whole room is "arrive", then "waitstill_1 is solved", then "waitstill_2 is solved ... Role revealed", then "arrive in seance". The immersive report's spectator-time warning is exact: four people travelling together is not four people playing.

### Mindwell room: the heard clue adds a telling step, and it is the longest room

The clue is audible. One player listened and told the others (`confer`, 20 s) rather than four people pressing an ear to the same thing. Two steps, two confers, two hints: 5:00, the longest room. Nothing in the fiction says why the listener must share before anyone can act; the engine requires a knower on the step, which is right, but the cost shows.

### The turn: 2:30 of the soundtrack is gone before anyone can act, and the deaf player never hears the objective

```
116 21:57 remember    place    | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; ...
117 22:27 deliverance curse    | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; ...
118 22:57 waitstill   curse    | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
119 23:27 mindwell    curse    | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
120 23:42 remember    curse    | <the objective>; remember is now silenced.; You apply your curse: you are silenced.
      -> mindwell    remember is now silenced.; Objective: <engine bookkeeping only>
```

Three things to read off that. The soundtrack started at 21:12 and the first free action is at 23:42: the ten minutes are 7:30 of play. The blindfolded Waitstill player at 22:57 does not see "waitstill is now blindfolded" or "The medium turns to remember"; from then on everything visual is gone for them and only sound arrives. The muffled Mindwell player at 23:42 does not hear the mother's objective; the `Objective:` line in their observation is the engine's bookkeeping note, not something the fiction delivered. In the room, Mindwell would be standing in fog with no idea what the task is.

### Which rule ended it

Group run 1 ended at 23:42 on question 9: the handoff gives the players nothing to do. That is the question Part 2 answers.

### Split runs: a 20-minute game, but no hints, no shared reveals, and a near miss at the turn

Split A: each player took their own child's room ("I'm bound to Waitstill, I'll take Waitstill's door"); the first to stall asked for the medium at 3:40 and the run ended on question 1, because one medium cannot be in two rooms.

Split B: same seed, nobody asks (the medium is not in your room). All four rooms ran in parallel; relics were taken between 5:46 and 6:36; the turn fired at 7:06 and the curses ended at 9:36. With the full soundtrack that is a 19:36 run: the only configuration I found that lands under 20 minutes. It costs three things. No hints at all. No shared reveals: each player saw only their own child's role and fate, so the "all four died" conclusion at the table is asserted by the turn text, not assembled by the group. And the turn nearly fired with a player away: Waitstill, done first, placed her relic and went to help Mindwell, found the room empty (Mindwell had left at 6:21), and walked back arriving at 6:56, ten seconds before Deliverance placed the fourth relic:

```
 69 6:16 waitstill   place             | waitstill places waitstill_relic on the table.
 70 6:36 waitstill   go mindwell       | waitstill arrives in mindwell.
 73 6:41 mindwell    go seance         | mindwell arrives in seance.
 74 6:56 waitstill   go seance         | waitstill arrives in seance.
 77 7:51 deliverance place             | The mother understands. She breaks.; ... The fourth relic lands.
```

Had she been twenty seconds slower the run would have ended on question 2 (can the turn fire with a player away). Helping is the natural thing for an early finisher to do and the design has no rule for it.

### Engine quirks seen while playing (for the engine owner, not design findings)

- `work` by a player who does not know the step succeeds if another knower in the room covers the faculty; the acting player's clock does not move and the knower's does (`do_work` builds the crew from knowers, not from the actor). In the win run Mindwell "worked" the Mindwell severing at 27:22 while it was Deliverance's ears that did it. Harmless, but transcripts read oddly.
- A refused action costs nothing, so a gloved player fumbling at a lock costs no time; in a room it would.
- With `wait` the fourth idle player burns `WAIT_SECONDS` even when a refused action was the only thing between them, which put 10 to 25 s of slack into my finale transcripts (see 25:07 in the win run).

## 3. Rules added to the scratch engine

Each rule names the engine report question it answers (section 3 numbering; H1 to H3 are the handoff's three) and who owns it. Everything is in `sim/engine.py` and `sim/config.py`; the diff is in section 6. No new story content beyond handoff sections 7 to 10, no codes, no puzzle content.

| # | rule | answers | owner |
|---|---|---|---|
| R1 | **Her progress.** The ritual takes the children one at a time in the invocation order. Child k is taken at `RITUAL_TAKE_AT[k]` seconds after the fire starts (default 4:00, 6:00, 8:00, 10:00). `RITUAL_WARN_SECONDS` (30) before each, the fire signals it on both channels: the child's scream grows close (heard) and the mark on the bearer brightens (seen). The table shows who is safe, who is taken and who she is calling (`sight()`). | Q9 second half, H2 | the shape is a designer choice; the direction and the moments are captain calls |
| R2 | **The players' action.** One severing per child, at the table, in the order she calls them. It needs the child's faculty. The bearer holds the knowledge from the moment the finale begins and has lost the faculty, so they must tell and another must do. Remember's is the exception: what must be said is there to be read (eyes), and any other voice says it. 60 s base effort (`SEVER_STEP_SECONDS`), no jitter. | Q9 first half, H3, Q8 | designer choice |
| R3 | **What each cursed player contributes.** Deliverance tells. Waitstill tells, and can do hands work by feel. Mindwell tells, and can read and speak Remember's. Remember does hands and eyes work for the others. No non-verbal channel is added: nobody ever needs to relay to Mindwell (the objective and the progress reach them by sight under R1) and Remember never needs to relay. | Q6, Q7, for this direction only | designer choice |
| R4 | **Failure.** A child not severed by its moment is taken: the scream becomes a voice answering from the bearer, the mark goes dark, the step is gone. The bearer keeps playing. The run ends at the fourth severing (won) or when nothing is left to cut (lost, with the count and names), or at the fourth taking (lost). Partial outcomes are reported as lost with the tier stated. | Q5, H2 | what it looks like in the room is a captain call; whether a taken guest leaves play is ledger question 9, a captain call, not modelled; whether 3 of 4 is a win tier is a captain call |
| R5 | **Timer start.** Unchanged (`FIRE_TIMER_STARTS="turn"`, the handoff section 9 order). The sensitivity run in section 4 shows what `after_curses` changes. | Q4 | captain call |
| R6 | **Medium's line.** The objective text in section 1 replaces the one-line summary. Spoken at the end of the curses, so Mindwell misses it (R1 is what they get instead). | | designer choice |

Hints in the finale are unchanged and never triggered: the stall rule is 60 s and the severings are 60 s.

## 4. Win and loss, with all four curses on

Both continue group run 1's investigation (seed 1, same six hints), so the finale starts at 23:42 with the fire at 21:12 and the takings due at 25:12, 27:12, 29:12 and 31:12.

### Win (`transcripts/win.txt`, from the fourth curse)

Deliverance, gloved, heard "she calls Deliverance first" and tells Remember, who still has hands. Waitstill, blind, tells Remember, who still has eyes. Mindwell, muffled, saw the mark on Waitstill go out and the table say "she is calling mindwell", and tells Deliverance, who can hear. For Remember's, Mindwell reads and says it.

```
121 23:57 deliverance relay remember    | deliverance tells remember what they know.
      -> waitstill   deliverance tells remember what they know.
      -> deliverance Deliverance's scream grows close.; The mark on deliverance brightens.
      -> waitstill   Deliverance's scream grows close.
      -> mindwell    The mark on deliverance brightens.
125 24:57 remember    work              | Deliverance's scream leaves the fire.; sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
      -> waitstill   Deliverance's scream leaves the fire.
      -> mindwell    sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
132 25:22 waitstill   relay remember    | waitstill tells remember what they know.
137 26:22 deliverance work              | Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
133 25:22 mindwell    relay deliverance
143 27:22 mindwell    work              | sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
      -> waitstill   Mindwell's scream leaves the fire.
145 27:42 mindwell    examine           | You take in the clue for sever_remember.
149 28:42 mindwell    work              | sever_remember is solved.; The mark on remember goes out. Remember is safe.
== WON == You won because you cut all four children's hold before the fire took any of them, at 28:42 with 2:30 of the soundtrack left.
```

Read the `->` lines: the blind player gets every beat by ear, the deaf player gets every beat by eye, and neither needed a relay. The first severing landed at 24:57 against a taking at 25:12: fifteen seconds.

### Loss (`transcripts/loss.txt`): the group hesitates once

Deliverance tries the thing gloved (refused), everyone confers (20 s), then Deliverance tells Waitstill, who works it by feel. Sixty seconds of work from 24:17 ends at 25:17; the taking was at 25:12.

```
121 23:42 deliverance work             !! nobody here who knows sever_deliverance can supply hands
122 24:02 deliverance confer            | The players confer.
123 24:17 deliverance relay waitstill   | deliverance tells waitstill what they know.
127 25:17 waitstill   work              | Deliverance's scream stops. A voice answers her from deliverance.; Too late: deliverance was taken while you worked.
130 25:47 waitstill   relay remember    | waitstill tells remember what they know.
133 26:32 remember    work              | Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
139 27:47 deliverance work              | Mindwell's scream leaves the fire.; sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
145 29:07 mindwell    work              | sever_remember is solved.; The mark on remember goes out. Remember is safe.
== LOST == You lost because nothing was left to cut at 29:07: the ritual completed on 1 of her four children (deliverance answer to their children's names; waitstill, mindwell, remember safe); the medium ends the seance to release the guests.
```

One confer was the whole difference between the win and this. Three of four safe is reported as a loss under R4; whether it should be a tier is a captain call.

### Loss (`transcripts/frozen.txt`): nobody moves

```
121 24:42 remember    wait              | Deliverance's scream grows close.; The mark on deliverance brightens.
122 25:12 remember    wait              | Deliverance's scream stops. A voice answers her from deliverance.; deliverance goes still; the mark on them is dark. Deliverance is taken.
124 27:12 remember    wait              | Waitstill's scream stops. A voice answers her from waitstill.; waitstill goes still; ...
126 29:12 remember    wait              | Mindwell's scream stops. ...
128 31:12 remember    wait              | Remember's scream stops. A voice answers her from remember.; remember goes still; the mark on them is dark. Remember is taken.
== LOST == You lost because the ritual took all four children before the fire ended, and the ritual completed on 4 of her four children ...
```

Four beats, two minutes apart, each with a sound and a sight, then the end. That is the staged failure the escape report asks for.

### Sensitivity: the same hesitant play with the soundtrack starting after the curses

`--set FIRE_TIMER_STARTS='"after_curses"'` on the loss actions: every severing lands in time and the run is won at 29:07 with 4:35 left. The one constant decides whether a twenty-second confer loses a child.

### Timing

| run | finale starts (4th curse) | severings or takings | ends | finale length | soundtrack left | total |
|---|---|---|---|---|---|---|
| win (hand) | 23:42 | 24:57, 26:22, 27:22, 28:42 | won 28:42 | 5:00 | 2:30 | 28:42 |
| loss, one hesitation (hand) | 23:42 | taken 25:12; 26:32, 27:47, 29:07 | lost 29:07 | 5:25 | 2:05 | 29:07 |
| loss, frozen (hand) | 23:42 | taken 25:12, 27:12, 29:12, 31:12 | lost 31:12 | 7:30 | 0:00 | 31:12 |
| same hesitation, timer after curses | 23:42 | 25:17, 26:32, 27:47, 29:07 | won 29:07 | 5:25 | 4:35 | 29:07 |
| bot, seeds 0 to 9 | 22:38 to 24:33 | | won 26:04 to 28:21 | 5:05 | 2:25 every seed | |

Margins on the first child, default timer: hand win 0:15, bot 0:15, hesitant group minus 0:05. Margins on the later children: about 0:50, 1:50 and 2:30. The pressure is all at the front.

Against the four checks the brief asked for:

- **One linear final act everyone watches (escape 4.3 item 2):** partly. The takings come in a fixed order, so the whole group is on one child at a time at one table and the fourth cut is the win. But it is four acts of the same shape, not one converging act. A closing act after the fourth cut would give the convergence; I did not add one because the win was reachable without it.
- **Failure legible and staged (4.3 item 5):** yes. Each taking is its own beat on both channels; the end states which children she has.
- **Each curse redistributed work (immersive curses table):** Deliverance, Waitstill and Mindwell yes: each tells what only they know and each still does something (Waitstill hands by feel, Mindwell reads and speaks for Remember). Remember only partly: they become the operator for others' tasks and have nothing of their own; if the group lets the gloved player direct everything, as the bot did (Deliverance did three of four severings), Remember watches.
- **Blind player at the table:** yes throughout. Waitstill never moved, heard every beat, took a hint channel that still works, and in the loss run did hands work by feel.

## 5. Verdict on the direction

It works as a game, with the rules above: the objective fits one breath, the deadline is in the fiction, success and failure are both legible and both reachable, and the four curses each change a route instead of removing a player. Three runs by hand and ten by the bot never hit an undefined rule.

What it needed: four rules (section 3), one of them a progress observable with a visual and an audible side, no new story and no non-verbal channel.

What it strains:

- **The first window.** Starting the soundtrack at the fourth relic leaves 1:30 after the last curse for the group to hear a three-sentence objective, decide, tell and do a 60 s task. Fifteen seconds of margin for a group that does everything right; a single confer loses a child. Either the timer starts after the curses, or the first taking is set at least two minutes after the last curse. Captain call (Q4).
- **"The bearer knows the way" is asserted, not earned.** The engine hands each bearer their knowledge when the finale begins. In the room, that knowledge has to come from somewhere, and the only place is that child's spoke. So the direction imposes a requirement on every spoke: it must plant, in the hands of the player bound to that child, the thing they will later have to tell. The handoff says the cursed player "may possess" it (section 10); this design needs "does possess". That also puts a floor under the split-run problem: each reveal must reach its bearer.
- **Why she can be resisted.** The immersive report names this as the direction's main burden. Nothing in my rules answers it; the medium's line simply says the bearers know the way. The fiction needs one sentence here, and it is the kind of sentence that changes what the severing physically is.
- **Remember.** The silent player's own severing is done entirely by others. They are useful as the operator, but nothing is theirs.
- **Tiers.** Three of four safe is "lost" in my rules. The research wants a tiered ending; the handoff wants one plain success sentence. Both cannot be had without deciding what three of four means at the party.
- **Run length.** 28:42 total. The finale is 5:00 to 5:30 of play after 2:30 of curses; everything over 20 minutes is in the investigation, and nothing in the finale fixes that.

What still has no answer: what a taken guest does for the rest of the finale (ledger question 9), what the severing physically is (prop content, deliberately out of scope), and whether the medium can see all four marks and the table from where she stands.

Three things that would most improve it:

1. Start the clock after the fourth curse, or move the first taking to two minutes after it. One constant; it turns a 15-second trap into the same 2-minute window the other children get.
2. Make each spoke plant its bearer's finale knowledge. The reveal a player carries back is what they will later tell with their faculty gone; the investigation then feeds the finale instead of running beside it.
3. Give Remember a stake: make Remember's severing need Remember's hands or eyes on the readable thing while another voice says it (a joint step, hands plus voice), so the silent player holds their own act instead of watching it.

## 6. Scratch changes, for the engine owner

Files in the worktree (`sim/`, discarded at teardown): `config.py` and `engine.py` changed as in the diff below; `drive.py` added (appendix B); `transcripts/*.actions|.txt|.jsonl` added (appendix C has the `.txt` forms). `test_engine.py` still passes (17 tests). `sim.py` is untouched; `--finale resurrection` appears automatically because it reads `FINALE_PRESETS`.

```diff
diff --git a/sim/config.py b/sim/config.py
index 82358cf..4fb5eb8 100644
--- a/sim/config.py
+++ b/sim/config.py
@@ -37,3 +37,7 @@ CURSE_APPLY_SECONDS = 15         # the called player putting on their own gloves
 INVOCATION_ORDER = ("deliverance", "waitstill", "mindwell", "remember")  # the handoff gives no order; this is the table order of handoff section 2
 FIRE_TIMER_SECONDS = 600         # handoff 10: "a fixed soundtrack of perhaps ~10 minutes"
 FIRE_TIMER_STARTS = "turn"       # "turn": the soundtrack starts at the fourth relic, before the curses (handoff 9 order: fire audio is step 3, curses step 6); "after_curses": starts once all four are cursed
+# --- resurrection finale (scratch, task hw-play-resurrection; PROPOSAL, not design) ----------
+RITUAL_TAKE_AT = (240, 360, 480, 600)  # seconds after the fire starts at which the ritual takes each child, in INVOCATION_ORDER: the curses end about 2:30 in, then four windows of about two minutes
+RITUAL_WARN_SECONDS = 30         # how long before a taking the scream (heard) and the bearer's mark (seen) signal it
+SEVER_STEP_SECONDS = 60          # base effort of cutting one child's hold: same guess as a spoke step
diff --git a/sim/engine.py b/sim/engine.py
index 9b55e79..f2ff323 100644
--- a/sim/engine.py
+++ b/sim/engine.py
@@ -29,7 +29,7 @@ class Illegal(Exception):
 # Finale variants, implemented exactly as far as handoff section 13 states them.
 VARIANTS = {
     "resurrection": dict(
-        objective="Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.",
+        objective="She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.",
         loss="the ritual completed; the handoff says the players are her vessels or sacrifices but not what that looks like",
         missing="What player action prevents the resurrection ritual, and how is the ritual's progress shown to the players? (handoff 13, resurrection)",
     ),
@@ -55,6 +55,12 @@ VARIANTS = {
 # (id, needs, clue modality, holder, performer, seconds, source).
 FINALE_PRESETS = {
     "none": [],
+    "resurrection": [  # PROPOSAL (hw-play-resurrection): cut each child's hold on its bearer before the ritual takes them
+        ("sever_deliverance", "hands", None, "deliverance", None, 60, "bearer is gloved and knows the way; another's hands cut the hold"),
+        ("sever_waitstill", "eyes", None, "waitstill", None, 60, "bearer is blind and knows the way; another's eyes cut the hold"),
+        ("sever_mindwell", "ears", None, "mindwell", None, 60, "bearer is muffled and knows the way; another's ears cut the hold"),
+        ("sever_remember", "voice", "eyes", None, None, 60, "bearer is silenced; what must be said is there to be read, and another voice says it"),
+    ],
     "floated": [
         ("satchel", "hands", "eyes", "deliverance", None, 60, "handoff 10 Deliverance: gloved player has the interpretation, another operates the lock"),
         ("whisper_box", "hands", "ears", None, "mindwell", 60, "handoff 10 Mindwell: others hear the whisper in the soundscape and relay it to the hearing-impaired player"),
@@ -95,6 +101,7 @@ class Step:
         self.hinted_at = 0  # effort at the last hint: the medium waits HINT_AFTER_SECONDS again before the next
         self.until = 0  # wall-clock moment up to which effort has already been credited
         self.done = False
+        self.taken = False  # resurrection finale: the ritual took this child before the players cut its hold
 
 
 class Game:
@@ -127,6 +134,12 @@ class Game:
             sid, needs, clue, holder, by, secs, src = row
             self.steps[sid] = Step(sid, HUB, {needs}, clue, secs, holder, by, src)
         self.finale_steps = [r[0] for r in FINALE_PRESETS[finale]]
+        self.ritual = finale == "resurrection"   # the mother's progress is modelled only for this direction
+        self.taken = []                           # children the ritual has taken, in order
+        self.warned = set()
+        if self.ritual:
+            for sid in self.finale_steps:
+                self.steps[sid].remaining = self.steps[sid].base = C.SEVER_STEP_SECONDS
         for p in self.players.values():
             p.t = C.SEANCE_OPENING_SECONDS
         self.say("medium", HUB, "The seance opens. Each of you is bound to one child and holds its object. If the spirit calls you, obey it.")
@@ -194,6 +207,10 @@ class Game:
         out = ["room: %s" % p.room, "others here: %s" % (", ".join(here) or "nobody")]
         if p.room == HUB:
             out.append("relics on the table: %s" % (", ".join(self.relics) or "none"))
+        if p.room == HUB and self.ritual and self.phase == "finale":
+            safe = [c for c in CHILDREN if self.steps["sever_" + c].done and not self.steps["sever_" + c].taken]
+            nxt = [c for c in C.INVOCATION_ORDER if not self.steps["sever_" + c].done]
+            out.append("marks: safe %s; taken %s; she is calling %s" % (", ".join(safe) or "none", ", ".join(self.taken) or "none", nxt[0] if nxt else "nobody"))
         s = self.current_step(p.room)
         if s:
             out.append("current step: %s (needs %s; clue is %s%s)" % (s.id, "+".join(sorted(s.needs)), s.clue,
@@ -231,12 +248,55 @@ class Game:
         if self.deadline is not None and end > self.deadline:
             for p in players:
                 p.t = self.deadline
-            self.lose("the fire soundtrack ran out at %s, %s after the turn, and %s" % (fmt(self.deadline), fmt(C.FIRE_TIMER_SECONDS), self.variant["loss"]))
-            self.undefined.append((self.deadline, "What physically and visibly happens to the players when the ten minutes run out? (handoff 'Best next design session', question 2)"))
+            self.ritual_tick()
+            if self.over:
+                return False
+            self.lose("the fire soundtrack ran out at %s, %s after the turn, and %s" % (fmt(self.deadline), fmt(C.FIRE_TIMER_SECONDS), self.loss_text()))
+            if not self.ritual:
+                self.undefined.append((self.deadline, "What physically and visibly happens to the players when the ten minutes run out? (handoff 'Best next design session', question 2)"))
             return False
         for p in players:
             p.t = end
-        return True
+        self.ritual_tick()
+        return not self.over
+
+    def loss_text(self):
+        if not self.ritual:
+            return self.variant["loss"]
+        safe = [c for c in CHILDREN if self.steps["sever_" + c].done and not self.steps["sever_" + c].taken]
+        return "the ritual completed on %d of her four children (%s answer to their children's names; %s safe); the medium ends the seance to release the guests" % (
+            len(self.taken), ", ".join(self.taken) or "nobody", ", ".join(safe) or "nobody")
+
+    def ritual_tick(self):
+        """The mother's progress: at each RITUAL_TAKE_AT moment the next un-severed child is taken.
+        Both channels carry every beat (a scream heard, a mark seen) so the muffled and the blind each get it."""
+        if not self.ritual or self.deadline is None or self.over:
+            return
+        start, now = self.deadline - C.FIRE_TIMER_SECONDS, self.now()
+        for k, child in enumerate(C.INVOCATION_ORDER):
+            s = self.steps["sever_" + child]
+            if s.done:
+                continue
+            t_take = start + C.RITUAL_TAKE_AT[k]
+            if now >= t_take - C.RITUAL_WARN_SECONDS and child not in self.warned:
+                self.warned.add(child)
+                self.say("fire", HUB, "%s's scream grows close." % child.capitalize())
+                self.emit("sight", HUB, "The mark on %s brightens." % child, None, "eyes", t=t_take - C.RITUAL_WARN_SECONDS)
+            if now >= t_take:
+                s.done = s.taken = True
+                self.taken.append(child)
+                self.say("fire", HUB, "%s's scream stops. A voice answers her from %s." % (child.capitalize(), child))
+                self.emit("sight", HUB, "%s goes still; the mark on them is dark. %s is taken." % (child, child.capitalize()), None, "eyes", t=t_take)
+                self.finale_log.append(("taken:" + child, t_take, {q.id: q.curse for q in self.players.values()}))
+                if len(self.taken) == 4:
+                    for p in self.players.values():
+                        p.t = max(p.t, t_take)
+                    self.lose("the ritual took all four children before the fire ended, and " + self.loss_text())
+                    return
+
+    def win(self, why):
+        self.over = dict(result="won", t=self.now(), why="You won because " + why + ".")
+        self.stages.append(("end", self.now()))
 
     def lose(self, why):
         self.over = dict(result="lost", t=self.now(), why="You lost because " + why + ".")
@@ -346,6 +406,9 @@ class Game:
         s.until = max(s.until, start + spent)
         s.worked += credit
         s.remaining -= credit
+        if s.taken:
+            self.note("Too late: %s was taken while you worked." % s.id.split("_")[1], p.id)
+            return
         if s.remaining > 1e-9:
             self.note("%s: no result yet (%s of effort so far)." % (s.id, fmt(s.worked)), p.id)
             return
@@ -353,6 +416,16 @@ class Game:
         self.emit("sight", p.room, "%s is solved." % s.id, None, "eyes")
         if s.id in self.finale_steps:
             self.finale_log.append((s.id, p.t, {q.id: q.curse for q in self.players.values()}))
+            if self.ritual:
+                child = s.id.split("_")[1]
+                self.say("fire", HUB, "%s's scream leaves the fire." % child.capitalize())
+                self.emit("sight", HUB, "The mark on %s goes out. %s is safe." % (child, child.capitalize()), None, "eyes")
+                if not self.active_steps(HUB):
+                    if self.taken:
+                        self.lose("nothing was left to cut at %s: %s" % (fmt(p.t), self.loss_text()))
+                    else:
+                        self.win("you cut all four children's hold before the fire took any of them, at %s with %s of the soundtrack left" % (fmt(p.t), fmt(self.deadline - p.t)))
+                return
             if not self.active_steps(HUB):
                 raise Undefined("The four floated props are complete at %s. Does that constitute victory under the %s variant? The handoff names no winning action (handoff 'Best next design session', question 3)." % (fmt(p.t), self.variant_name))
             return
@@ -500,4 +573,4 @@ class Game:
                 per.append((name, t1 - t0))
         return dict(result=self.over["result"] if self.over else "running", why=self.over["why"] if self.over else "",
                     total=end, stages=per, hints=self.hints, undefined=[(fmt(t), q) for t, q in self.undefined],
-                    finale=[(s, fmt(t), c) for s, t, c in self.finale_log])
+                    finale=[(s, fmt(t), c) for s, t, c in self.finale_log], taken=list(self.taken))
```

## Appendix A: how to reproduce

```
cp -r /media/griswald/wd-black-2tb/personal/firstmate/data/hw-sim-engine ./sim && cd sim
# apply the diff above, add drive.py (appendix B) and the .actions files (appendix C headers show the settings)
python3 -m unittest test_engine
python3 sim.py bot --finale resurrection --seed 1                      # scripted win, 5:05 finale
python3 drive.py transcripts/group1 -- --seed 1                        # part 1 group run
python3 drive.py transcripts/splitB -- --seed 2 --set GROUP_MOVES_TOGETHER=False
python3 drive.py transcripts/win  -- --seed 1 --finale resurrection
python3 drive.py transcripts/loss -- --seed 1 --finale resurrection
python3 drive.py transcripts/loss -- --seed 1 --finale resurrection --set FIRE_TIMER_STARTS='"after_curses"'
```

Completion gate: the captain calls this report raises (the direction's three sentences, the timer start, taken-guest removal, partial tiers) all gate the finale decision already held for the captain on task `halloween-2026-review`, whose hold reason names the handoff's three finale questions first. No new held task was minted; `fm-captain-hold.sh complete hw-play-resurrection halloween-2026-review` was run in the firstmate home (result recorded in the status file).

## Appendix B: `drive.py`

```python
#!/usr/bin/env python3
"""Replay driver for `sim.py protocol`.

<name>.actions: lines `player: action [to]`, grouped into phases separated by `---`.
Within a phase each player has a queue; the engine's clock decides who acts; a player
whose queue is empty waits (auto). When every queue in the phase is empty, the next phase
starts. A refused action is logged and dropped. Replays from the start each run (seeded).
Writes <name>.txt and <name>.jsonl; prints lines from --from onward and the next view.

  python3 drive.py transcripts/group1 [--from N] -- --seed 1 [--set K=V]
"""
import json, subprocess, sys, os

def fmt(t): return "%d:%02d" % divmod(int(t), 60)

def load(path):
    phases, cur = [], {}
    for line in open(path):
        line = line.split("#")[0].strip()
        if not line: continue
        if line.startswith("---"):
            phases.append(cur); cur = {}; continue
        who, _, rest = line.partition(":")
        w = rest.split()
        a = dict(player=who.strip(), action=w[0])
        if len(w) > 1: a["to"] = w[1]
        cur.setdefault(a["player"], []).append(a)
    phases.append(cur)
    return [p for p in phases if p]

def main():
    name = sys.argv[1]; start = 0; rest = sys.argv[2:]
    if rest and rest[0] == "--from": start = int(rest[1]); rest = rest[2:]
    if rest and rest[0] == "--": rest = rest[1:]
    phases = load(name + ".actions") if os.path.exists(name + ".actions") else []
    proc = subprocess.Popen([sys.executable, "sim.py", "protocol"] + rest, stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE, text=True, cwd=os.path.dirname(os.path.abspath(__file__)))
    last = json.loads(proc.stdout.readline())
    txt, raw = open(name + ".txt", "w"), open(name + ".jsonl", "w")
    raw.write(json.dumps(last) + "\n"); txt.write("# run: %s\n" % " ".join(rest))
    out, i = [], 0
    def log(l, i):
        txt.write(l + "\n")
        if i >= start: out.append(l)
    for pi, phase in enumerate(phases):
        log("--- phase %d" % pi, i)
        while any(phase.values()) and "over" not in last:
            nxt = last["next"]
            q = phase.get(nxt, [])
            if q:
                a = q.pop(0)
            elif last["obs"][nxt]["can"] == ["curse"]:
                log("(stop: %s is called and has no queued action)" % nxt, i); phase.clear(); break
            else:
                a = dict(player=nxt, action="wait")
            proc.stdin.write(json.dumps(a) + "\n"); proc.stdin.flush()
            line = proc.stdout.readline()
            if not line: log("(engine closed)", i); break
            r = json.loads(line); raw.write(line); last = r
            o = r["obs"][a["player"]]
            what = a["action"] + (" " + a["to"] if "to" in a else "")
            tail = "; ".join(o["hears"] + o["notices"])
            if a["action"] == "wait" and r["ok"] and not tail:
                continue
            s = "%3d %s %-11s %-16s %s" % (i, o["clock"], a["player"], what, ("!! " + r["error"]) if not r["ok"] else "")
            if tail: s += " | " + tail
            log(s, i)
            for pid, ob in r["obs"].items():
                if pid == a["player"]: continue
                t = "; ".join(ob["hears"] + ob["notices"])
                if t: log("      -> %-11s %s" % (pid, t), i)
            if "over" in r:
                log("== %s == %s" % (r["over"]["result"].upper(), r["over"]["why"]), i)
                sm = r["summary"]
                log("total %s; stages: %s; hints %d" % (fmt(sm["total"]), ", ".join("%s %s" % (n, fmt(t)) for n, t in sm["stages"]), sm["hints"]), i)
                for st, t, c in sm["finale"]:
                    log("  finale %-16s %s %s" % (st, t, " ".join("%s=%s" % (k, v or "-") for k, v in c.items())), i)
            i += 1
        if "over" in last: break
    proc.stdin.close()
    print("\n".join(out))
    if "over" not in last:
        nxt = last["next"]; o = last["obs"][nxt]
        print("\nNEXT %s @%s in %s%s%s" % (nxt, o["clock"], o["room"], " fire %s" % fmt(o["fire_remaining"]) if "fire_remaining" in o else "", " [%s]" % o["curse"] if o["curse"] else ""))
        for l in o["sees"]: print("  sees: " + l)
        print("  knows: %s holding: %s" % (",".join(o["knows"]) or "-", o["holding"] or "-"))
        print("  can: " + ", ".join(o["can"]))
        print("  all: " + "; ".join("%s@%s %s%s%s" % (p, ob["clock"], ob["room"], " +" + ob["holding"] if ob["holding"] else "", " [" + ob["curse"] + "]" if ob["curse"] else "") for p, ob in last["obs"].items()))
    txt.close(); raw.close()
main()
```

## Appendix C: transcripts

Each `.actions` file lists what each player intended, in phases; the engine's clock decided the interleaving and idle players waited. Lines: action index, acting player's clock after the action, player, action, what that player heard or noticed; `->` lines are what others heard or noticed; `!!` lines are refused actions (no time cost). The four finale runs share group run 1's investigation (actions and transcript identical up to the fourth relic), so they are shown from the turn onward.

### group1.actions

```
# group run 1, seed 1, group moves together. Four players driven by hand.
# Table: nothing says which door. Deliverance was named first, so that door.
deliverance: go deliverance
---
# Deliverance room, step 1: everyone reads the clue; the Deliverance player works it; three watch.
deliverance: examine
waitstill: examine
mindwell: examine
remember: examine
---
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
---
# step 2: everyone reads; Deliverance and Waitstill both try; after a minute the bored pair say "ask her"
deliverance: examine
waitstill: examine
mindwell: examine
remember: examine
---
deliverance: work
waitstill: work
deliverance: work
waitstill: work
deliverance: work
waitstill: work
deliverance: work
waitstill: work
deliverance: hint
deliverance: work
waitstill: work
deliverance: work
waitstill: work
deliverance: work
waitstill: work
---
# back to the table; Deliverance places; nobody has said what door is next, Waitstill is next on the table
deliverance: go seance
---
deliverance: place
---
waitstill: go waitstill
---
# Waitstill room: only the Waitstill player bothers to read; the other three stand at the door
waitstill: examine
---
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: hint
waitstill: work
waitstill: work
waitstill: work
waitstill: work
---
waitstill: examine
---
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: hint
waitstill: work
waitstill: work
waitstill: work
waitstill: work
---
waitstill: go seance
---
waitstill: place
---
mindwell: go mindwell
---
# Mindwell room: the clue is something you hear. Mindwell listens, then tells the others (confer) instead of everyone listening
mindwell: examine
---
mindwell: confer
---
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: hint
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: work
remember: work
---
mindwell: examine
---
mindwell: confer
---
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: hint
mindwell: work
remember: work
mindwell: work
remember: work
mindwell: work
remember: work
---
mindwell: go seance
---
mindwell: place
---
remember: go remember
---
remember: examine
deliverance: examine
---
remember: work
remember: work
remember: work
remember: work
remember: hint
remember: work
remember: work
remember: work
remember: work
---
remember: examine
deliverance: examine
---
remember: work
remember: work
remember: work
remember: work
remember: hint
remember: work
remember: work
remember: work
remember: work
---
remember: go seance
---
remember: place
---
deliverance: curse
waitstill: curse
mindwell: curse
remember: curse
```

### group1.txt

```
# run: --seed 1
--- phase 0
  0 2:20 deliverance go deliverance    | deliverance, waitstill, mindwell, remember arrive in deliverance.
      -> waitstill   deliverance, waitstill, mindwell, remember arrive in deliverance.
      -> mindwell    deliverance, waitstill, mindwell, remember arrive in deliverance.
      -> remember    deliverance, waitstill, mindwell, remember arrive in deliverance.
--- phase 1
  1 2:40 deliverance examine           | You take in the clue for deliverance_1.
  2 2:40 waitstill   examine           | You take in the clue for deliverance_1.
  3 2:40 mindwell    examine           | You take in the clue for deliverance_1.
  4 2:40 remember    examine           | You take in the clue for deliverance_1.
--- phase 2
  5 2:55 deliverance work              | deliverance_1: no result yet (0:15 of effort so far).
  6 3:10 deliverance work              | deliverance_1: no result yet (0:30 of effort so far).
  7 3:25 deliverance work              | deliverance_1: no result yet (0:45 of effort so far).
  8 3:29 deliverance work              | deliverance_1 is solved.
      -> waitstill   deliverance_1 is solved.
      -> mindwell    deliverance_1 is solved.
      -> remember    deliverance_1 is solved.
  9 3:29 deliverance work             !! nobody here knows what deliverance_2 asks for; examine it or get it relayed
 10 3:29 deliverance work             !! nobody here knows what deliverance_2 asks for; examine it or get it relayed
--- phase 3
 11 3:49 deliverance examine           | You take in the clue for deliverance_2.
 12 3:49 waitstill   examine           | You take in the clue for deliverance_2.
 13 3:49 mindwell    examine           | You take in the clue for deliverance_2.
 14 3:49 remember    examine           | You take in the clue for deliverance_2.
--- phase 4
 15 4:04 deliverance work              | deliverance_2: no result yet (0:15 of effort so far).
 16 4:04 waitstill   work              | deliverance_2: no result yet (0:15 of effort so far).
 17 4:19 deliverance work              | deliverance_2: no result yet (0:30 of effort so far).
 18 4:19 waitstill   work              | deliverance_2: no result yet (0:30 of effort so far).
 19 4:34 deliverance work              | deliverance_2: no result yet (0:45 of effort so far).
 20 4:34 waitstill   work              | deliverance_2: no result yet (0:45 of effort so far).
 21 4:49 deliverance work              | deliverance_2: no result yet (1:00 of effort so far).
 22 4:49 waitstill   work              | deliverance_2: no result yet (1:00 of effort so far).
 23 5:04 deliverance hint              | Hint for deliverance_2.
      -> waitstill   Hint for deliverance_2.
      -> mindwell    Hint for deliverance_2.
      -> remember    Hint for deliverance_2.
 24 5:48 deliverance work              | deliverance_2 is solved.; Role revealed: deliverance was the hands of the network.; Fate revealed: part of what happened to deliverance.; deliverance takes deliverance_relic.
      -> waitstill   deliverance_2 is solved.; Role revealed: deliverance was the hands of the network.; Fate revealed: part of what happened to deliverance.
      -> mindwell    deliverance_2 is solved.; Role revealed: deliverance was the hands of the network.; Fate revealed: part of what happened to deliverance.
      -> remember    deliverance_2 is solved.; Role revealed: deliverance was the hands of the network.; Fate revealed: part of what happened to deliverance.
 25 5:48 deliverance work             !! nothing to work on here
 26 5:48 deliverance work             !! nothing to work on here
 27 5:48 waitstill   work             !! nothing to work on here
 28 5:48 waitstill   work             !! nothing to work on here
 29 5:48 waitstill   work             !! nothing to work on here
--- phase 5
 30 6:18 deliverance go seance         | deliverance, waitstill, mindwell, remember arrive in seance.
      -> waitstill   deliverance, waitstill, mindwell, remember arrive in seance.
      -> mindwell    deliverance, waitstill, mindwell, remember arrive in seance.
      -> remember    deliverance, waitstill, mindwell, remember arrive in seance.
--- phase 6
 31 6:28 deliverance place             | deliverance places deliverance_relic on the table.
      -> waitstill   deliverance places deliverance_relic on the table.
      -> mindwell    deliverance places deliverance_relic on the table.
      -> remember    deliverance places deliverance_relic on the table.
--- phase 7
 32 6:48 waitstill   go waitstill      | deliverance, waitstill, mindwell, remember arrive in waitstill.
      -> deliverance deliverance, waitstill, mindwell, remember arrive in waitstill.
      -> mindwell    deliverance, waitstill, mindwell, remember arrive in waitstill.
      -> remember    deliverance, waitstill, mindwell, remember arrive in waitstill.
--- phase 8
 33 7:08 waitstill   examine           | You take in the clue for waitstill_1.
--- phase 9
 34 7:23 waitstill   work              | waitstill_1: no result yet (0:15 of effort so far).
 35 7:38 waitstill   work              | waitstill_1: no result yet (0:30 of effort so far).
 36 7:53 waitstill   work              | waitstill_1: no result yet (0:45 of effort so far).
 37 8:08 waitstill   work              | waitstill_1: no result yet (1:00 of effort so far).
 38 8:23 waitstill   hint              | Hint for waitstill_1.
      -> deliverance Hint for waitstill_1.
      -> mindwell    Hint for waitstill_1.
      -> remember    Hint for waitstill_1.
 39 8:34 waitstill   work              | waitstill_1 is solved.
      -> deliverance waitstill_1 is solved.
      -> mindwell    waitstill_1 is solved.
      -> remember    waitstill_1 is solved.
 40 8:34 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 41 8:34 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 42 8:34 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
--- phase 10
 43 8:54 waitstill   examine           | You take in the clue for waitstill_2.
--- phase 11
 44 9:09 waitstill   work              | waitstill_2: no result yet (0:15 of effort so far).
 45 9:24 waitstill   work              | waitstill_2: no result yet (0:30 of effort so far).
 46 9:39 waitstill   work              | waitstill_2: no result yet (0:45 of effort so far).
 47 10:20 waitstill   work              | waitstill_2 is solved.; Role revealed: waitstill was the eyes of the network.; Fate revealed: part of what happened to waitstill.; waitstill takes waitstill_relic.
      -> deliverance waitstill_2 is solved.; Role revealed: waitstill was the eyes of the network.; Fate revealed: part of what happened to waitstill.
      -> mindwell    waitstill_2 is solved.; Role revealed: waitstill was the eyes of the network.; Fate revealed: part of what happened to waitstill.
      -> remember    waitstill_2 is solved.; Role revealed: waitstill was the eyes of the network.; Fate revealed: part of what happened to waitstill.
 48 10:20 waitstill   hint             !! nothing is stalled here
 49 10:20 waitstill   work             !! nothing to work on here
 50 10:20 waitstill   work             !! nothing to work on here
 51 10:20 waitstill   work             !! nothing to work on here
 52 10:20 waitstill   work             !! nothing to work on here
--- phase 12
 53 10:40 waitstill   go seance         | deliverance, waitstill, mindwell, remember arrive in seance.
      -> deliverance deliverance, waitstill, mindwell, remember arrive in seance.
      -> mindwell    deliverance, waitstill, mindwell, remember arrive in seance.
      -> remember    deliverance, waitstill, mindwell, remember arrive in seance.
--- phase 13
 54 10:50 waitstill   place             | waitstill places waitstill_relic on the table.
      -> deliverance waitstill places waitstill_relic on the table.
      -> mindwell    waitstill places waitstill_relic on the table.
      -> remember    waitstill places waitstill_relic on the table.
--- phase 14
 55 11:10 mindwell    go mindwell       | deliverance, waitstill, mindwell, remember arrive in mindwell.
      -> deliverance deliverance, waitstill, mindwell, remember arrive in mindwell.
      -> waitstill   deliverance, waitstill, mindwell, remember arrive in mindwell.
      -> remember    deliverance, waitstill, mindwell, remember arrive in mindwell.
--- phase 15
 56 11:30 mindwell    examine           | You take in the clue for mindwell_1.
--- phase 16
 57 11:50 mindwell    confer            | The players confer.
      -> deliverance The players confer.
      -> waitstill   The players confer.
      -> remember    The players confer.
--- phase 17
 58 12:05 mindwell    work              | mindwell_1: no result yet (0:15 of effort so far).
 59 12:05 remember    work              | mindwell_1: no result yet (0:15 of effort so far).
 60 12:20 mindwell    work              | mindwell_1: no result yet (0:30 of effort so far).
 61 12:20 remember    work              | mindwell_1: no result yet (0:30 of effort so far).
 62 12:35 mindwell    work              | mindwell_1: no result yet (0:45 of effort so far).
 63 12:35 remember    work              | mindwell_1: no result yet (0:45 of effort so far).
 64 12:50 mindwell    work              | mindwell_1: no result yet (1:00 of effort so far).
 65 12:44 remember    work              | mindwell_1: no result yet (1:00 of effort so far).
 66 12:53 remember    work              | mindwell_1: no result yet (1:02 of effort so far).
 67 13:08 mindwell    hint              | Hint for mindwell_1.
      -> deliverance Hint for mindwell_1.
      -> waitstill   Hint for mindwell_1.
      -> remember    Hint for mindwell_1.
 68 13:11 mindwell    work              | mindwell_1 is solved.
      -> deliverance mindwell_1 is solved.
      -> waitstill   mindwell_1 is solved.
      -> remember    mindwell_1 is solved.
 69 13:08 remember    work             !! nobody here knows what mindwell_2 asks for; examine it or get it relayed
 70 13:08 remember    work             !! nobody here knows what mindwell_2 asks for; examine it or get it relayed
 71 13:11 mindwell    work             !! nobody here knows what mindwell_2 asks for; examine it or get it relayed
 72 13:11 mindwell    work             !! nobody here knows what mindwell_2 asks for; examine it or get it relayed
--- phase 18
 73 13:31 mindwell    examine           | You take in the clue for mindwell_2.
--- phase 19
 74 13:51 mindwell    confer            | The players confer.
      -> deliverance The players confer.
      -> waitstill   The players confer.
      -> remember    The players confer.
--- phase 20
 75 14:06 mindwell    work              | mindwell_2: no result yet (0:15 of effort so far).
 76 14:06 remember    work              | mindwell_2: no result yet (0:15 of effort so far).
 77 14:21 mindwell    work              | mindwell_2: no result yet (0:30 of effort so far).
 78 14:21 remember    work              | mindwell_2: no result yet (0:30 of effort so far).
 79 14:36 mindwell    work              | mindwell_2: no result yet (0:45 of effort so far).
 80 14:36 remember    work              | mindwell_2: no result yet (0:45 of effort so far).
 81 14:51 mindwell    work              | mindwell_2: no result yet (1:00 of effort so far).
 82 14:42 remember    work              | mindwell_2: no result yet (1:00 of effort so far).
 83 14:48 remember    work              | mindwell_2: no result yet (1:00 of effort so far).
 84 14:54 remember    work              | mindwell_2: no result yet (1:03 of effort so far).
 85 15:09 mindwell    hint              | Hint for mindwell_2.
      -> deliverance Hint for mindwell_2.
      -> waitstill   Hint for mindwell_2.
      -> remember    Hint for mindwell_2.
 86 15:41 mindwell    work              | mindwell_2 is solved.; Role revealed: mindwell was the ears of the network.; Fate revealed: part of what happened to mindwell.; mindwell takes mindwell_relic.
      -> deliverance mindwell_2 is solved.; Role revealed: mindwell was the ears of the network.; Fate revealed: part of what happened to mindwell.
      -> waitstill   mindwell_2 is solved.; Role revealed: mindwell was the ears of the network.; Fate revealed: part of what happened to mindwell.
      -> remember    mindwell_2 is solved.; Role revealed: mindwell was the ears of the network.; Fate revealed: part of what happened to mindwell.
 87 15:41 mindwell    work             !! nothing to work on here
 88 15:41 mindwell    work             !! nothing to work on here
 89 15:41 remember    work             !! nothing to work on here
--- phase 21
 90 16:11 mindwell    go seance         | deliverance, waitstill, mindwell, remember arrive in seance.
      -> deliverance deliverance, waitstill, mindwell, remember arrive in seance.
      -> waitstill   deliverance, waitstill, mindwell, remember arrive in seance.
      -> remember    deliverance, waitstill, mindwell, remember arrive in seance.
--- phase 22
 91 16:21 mindwell    place             | mindwell places mindwell_relic on the table.
      -> deliverance mindwell places mindwell_relic on the table.
      -> waitstill   mindwell places mindwell_relic on the table.
      -> remember    mindwell places mindwell_relic on the table.
--- phase 23
 92 16:41 remember    go remember       | deliverance, waitstill, mindwell, remember arrive in remember.
      -> deliverance deliverance, waitstill, mindwell, remember arrive in remember.
      -> waitstill   deliverance, waitstill, mindwell, remember arrive in remember.
      -> mindwell    deliverance, waitstill, mindwell, remember arrive in remember.
--- phase 24
 93 17:01 deliverance examine           | You take in the clue for remember_1.
 94 17:01 remember    examine           | You take in the clue for remember_1.
--- phase 25
 95 17:16 remember    work              | remember_1: no result yet (0:15 of effort so far).
 96 17:31 remember    work              | remember_1: no result yet (0:30 of effort so far).
 97 17:46 remember    work              | remember_1: no result yet (0:45 of effort so far).
 98 18:01 remember    work              | remember_1: no result yet (1:00 of effort so far).
 99 18:16 remember    hint              | Hint for remember_1.
      -> deliverance Hint for remember_1.
      -> waitstill   Hint for remember_1.
      -> mindwell    Hint for remember_1.
100 18:24 remember    work              | remember_1 is solved.
      -> deliverance remember_1 is solved.
      -> waitstill   remember_1 is solved.
      -> mindwell    remember_1 is solved.
101 18:24 remember    work             !! nobody here knows what remember_2 asks for; examine it or get it relayed
102 18:24 remember    work             !! nobody here knows what remember_2 asks for; examine it or get it relayed
103 18:24 remember    work             !! nobody here knows what remember_2 asks for; examine it or get it relayed
--- phase 26
104 18:44 remember    examine           | You take in the clue for remember_2.
105 18:44 deliverance examine           | You take in the clue for remember_2.
--- phase 27
106 18:59 remember    work              | remember_2: no result yet (0:15 of effort so far).
107 19:14 remember    work              | remember_2: no result yet (0:30 of effort so far).
108 19:29 remember    work              | remember_2: no result yet (0:45 of effort so far).
109 19:44 remember    work              | remember_2: no result yet (1:00 of effort so far).
110 19:59 remember    hint              | Hint for remember_2.
      -> deliverance Hint for remember_2.
      -> waitstill   Hint for remember_2.
      -> mindwell    Hint for remember_2.
111 20:42 remember    work              | remember_2 is solved.; Role revealed: remember was the voice of the network.; Fate revealed: part of what happened to remember.; remember takes remember_relic.
      -> deliverance remember_2 is solved.; Role revealed: remember was the voice of the network.; Fate revealed: part of what happened to remember.
      -> waitstill   remember_2 is solved.; Role revealed: remember was the voice of the network.; Fate revealed: part of what happened to remember.
      -> mindwell    remember_2 is solved.; Role revealed: remember was the voice of the network.; Fate revealed: part of what happened to remember.
112 20:42 remember    work             !! nothing to work on here
113 20:42 remember    work             !! nothing to work on here
114 20:42 remember    work             !! nothing to work on here
--- phase 28
115 21:02 remember    go seance         | deliverance, waitstill, mindwell, remember arrive in seance.
      -> deliverance deliverance, waitstill, mindwell, remember arrive in seance.
      -> waitstill   deliverance, waitstill, mindwell, remember arrive in seance.
      -> mindwell    deliverance, waitstill, mindwell, remember arrive in seance.
--- phase 29
116 21:57 remember    place             | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> deliverance The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> waitstill   The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> mindwell    The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
--- phase 30
117 22:27 deliverance curse             | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
      -> waitstill   Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> mindwell    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> remember    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
118 22:57 waitstill   curse             | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
      -> deliverance Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> mindwell    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> remember    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
119 23:27 mindwell    curse             | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
      -> deliverance Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
      -> waitstill   Remember. remember, the spirit calls you.
      -> remember    Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
120 23:42 remember    curse             | Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.; remember is now silenced.; You apply your curse: you are silenced.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
      -> deliverance Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.; remember is now silenced.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
      -> waitstill   Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
      -> mindwell    remember is now silenced.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
== UNDEFINED == Run ended at 23:42: the rules do not say: What player action prevents the resurrection ritual, and how is the ritual's progress shown to the players? (handoff 13, resurrection)
total 23:42; stages: opening 2:00, deliverance 3:58, seance 0:30, waitstill 3:52, seance 0:30, mindwell 5:00, seance 0:30, remember 4:20, seance 0:30, turn 2:30; hints 6
  finale curse:deliverance 22:12 deliverance=gloved waitstill=- mindwell=- remember=-
  finale curse:waitstill  22:42 deliverance=gloved waitstill=blindfolded mindwell=- remember=-
  finale curse:mindwell   23:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=-
  finale curse:remember   23:42 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
```

### splitA.actions

```
# split run A, seed 2, GROUP_MOVES_TOGETHER=False. "I'm bound to X, I'll take X's room."
deliverance: go deliverance
waitstill: go waitstill
mindwell: go mindwell
remember: go remember
---
deliverance: examine
waitstill: examine
mindwell: examine
remember: examine
---
# each works their step; whoever stalls first calls for the medium
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: hint
deliverance: work
deliverance: work
deliverance: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: hint
waitstill: work
waitstill: work
waitstill: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: hint
mindwell: work
mindwell: work
mindwell: work
remember: work
remember: work
remember: work
remember: work
remember: hint
remember: work
remember: work
remember: work
```

### splitA.txt

```
# run: --seed 2 --set GROUP_MOVES_TOGETHER=False
--- phase 0
  0 2:20 deliverance go deliverance    | deliverance arrives in deliverance.
  1 2:20 waitstill   go waitstill      | waitstill arrives in waitstill.
  2 2:20 mindwell    go mindwell       | mindwell arrives in mindwell.
  3 2:20 remember    go remember       | remember arrives in remember.
--- phase 1
  4 2:40 deliverance examine           | You take in the clue for deliverance_1.
  5 2:40 waitstill   examine           | You take in the clue for waitstill_1.
  6 2:40 mindwell    examine           | You take in the clue for mindwell_1.
  7 2:40 remember    examine           | You take in the clue for remember_1.
--- phase 2
  8 2:55 deliverance work              | deliverance_1: no result yet (0:15 of effort so far).
  9 2:55 waitstill   work              | waitstill_1: no result yet (0:15 of effort so far).
 10 2:55 mindwell    work              | mindwell_1: no result yet (0:15 of effort so far).
 11 2:55 remember    work              | remember_1: no result yet (0:15 of effort so far).
 12 3:10 deliverance work              | deliverance_1: no result yet (0:30 of effort so far).
 13 3:10 waitstill   work              | waitstill_1: no result yet (0:30 of effort so far).
 14 3:10 mindwell    work              | mindwell_1: no result yet (0:30 of effort so far).
 15 3:10 remember    work              | remember_1: no result yet (0:30 of effort so far).
 16 3:25 deliverance work              | deliverance_1: no result yet (0:45 of effort so far).
 17 3:25 waitstill   work              | waitstill_1: no result yet (0:45 of effort so far).
 18 3:25 mindwell    work              | mindwell_1: no result yet (0:45 of effort so far).
 19 3:25 remember    work              | remember_1: no result yet (0:45 of effort so far).
 20 3:40 deliverance work              | deliverance_1: no result yet (1:00 of effort so far).
 21 3:25 waitstill   work              | waitstill_1 is solved.
 22 3:40 mindwell    work              | mindwell_1: no result yet (1:00 of effort so far).
 23 3:40 remember    work              | remember_1: no result yet (1:00 of effort so far).
 24 3:25 waitstill   hint             !! the medium does not offer a hint yet (0:00 of effort on waitstill_2 since the last hint; she waits for 1:00)
 25 3:25 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 26 3:25 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 27 3:25 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 28 3:40 deliverance hint             
== UNDEFINED == Run ended at 3:40: the rules do not say: Where is the medium when the players are in different rooms? (one live medium; hub-and-spoke)
total 3:40; stages: opening 2:00, remember 1:40; hints 0
```

### splitB.actions

```
# split run B, seed 2, GROUP_MOVES_TOGETHER=False. Nobody asks for hints: the medium is not in your room.
deliverance: go deliverance
waitstill: go waitstill
mindwell: go mindwell
remember: go remember
---
deliverance: examine
waitstill: examine
mindwell: examine
remember: examine
---
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
remember: work
remember: work
remember: work
remember: work
remember: work
remember: work
remember: work
---
deliverance: examine
waitstill: examine
mindwell: examine
remember: examine
---
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
remember: work
remember: work
remember: work
remember: work
remember: work
remember: work
remember: work
waitstill: go seance
waitstill: place
waitstill: go mindwell
waitstill: go seance
remember: go seance
remember: place
mindwell: go seance
mindwell: place
deliverance: go seance
deliverance: place
---
deliverance: curse
waitstill: curse
mindwell: curse
remember: curse
```

### splitB.txt

```
# run: --seed 2 --set GROUP_MOVES_TOGETHER=False
--- phase 0
  0 2:20 deliverance go deliverance    | deliverance arrives in deliverance.
  1 2:20 waitstill   go waitstill      | waitstill arrives in waitstill.
  2 2:20 mindwell    go mindwell       | mindwell arrives in mindwell.
  3 2:20 remember    go remember       | remember arrives in remember.
--- phase 1
  4 2:40 deliverance examine           | You take in the clue for deliverance_1.
  5 2:40 waitstill   examine           | You take in the clue for waitstill_1.
  6 2:40 mindwell    examine           | You take in the clue for mindwell_1.
  7 2:40 remember    examine           | You take in the clue for remember_1.
--- phase 2
  8 2:55 deliverance work              | deliverance_1: no result yet (0:15 of effort so far).
  9 2:55 waitstill   work              | waitstill_1: no result yet (0:15 of effort so far).
 10 2:55 mindwell    work              | mindwell_1: no result yet (0:15 of effort so far).
 11 2:55 remember    work              | remember_1: no result yet (0:15 of effort so far).
 12 3:10 deliverance work              | deliverance_1: no result yet (0:30 of effort so far).
 13 3:10 waitstill   work              | waitstill_1: no result yet (0:30 of effort so far).
 14 3:10 mindwell    work              | mindwell_1: no result yet (0:30 of effort so far).
 15 3:10 remember    work              | remember_1: no result yet (0:30 of effort so far).
 16 3:25 deliverance work              | deliverance_1: no result yet (0:45 of effort so far).
 17 3:25 waitstill   work              | waitstill_1: no result yet (0:45 of effort so far).
 18 3:25 mindwell    work              | mindwell_1: no result yet (0:45 of effort so far).
 19 3:25 remember    work              | remember_1: no result yet (0:45 of effort so far).
 20 3:40 deliverance work              | deliverance_1: no result yet (1:00 of effort so far).
 21 3:25 waitstill   work              | waitstill_1 is solved.
 22 3:40 mindwell    work              | mindwell_1: no result yet (1:00 of effort so far).
 23 3:40 remember    work              | remember_1: no result yet (1:00 of effort so far).
 24 3:25 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 25 3:25 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 26 3:25 waitstill   work             !! nobody here knows what waitstill_2 asks for; examine it or get it relayed
 27 3:55 deliverance work              | deliverance_1: no result yet (1:15 of effort so far).
 28 3:55 mindwell    work              | mindwell_1: no result yet (1:15 of effort so far).
 29 3:55 remember    work              | remember_1: no result yet (1:15 of effort so far).
 30 4:10 deliverance work              | deliverance_1: no result yet (1:30 of effort so far).
 31 4:07 mindwell    work              | mindwell_1 is solved.
 32 3:58 remember    work              | remember_1 is solved.
 33 3:58 remember    work             !! nobody here knows what remember_2 asks for; examine it or get it relayed
 34 4:07 mindwell    work             !! nobody here knows what mindwell_2 asks for; examine it or get it relayed
 35 4:13 deliverance work              | deliverance_1 is solved.
--- phase 3
 36 4:30 waitstill   examine           | You take in the clue for waitstill_2.
 37 4:30 mindwell    examine           | You take in the clue for mindwell_2.
 38 4:30 remember    examine           | You take in the clue for remember_2.
 39 4:33 deliverance examine           | You take in the clue for deliverance_2.
--- phase 4
 40 4:45 waitstill   work              | waitstill_2: no result yet (0:15 of effort so far).
 41 4:45 mindwell    work              | mindwell_2: no result yet (0:15 of effort so far).
 42 4:45 remember    work              | remember_2: no result yet (0:15 of effort so far).
 43 4:48 deliverance work              | deliverance_2: no result yet (0:15 of effort so far).
 44 5:00 waitstill   work              | waitstill_2: no result yet (0:30 of effort so far).
 45 5:00 mindwell    work              | mindwell_2: no result yet (0:30 of effort so far).
 46 5:00 remember    work              | remember_2: no result yet (0:30 of effort so far).
 47 5:03 deliverance work              | deliverance_2: no result yet (0:30 of effort so far).
 48 5:15 waitstill   work              | waitstill_2: no result yet (0:45 of effort so far).
 49 5:15 mindwell    work              | mindwell_2: no result yet (0:45 of effort so far).
 50 5:15 remember    work              | remember_2: no result yet (0:45 of effort so far).
 51 5:18 deliverance work              | deliverance_2: no result yet (0:45 of effort so far).
 52 5:46 waitstill   work              | waitstill_2 is solved.; Role revealed: waitstill was the eyes of the network.; Fate revealed: part of what happened to waitstill.; waitstill takes waitstill_relic.
 53 5:30 mindwell    work              | mindwell_2: no result yet (1:00 of effort so far).
 54 5:58 remember    work              | remember_2 is solved.; Role revealed: remember was the voice of the network.; Fate revealed: part of what happened to remember.; remember takes remember_relic.
 55 5:33 deliverance work              | deliverance_2: no result yet (1:00 of effort so far).
 56 5:45 mindwell    work              | mindwell_2: no result yet (1:15 of effort so far).
 57 5:48 deliverance work              | deliverance_2: no result yet (1:15 of effort so far).
 58 6:21 mindwell    work              | mindwell_2 is solved.; Role revealed: mindwell was the ears of the network.; Fate revealed: part of what happened to mindwell.; mindwell takes mindwell_relic.
 59 5:46 waitstill   work             !! nothing to work on here
 60 5:46 waitstill   work             !! nothing to work on here
 61 5:46 waitstill   work             !! nothing to work on here
 62 6:06 waitstill   go seance         | waitstill arrives in seance.
 63 6:03 deliverance work              | deliverance_2: no result yet (1:30 of effort so far).
 64 5:58 remember    work             !! nothing to work on here
 65 5:58 remember    work             !! nothing to work on here
 66 5:58 remember    work             !! nothing to work on here
 67 6:18 remember    go seance         | remember arrives in seance.
      -> waitstill   remember arrives in seance.
 68 6:36 deliverance work              | deliverance_2 is solved.; Role revealed: deliverance was the hands of the network.; Fate revealed: part of what happened to deliverance.; deliverance takes deliverance_relic.
 69 6:16 waitstill   place             | waitstill places waitstill_relic on the table.
      -> remember    waitstill places waitstill_relic on the table.
 70 6:36 waitstill   go mindwell       | waitstill arrives in mindwell.
      -> mindwell    waitstill arrives in mindwell.
 71 6:28 remember    place             | remember places remember_relic on the table.
 72 6:21 mindwell    work             !! nothing to work on here
 73 6:41 mindwell    go seance         | mindwell arrives in seance.
      -> remember    mindwell arrives in seance.
 74 6:56 waitstill   go seance         | waitstill arrives in seance.
      -> mindwell    waitstill arrives in seance.
      -> remember    waitstill arrives in seance.
 75 6:56 deliverance go seance         | deliverance arrives in seance.
      -> waitstill   deliverance arrives in seance.
      -> mindwell    deliverance arrives in seance.
      -> remember    deliverance arrives in seance.
 76 6:51 mindwell    place             | mindwell places mindwell_relic on the table.
      -> deliverance mindwell places mindwell_relic on the table.
      -> waitstill   mindwell places mindwell_relic on the table.
      -> remember    mindwell places mindwell_relic on the table.
 77 7:51 deliverance place             | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; deliverance places deliverance_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> waitstill   The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; deliverance places deliverance_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> mindwell    The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; deliverance places deliverance_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> remember    The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; deliverance places deliverance_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
--- phase 5
 78 8:21 deliverance curse             | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
      -> waitstill   Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> mindwell    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> remember    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
 79 8:51 waitstill   curse             | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
      -> deliverance Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> mindwell    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> remember    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
 80 9:21 mindwell    curse             | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
      -> deliverance Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
      -> waitstill   Remember. remember, the spirit calls you.
      -> remember    Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
 81 9:36 remember    curse             | Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.; remember is now silenced.; You apply your curse: you are silenced.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
      -> deliverance Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.; remember is now silenced.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
      -> waitstill   Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
      -> mindwell    remember is now silenced.; Objective: Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.
== UNDEFINED == Run ended at 9:36: the rules do not say: What player action prevents the resurrection ritual, and how is the ritual's progress shown to the players? (handoff 13, resurrection)
total 9:36; stages: opening 2:00, remember 3:46, seance 0:12, seance 0:17, mindwell 0:05, seance 0:14, seance 0:00, seance 0:30, turn 2:29; hints 0
  finale curse:deliverance 8:06 deliverance=gloved waitstill=- mindwell=- remember=-
  finale curse:waitstill  8:36 deliverance=gloved waitstill=blindfolded mindwell=- remember=-
  finale curse:mindwell   9:06 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=-
  finale curse:remember   9:36 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
```

### win.actions

```
# (group1.actions, then:)
---
# FINALE, win attempt. Deliverance (gloved) heard "she calls Deliverance first" and knows the way; Remember (silent, still has hands) does it.
deliverance: relay remember
remember: work
remember: work
remember: work
remember: work
remember: work
---
# Waitstill (blind) knows the way for Waitstill; tells Remember, who still has eyes
waitstill: relay remember
remember: work
remember: work
remember: work
remember: work
remember: work
---
# Mindwell (muffled) saw Waitstill's mark go out and sees "she is calling mindwell"; tells Deliverance, who can hear
mindwell: relay deliverance
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
---
# Remember's is written, not told: Mindwell reads it and says it
mindwell: examine
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
---
mindwell: examine
mindwell: work
mindwell: work
mindwell: work
mindwell: work
```

### win.txt

```
--- phase 29
116 21:57 remember    place             | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> deliverance The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> waitstill   The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> mindwell    The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
--- phase 30
117 22:27 deliverance curse             | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
      -> waitstill   Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> mindwell    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> remember    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
118 22:57 waitstill   curse             | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
      -> deliverance Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> mindwell    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> remember    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
119 23:27 mindwell    curse             | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
      -> deliverance Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
      -> waitstill   Remember. remember, the spirit calls you.
      -> remember    Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
120 23:42 remember    curse             | She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; You apply your curse: you are silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> deliverance She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> waitstill   She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> mindwell    remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
--- phase 31
121 23:57 deliverance relay remember    | deliverance tells remember what they know.
      -> waitstill   deliverance tells remember what they know.
      -> remember    deliverance tells remember what they know.
122 24:12 remember    work              | sever_deliverance: no result yet (0:15 of effort so far).
123 24:27 remember    work              | sever_deliverance: no result yet (0:30 of effort so far).
124 24:42 remember    work              | Deliverance's scream grows close.; The mark on deliverance brightens.; sever_deliverance: no result yet (0:45 of effort so far).
      -> deliverance Deliverance's scream grows close.; The mark on deliverance brightens.
      -> waitstill   Deliverance's scream grows close.
      -> mindwell    The mark on deliverance brightens.
125 24:57 remember    work              | Deliverance's scream leaves the fire.; sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
      -> deliverance Deliverance's scream leaves the fire.; sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
      -> waitstill   Deliverance's scream leaves the fire.
      -> mindwell    sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
126 24:57 remember    work             !! nobody here who knows sever_waitstill can supply eyes
--- phase 32
127 24:57 remember    work             !! nobody here who knows sever_waitstill can supply eyes
128 24:57 remember    work             !! nobody here who knows sever_waitstill can supply eyes
129 24:57 remember    work             !! nobody here who knows sever_waitstill can supply eyes
130 24:57 remember    work             !! nobody here who knows sever_waitstill can supply eyes
131 24:57 remember    work             !! nobody here who knows sever_waitstill can supply eyes
132 25:22 waitstill   relay remember    | waitstill tells remember what they know.
      -> deliverance waitstill tells remember what they know.
      -> remember    waitstill tells remember what they know.
--- phase 33
133 25:22 mindwell    relay deliverance 
      -> deliverance mindwell tells deliverance what they know.
      -> waitstill   mindwell tells deliverance what they know.
      -> remember    mindwell tells deliverance what they know.
134 25:37 deliverance work              | sever_waitstill: no result yet (0:15 of effort so far).
135 25:52 deliverance work              | sever_waitstill: no result yet (0:30 of effort so far).
136 26:07 deliverance work              | sever_waitstill: no result yet (0:45 of effort so far).
137 26:22 deliverance work              | Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
      -> waitstill   Waitstill's scream leaves the fire.
      -> mindwell    sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
      -> remember    Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
138 26:37 deliverance work              | sever_mindwell: no result yet (0:15 of effort so far).
--- phase 34
139 26:22 mindwell    examine          !! there is nothing to read; this step's information is in mindwell's head
140 26:37 mindwell    work              | sever_mindwell: no result yet (0:15 of effort so far).
141 26:52 mindwell    work              | sever_mindwell: no result yet (0:30 of effort so far).
142 27:07 mindwell    work              | sever_mindwell: no result yet (0:45 of effort so far).
143 27:22 mindwell    work              | sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
      -> deliverance Mindwell's scream leaves the fire.; sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
      -> waitstill   Mindwell's scream leaves the fire.
      -> remember    Mindwell's scream leaves the fire.; sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
144 27:22 mindwell    work             !! nobody here knows what sever_remember asks for; examine it or get it relayed
--- phase 35
145 27:42 mindwell    examine           | You take in the clue for sever_remember.
146 27:57 mindwell    work              | sever_remember: no result yet (0:15 of effort so far).
147 28:12 mindwell    work              | sever_remember: no result yet (0:30 of effort so far).
148 28:27 mindwell    work              | sever_remember: no result yet (0:45 of effort so far).
149 28:42 mindwell    work              | sever_remember is solved.; The mark on remember goes out. Remember is safe.
      -> deliverance Remember's scream leaves the fire.; sever_remember is solved.; The mark on remember goes out. Remember is safe.
      -> waitstill   Remember's scream leaves the fire.
      -> remember    Remember's scream leaves the fire.; sever_remember is solved.; The mark on remember goes out. Remember is safe.
== WON == You won because you cut all four children's hold before the fire took any of them, at 28:42 with 2:30 of the soundtrack left.
total 28:42; stages: opening 2:00, deliverance 3:58, seance 0:30, waitstill 3:52, seance 0:30, mindwell 5:00, seance 0:30, remember 4:20, seance 0:30, turn 2:30, finale 5:00; hints 6
  finale curse:deliverance 22:12 deliverance=gloved waitstill=- mindwell=- remember=-
  finale curse:waitstill  22:42 deliverance=gloved waitstill=blindfolded mindwell=- remember=-
  finale curse:mindwell   23:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=-
  finale curse:remember   23:42 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_deliverance 24:57 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_waitstill  26:22 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_mindwell   27:22 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_remember   28:42 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
```

### loss.actions

```
# (group1.actions, then:)
---
# FINALE, loss. The group is confused: Deliverance tries the thing gloved, then everyone confers; Deliverance tells Waitstill (blind), who works it by feel.
deliverance: work
deliverance: confer
deliverance: relay waitstill
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
---
# after the first taking they get it: Waitstill tells Remember; Remember works with eyes
waitstill: relay remember
remember: work
remember: work
remember: work
remember: work
remember: work
---
mindwell: relay deliverance
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
---
mindwell: examine
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
---
# nothing left to do; the fire plays out
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
```

### loss.txt

```
--- phase 29
116 21:57 remember    place             | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> deliverance The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> waitstill   The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> mindwell    The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
--- phase 30
117 22:27 deliverance curse             | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
      -> waitstill   Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> mindwell    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> remember    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
118 22:57 waitstill   curse             | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
      -> deliverance Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> mindwell    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> remember    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
119 23:27 mindwell    curse             | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
      -> deliverance Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
      -> waitstill   Remember. remember, the spirit calls you.
      -> remember    Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
120 23:42 remember    curse             | She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; You apply your curse: you are silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> deliverance She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> waitstill   She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> mindwell    remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
--- phase 31
121 23:42 deliverance work             !! nobody here who knows sever_deliverance can supply hands
122 24:02 deliverance confer            | The players confer.
      -> waitstill   The players confer.
      -> remember    The players confer.
123 24:17 deliverance relay waitstill   | deliverance tells waitstill what they know.
      -> waitstill   deliverance tells waitstill what they know.
      -> remember    deliverance tells waitstill what they know.
124 24:32 waitstill   work              | sever_deliverance: no result yet (0:15 of effort so far).
125 24:47 waitstill   work              | Deliverance's scream grows close.; sever_deliverance: no result yet (0:30 of effort so far).
      -> deliverance Deliverance's scream grows close.; The mark on deliverance brightens.
      -> mindwell    The mark on deliverance brightens.
      -> remember    Deliverance's scream grows close.; The mark on deliverance brightens.
126 25:02 waitstill   work              | sever_deliverance: no result yet (0:45 of effort so far).
127 25:17 waitstill   work              | Deliverance's scream stops. A voice answers her from deliverance.; Too late: deliverance was taken while you worked.
      -> deliverance Deliverance's scream stops. A voice answers her from deliverance.; deliverance goes still; the mark on them is dark. Deliverance is taken.
      -> mindwell    deliverance goes still; the mark on them is dark. Deliverance is taken.
      -> remember    Deliverance's scream stops. A voice answers her from deliverance.; deliverance goes still; the mark on them is dark. Deliverance is taken.
128 25:32 waitstill   work              | sever_waitstill: no result yet (0:15 of effort so far).
--- phase 32
129 25:32 remember    work              | sever_waitstill: no result yet (0:15 of effort so far).
130 25:47 waitstill   relay remember    | waitstill tells remember what they know.
      -> deliverance waitstill tells remember what they know.
      -> remember    waitstill tells remember what they know.
131 26:02 remember    work              | sever_waitstill: no result yet (0:30 of effort so far).
132 26:17 remember    work              | sever_waitstill: no result yet (0:45 of effort so far).
133 26:32 remember    work              | Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
      -> deliverance Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
      -> waitstill   Waitstill's scream leaves the fire.
      -> mindwell    sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
134 26:47 remember    work              | sever_mindwell: no result yet (0:15 of effort so far).
--- phase 33
135 26:47 deliverance work              | sever_mindwell: no result yet (0:15 of effort so far).
136 27:02 mindwell    relay deliverance 
      -> deliverance mindwell tells deliverance what they know.
      -> waitstill   mindwell tells deliverance what they know.
      -> remember    mindwell tells deliverance what they know.
137 27:17 deliverance work              | sever_mindwell: no result yet (0:30 of effort so far).
138 27:32 deliverance work              | sever_mindwell: no result yet (0:45 of effort so far).
139 27:47 deliverance work              | Mindwell's scream leaves the fire.; sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
      -> waitstill   Mindwell's scream leaves the fire.
      -> mindwell    sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
      -> remember    Mindwell's scream leaves the fire.; sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
140 27:47 deliverance work             !! nobody here knows what sever_remember asks for; examine it or get it relayed
--- phase 34
141 28:07 mindwell    examine           | You take in the clue for sever_remember.
142 28:22 mindwell    work              | sever_remember: no result yet (0:15 of effort so far).
143 28:37 mindwell    work              | sever_remember: no result yet (0:30 of effort so far).
144 28:52 mindwell    work              | sever_remember: no result yet (0:45 of effort so far).
145 29:07 mindwell    work              | sever_remember is solved.; The mark on remember goes out. Remember is safe.
      -> deliverance Remember's scream leaves the fire.; sever_remember is solved.; The mark on remember goes out. Remember is safe.
      -> waitstill   Remember's scream leaves the fire.
      -> remember    Remember's scream leaves the fire.; sever_remember is solved.; The mark on remember goes out. Remember is safe.
== LOST == You lost because nothing was left to cut at 29:07: the ritual completed on 1 of her four children (deliverance answer to their children's names; waitstill, mindwell, remember safe); the medium ends the seance to release the guests.
total 29:07; stages: opening 2:00, deliverance 3:58, seance 0:30, waitstill 3:52, seance 0:30, mindwell 5:00, seance 0:30, remember 4:20, seance 0:30, turn 2:30, finale 5:25; hints 6
  finale curse:deliverance 22:12 deliverance=gloved waitstill=- mindwell=- remember=-
  finale curse:waitstill  22:42 deliverance=gloved waitstill=blindfolded mindwell=- remember=-
  finale curse:mindwell   23:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=-
  finale curse:remember   23:42 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale taken:deliverance 25:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_waitstill  26:32 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_mindwell   27:47 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_remember   29:07 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
```

### frozen.actions

```
# (group1.actions, then:)
---
# nobody understands; everyone stands there
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
remember: wait
```

### frozen.txt

```
--- phase 29
116 21:57 remember    place             | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> deliverance The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> waitstill   The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> mindwell    The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
--- phase 30
117 22:27 deliverance curse             | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
      -> waitstill   Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> mindwell    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> remember    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
118 22:57 waitstill   curse             | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
      -> deliverance Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> mindwell    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> remember    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
119 23:27 mindwell    curse             | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
      -> deliverance Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
      -> waitstill   Remember. remember, the spirit calls you.
      -> remember    Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
120 23:42 remember    curse             | She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; You apply your curse: you are silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> deliverance She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> waitstill   She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> mindwell    remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
--- phase 31
121 24:42 remember    wait              | Deliverance's scream grows close.; The mark on deliverance brightens.
      -> deliverance Deliverance's scream grows close.; The mark on deliverance brightens.
      -> waitstill   Deliverance's scream grows close.
      -> mindwell    The mark on deliverance brightens.
122 25:12 remember    wait              | Deliverance's scream stops. A voice answers her from deliverance.; deliverance goes still; the mark on them is dark. Deliverance is taken.
      -> deliverance Deliverance's scream stops. A voice answers her from deliverance.; deliverance goes still; the mark on them is dark. Deliverance is taken.
      -> waitstill   Deliverance's scream stops. A voice answers her from deliverance.
      -> mindwell    deliverance goes still; the mark on them is dark. Deliverance is taken.
123 26:42 remember    wait              | Waitstill's scream grows close.; The mark on waitstill brightens.
      -> deliverance Waitstill's scream grows close.; The mark on waitstill brightens.
      -> waitstill   Waitstill's scream grows close.
      -> mindwell    The mark on waitstill brightens.
124 27:12 remember    wait              | Waitstill's scream stops. A voice answers her from waitstill.; waitstill goes still; the mark on them is dark. Waitstill is taken.
      -> deliverance Waitstill's scream stops. A voice answers her from waitstill.; waitstill goes still; the mark on them is dark. Waitstill is taken.
      -> waitstill   Waitstill's scream stops. A voice answers her from waitstill.
      -> mindwell    waitstill goes still; the mark on them is dark. Waitstill is taken.
125 28:42 remember    wait              | Mindwell's scream grows close.; The mark on mindwell brightens.
      -> deliverance Mindwell's scream grows close.; The mark on mindwell brightens.
      -> waitstill   Mindwell's scream grows close.
      -> mindwell    The mark on mindwell brightens.
126 29:12 remember    wait              | Mindwell's scream stops. A voice answers her from mindwell.; mindwell goes still; the mark on them is dark. Mindwell is taken.
      -> deliverance Mindwell's scream stops. A voice answers her from mindwell.; mindwell goes still; the mark on them is dark. Mindwell is taken.
      -> waitstill   Mindwell's scream stops. A voice answers her from mindwell.
      -> mindwell    mindwell goes still; the mark on them is dark. Mindwell is taken.
127 30:42 remember    wait              | Remember's scream grows close.; The mark on remember brightens.
      -> deliverance Remember's scream grows close.; The mark on remember brightens.
      -> waitstill   Remember's scream grows close.
      -> mindwell    The mark on remember brightens.
128 31:12 remember    wait              | Remember's scream stops. A voice answers her from remember.; remember goes still; the mark on them is dark. Remember is taken.
      -> deliverance Remember's scream stops. A voice answers her from remember.; remember goes still; the mark on them is dark. Remember is taken.
      -> waitstill   Remember's scream stops. A voice answers her from remember.
      -> mindwell    remember goes still; the mark on them is dark. Remember is taken.
== LOST == You lost because the ritual took all four children before the fire ended, and the ritual completed on 4 of her four children: deliverance, waitstill, mindwell, remember answer to their children's names; the medium ends the seance to release the guests.
total 31:12; stages: opening 2:00, deliverance 3:58, seance 0:30, waitstill 3:52, seance 0:30, mindwell 5:00, seance 0:30, remember 4:20, seance 0:30, turn 2:30, finale 7:30; hints 6
  finale curse:deliverance 22:12 deliverance=gloved waitstill=- mindwell=- remember=-
  finale curse:waitstill  22:42 deliverance=gloved waitstill=blindfolded mindwell=- remember=-
  finale curse:mindwell   23:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=-
  finale curse:remember   23:42 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale taken:deliverance 25:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale taken:waitstill  27:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale taken:mindwell   29:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale taken:remember   31:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
```

### loss_afc.actions

```
# (group1.actions, then:)
---
# FINALE, loss. The group is confused: Deliverance tries the thing gloved, then everyone confers; Deliverance tells Waitstill (blind), who works it by feel.
deliverance: work
deliverance: confer
deliverance: relay waitstill
waitstill: work
waitstill: work
waitstill: work
waitstill: work
waitstill: work
---
# after the first taking they get it: Waitstill tells Remember; Remember works with eyes
waitstill: relay remember
remember: work
remember: work
remember: work
remember: work
remember: work
---
mindwell: relay deliverance
deliverance: work
deliverance: work
deliverance: work
deliverance: work
deliverance: work
---
mindwell: examine
mindwell: work
mindwell: work
mindwell: work
mindwell: work
mindwell: work
---
# nothing left to do; the fire plays out
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
deliverance: wait
```

### loss_afc.txt

```
--- phase 29
116 21:57 remember    place             | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> deliverance The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> waitstill   The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
      -> mindwell    The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
--- phase 30
117 22:27 deliverance curse             | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
      -> waitstill   Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> mindwell    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
      -> remember    Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; The medium turns to waitstill.
118 22:57 waitstill   curse             | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
      -> deliverance Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> mindwell    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
      -> remember    Mindwell. mindwell, the spirit calls you.; waitstill is now blindfolded.; The medium turns to mindwell.
119 23:27 mindwell    curse             | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
      -> deliverance Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
      -> waitstill   Remember. remember, the spirit calls you.
      -> remember    Remember. remember, the spirit calls you.; mindwell is now muffled.; The medium turns to remember.
120 23:42 remember    curse             | She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; You apply your curse: you are silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> deliverance She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> waitstill   She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
      -> mindwell    remember is now silenced.; Objective: She means to put her children into you, one into each of you who carries their mark. Before a child's scream reaches the one who bears their mark, the rest of you must cut that child's hold; the bearer knows the way and cannot do it alone. When a child's voice leaves the fire, that one is safe. She calls Deliverance first.
--- phase 31
121 23:42 deliverance work             !! nobody here who knows sever_deliverance can supply hands
122 24:02 deliverance confer            | The players confer.
      -> waitstill   The players confer.
      -> remember    The players confer.
123 24:17 deliverance relay waitstill   | deliverance tells waitstill what they know.
      -> waitstill   deliverance tells waitstill what they know.
      -> remember    deliverance tells waitstill what they know.
124 24:32 waitstill   work              | sever_deliverance: no result yet (0:15 of effort so far).
125 24:47 waitstill   work              | sever_deliverance: no result yet (0:30 of effort so far).
126 25:02 waitstill   work              | sever_deliverance: no result yet (0:45 of effort so far).
127 25:17 waitstill   work              | Deliverance's scream leaves the fire.
      -> deliverance Deliverance's scream leaves the fire.; sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
      -> mindwell    sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
      -> remember    Deliverance's scream leaves the fire.; sever_deliverance is solved.; The mark on deliverance goes out. Deliverance is safe.
128 25:32 waitstill   work              | sever_waitstill: no result yet (0:15 of effort so far).
--- phase 32
129 25:32 remember    work              | sever_waitstill: no result yet (0:15 of effort so far).
130 25:47 waitstill   relay remember    | waitstill tells remember what they know.
      -> deliverance waitstill tells remember what they know.
      -> remember    waitstill tells remember what they know.
131 26:02 remember    work              | sever_waitstill: no result yet (0:30 of effort so far).
132 26:17 remember    work              | sever_waitstill: no result yet (0:45 of effort so far).
133 26:32 remember    work              | Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
      -> deliverance Waitstill's scream leaves the fire.; sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
      -> waitstill   Waitstill's scream leaves the fire.
      -> mindwell    sever_waitstill is solved.; The mark on waitstill goes out. Waitstill is safe.
134 26:47 remember    work              | sever_mindwell: no result yet (0:15 of effort so far).
--- phase 33
135 26:47 deliverance work              | sever_mindwell: no result yet (0:15 of effort so far).
136 27:02 mindwell    relay deliverance 
      -> deliverance mindwell tells deliverance what they know.
      -> waitstill   mindwell tells deliverance what they know.
      -> remember    mindwell tells deliverance what they know.
137 27:17 deliverance work              | sever_mindwell: no result yet (0:30 of effort so far).
138 27:32 deliverance work              | sever_mindwell: no result yet (0:45 of effort so far).
139 27:47 deliverance work              | Mindwell's scream leaves the fire.; sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
      -> waitstill   Mindwell's scream leaves the fire.
      -> mindwell    sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
      -> remember    Mindwell's scream leaves the fire.; sever_mindwell is solved.; The mark on mindwell goes out. Mindwell is safe.
140 27:47 deliverance work             !! nobody here knows what sever_remember asks for; examine it or get it relayed
--- phase 34
141 28:07 mindwell    examine           | You take in the clue for sever_remember.
142 28:22 mindwell    work              | sever_remember: no result yet (0:15 of effort so far).
143 28:37 mindwell    work              | sever_remember: no result yet (0:30 of effort so far).
144 28:52 mindwell    work              | sever_remember: no result yet (0:45 of effort so far).
145 29:07 mindwell    work              | sever_remember is solved.; The mark on remember goes out. Remember is safe.
      -> deliverance Remember's scream leaves the fire.; sever_remember is solved.; The mark on remember goes out. Remember is safe.
      -> waitstill   Remember's scream leaves the fire.
      -> remember    Remember's scream leaves the fire.; sever_remember is solved.; The mark on remember goes out. Remember is safe.
== WON == You won because you cut all four children's hold before the fire took any of them, at 29:07 with 4:35 of the soundtrack left.
total 29:07; stages: opening 2:00, deliverance 3:58, seance 0:30, waitstill 3:52, seance 0:30, mindwell 5:00, seance 0:30, remember 4:20, seance 0:30, turn 2:30, finale 5:25; hints 6
  finale curse:deliverance 22:12 deliverance=gloved waitstill=- mindwell=- remember=-
  finale curse:waitstill  22:42 deliverance=gloved waitstill=blindfolded mindwell=- remember=-
  finale curse:mindwell   23:12 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=-
  finale curse:remember   23:42 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_deliverance 25:17 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_waitstill  26:32 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_mindwell   27:47 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
  finale sever_remember   29:07 deliverance=gloved waitstill=blindfolded mindwell=muffled remember=silenced
```
