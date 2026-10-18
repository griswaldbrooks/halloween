# Rescue playtest — 2026-10-08

Rescue can produce a clear win and a clear loss at the table. This proposal does not yet produce four essential players. It also leaves the husband's motive outside the winning action and takes 26:56 to win against the 20-minute target.

I played all four seats through the JSON-lines protocol, choosing actions from observations. I did not use `sim.py bot`. The unchanged group investigation reached question 12 at 22:56. The unchanged split investigation reached question 1 at 3:40. Both used seed 0 and default jitter, 0.7–1.6. The split run ended at the first undefined rule; it did not complete four spokes.

## 1. PROPOSAL: intention, failure, victory

**She now intends to hold her children within the recreated fire.**

**If the players fail, the unrescued children's keepsakes remain in the fire-marked center as the fire reaches its endpoint; the medium names how many remain caught, then ends the séance.**

**The players win when they transfer all four keepsakes to the safe edge of the séance table and the seated receiver accepts the fourth before the fire ends.**

**Medium's objective — PROPOSAL:** “She is holding her children in this fire; free their spirits, not their past lives: before the fire ends, bring all four keepsakes from its center to Waitstill at the safe table edge; name one, point it out, carry it, and let Waitstill receive it; each safe keepsake loses its flame light and its scream, and the fourth ends the fire.”

“Rescue” frees the current manifestations from the recreation. It does not resurrect the children or change their historical deaths. This selects the rescue interpretation already proposed in the immersive report. It adds no historical event, character, code, or puzzle. Why the mother wants to hold them, and why transferring a keepsake defeats that intention, still need dramatic support. A rules announcement alone is weak support.

## 2. Part 1: play as written

The engine, config, and CLI were unchanged during both baseline runs. `diff -q` confirmed the engine and config matched the source before Part 2. The driver is a seat selector, not a game solver: it submits my actions, waits unused seats, and optionally repeats `work` until the player's observation reports a solve or offers a hint. Every input and output was saved. The actions below include errors and wasted work.

| Stage | What happened in player terms | Evidence |
|---|---|---|
| Opening, 2:00 | I was told to find the children. I could pick any spoke; the fiction did not say why this one should come first. Nobody had a playable opening job. | Initial observation: “The mother asks: find my children; discover what became of them.” Legal actions include all four rooms. |
| Deliverance | I tried working before examining and was refused. I then handed reading and manipulation to different seats. That let more people act, but supplied no advantage and left Mindwell waiting. | `baseline-group.txt:2`: “nobody here knows what deliverance_1 asks for; examine it or get it relayed.” At 4:15 Waitstill reads; 4:30 relays; Remember operates. |
| Waitstill | Mindwell asked for help immediately after reading. The medium refused because we had not accumulated effort. Later I examined the same clue again while uncertain, wasting 20 seconds. The hint gate measures labor, not confusion. | `baseline-group.txt:89`: 7:36 hint refused at 0:00 effort. At 8:36 the first step still reports no result after 60 seconds; at 9:01 it solves after the extra examination and only another ~4.7 seconds of work. |
| Mindwell | Waitstill did the entire spoke. The other three could wait through it. Two hints arrived after a minute of work on each step, but “Hint for mindwell_1” contains no usable clue or fictional reason. | `baseline-group.txt:164` onward: Waitstill examines, works, hints twice, takes relic. |
| Remember | Deliverance did the entire spoke. Remember, the named child’s player, had no necessary job. The reveal only says “part of what happened”; it cannot support an inference about the father's motive. | `baseline-group.txt:230` onward; role/fate reveal at 19:56. |
| Hub returns | Placing relics accumulated objects. The first three returns did not change the mother's visible belief or open a clearly new job. We selected the next room ourselves. | Places at 6:56, 11:17, 15:53; observations show the growing relic list. |
| Turn | We applied all four curses. Then I could not tell what to pick up, where to take it, or why moving it would rescue a dead child. | At 22:56: question 12, “What object or signal stands for each child in the fire, and where must it be taken for that child to count as out?” |
| Split investigation | All four went to separate spokes, read, and worked. Everyone had a job. Deliverance requested a hint at 3:40 and the simulation stopped before anyone received one. | `baseline-split.txt:25`: question 1, “Where is the medium when the players are in different rooms?” |

Hint timing evidence is limited. Five hints were taken in the group run. One request was too early for the engine; whether it was too early for a real confused guest is untested. On Waitstill's first step, the available hint would have cost 15 seconds when less than five seconds of effort remained. The apparent hint can be slower than continuing. No run established a helpful late-hint threshold. The split hint never arrived because its location is undefined.

These are duration placeholders, not real puzzles. We cannot infer puzzle difficulty, actual reading speed, fear, or four humans' behavior from them.

Two engine limitations affect the evidence:

- `engine.py:167` filters events by faculty but not event time. Waitstill can see the next step and examine it at 4:15 although Deliverance solved the prior step at 4:08 after starting that final work at 3:55; Waitstill's examination therefore began before the solve. I left that baseline behavior intact. Group totals are model outputs, not rehearsal measurements.
- `engine.py:470` broadcasts an all-channel objective note. Baseline Mindwell has no `hears`, but receives `notices: ["Objective: Get the children out of the burning house."]`. This contradicts the source report's claim that the objective is wholly missed. The proposal explicitly supplies print, rather than relying on that leak.
- The baseline split stage summary labels all 100 seconds of concurrent investigation “remember.” That is a reporting artifact from a single shared stage list. Each player actually traveled for 20 seconds, examined for 20, and worked for 60.

## 3. Complete list of added rules

Q numbers refer to the engine report §3. Captain calls are tested assumptions, not adopted decisions. Designer choices below remain disposable. No answer was added for Q1–3, or for the other finale directions.

| Rule added or explicitly retained | Question answered | Owner |
|---|---|---|
| The mother holds the manifestations in this recreation; rescue releases them without changing the past. | Q12: what does rescuing historically dead children mean? | Captain call |
| Existing child keepsakes represent the manifestations. The fire-marked center is danger; the outer table edge beside seated Waitstill is safe. Every object remains within a stationary table operation. | Q12: representation and destination | Captain call for the symbolism; designer choice for layout |
| Four public actions form one transaction: name → point → carry → receive. Any unrescued child may go first; only one is in transit. A new name before carrying resets that transaction's communication. | Q12: available actions and acceptance | Designer choice |
| `name child` needs sight and voice. Hearing players learn which child to expect; the speaker also knows. `point child` needs hands, sight, and receipt of the spoken name. Sighted players then know which keepsake to carry. | Q6 and Q7: transmitting with hearing and voice curses | Designer choice |
| `carry child` needs sight, hands, and the pointing cue. It moves only the keepsake to the fixed receiving place. `receive child` needs hands, hearing, voice, the spoken identity, and a different carrier; tactile receipt plus placing outside the fire and saying its name confirms safety. | Q12: what counts as out; accessible blind contribution | Designer choice |
| Pointing to a named existing keepsake is the only new player communication channel. It is taught at the opening. The finale objective is both spoken and printed. There is no gesture alphabet or private code. | Q6, Q7 | Designer choice |
| Each successful action costs the existing 15-second relay interval and advances all four clocks together. Failed prerequisites cost no time, as in the engine. Untimed instruction text is a simulation limitation. | Q12: transaction duration; Q4: time accounting | Designer choice; estimate, not measurement |
| Keep the default 600-second deadline starting at the fourth placement. The 150-second turn consumes it, leaving 450 seconds for action. Completion at the exact deadline loses. | Q4: timer start and deadline boundary | Captain call for timer start/length; designer choice for tie rule |
| Fire progression is independent of rescues. Start: spreading fire. Warnings at five, two, and one minute remaining use speech and visible text. These stand for staged sound/light progression; a child count is progress toward rescue, not the fire clock. | Q12: observable mother's progress; Q4 | Designer choice |
| Safe placements persist. Each produces tactile receipt, spoken SAFE, a changed light state, and loss of that child's scream. All four safe wins immediately on the fourth receipt; no extra testimony or epilogue gate. | Q8: winning action; Q12: progress feedback | Captain call for the victory condition; designer choice for cues |
| At expiry, unrescued keepsakes remain fire-marked, the fire swells then stops, and the medium states rescued/remaining counts. Already safe children stay safe. Full objective is lost even at 3/4. Both endings restore ordinary light and instruct removal of curses before exit. | Q5: physical/visible failure and conclusion | Captain call for fictional consequence; designer choice for staging |

This substitutes a rescue transaction for the floated prop chain; it does not claim to solve that chain's whisper box or testimony. Normal spoken `relay` is unchanged. `point` is a narrow additional action. No new spoken testimony or puzzle solution was invented.

## 4. Win, loss, and timing

Both finale runs replay the actual baseline-group investigation inputs, including mistakes and five hints, then continue interactively with the proposal enabled. All four curses remain active at every rescue and both terminal states. Neither run removes a curse to win. All cursed Waitstill observations remain in `seance`, with no visual observations. All cursed Mindwell observations have no auditory observations.

The loss is a deliberate deadline stress test, not evidence that an ordinary team would lose. After two rescues I tried leaving the table and receiving an undelivered keepsake, then deliberately waited. The clock advanced 4:10 before the next action began. I resumed, saved a third child, and ran out during the fourth transfer. This tests persistent partial success and a late rescue attempt.

| Stage | Group baseline | Split baseline | Rescue win | Rescue loss |
|---|---:|---:|---:|---:|
| Opening | 2:00 | 2:00 | 2:00 | 2:00 |
| Deliverance spoke, including outward walk and reveal | 4:26 | 1:40 concurrent, unfinished | 4:26 | 4:26 |
| Waitstill spoke | 3:51 | 1:40 concurrent, unfinished | 3:51 | 3:51 |
| Mindwell spoke | 4:07 | 1:40 concurrent, unfinished | 4:07 | 4:07 |
| Remember spoke | 4:03 | 1:40 concurrent, unfinished | 4:03 | 4:03 |
| Four return walks + placements | 2:00 | — | 2:00 | 2:00 |
| Turn and curses | 2:30 | — | 2:30 | 2:30 |
| Playable finale | stopped Q12 | not reached | 4:00 | 7:30 |
| Total, clock floored to whole second | **22:56** | **3:40** | **26:56** | **30:26** |
| Outcome | undefined Q12 | undefined Q1 | won, 4/4 | lost, 3/4 |

Stage durations above round to the nearest second; exact total is 1376.936227 seconds before finale, 1616.936227 at win, 1826.936227 at loss. The timer begins at 20:26.936227. Action timestamps include subsequent automatic invocation time; curse log timestamps identify when each curse actually landed.

### Win transcript, finale only

```text
22:56 deliverance carry deliverance |  ERROR: this action requires hands
23:11 deliverance name deliverance | deliverance names deliverance and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
23:11 mindwell carry deliverance |  ERROR: someone must point out the named keepsake first
23:26 remember point deliverance | remember points to deliverance; sighted players can carry that keepsake. No speech.
23:41 mindwell carry deliverance | mindwell carries deliverance within reach of the seated receiver at the safe edge; not yet rescued.
23:56 waitstill receive deliverance | waitstill receives deliverance by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. 1/4 safe.
24:11 deliverance name waitstill | deliverance names waitstill and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
24:26 remember point waitstill | remember points to waitstill; sighted players can carry that keepsake. No speech.
24:41 mindwell carry waitstill | mindwell carries waitstill within reach of the seated receiver at the safe edge; not yet rescued.
24:56 waitstill receive waitstill | waitstill receives waitstill by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. 2/4 safe.
25:11 deliverance name mindwell | deliverance names mindwell and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
25:26 remember point mindwell | Fire spreading; five minutes remain. Safe keepsakes stay safe. Spoken warning and matching visible warning.; Fire spreading; five minutes remain. Safe keepsakes stay safe. Spoken warning and matching visible warning.; remember points to mindwell; sighted players can carry that keepsake. No speech.
25:41 mindwell carry mindwell | mindwell carries mindwell within reach of the seated receiver at the safe edge; not yet rescued.
25:56 waitstill receive mindwell | waitstill receives mindwell by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. 3/4 safe.
26:11 deliverance name remember | deliverance names remember and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
26:26 remember point remember | remember points to remember; sighted players can carry that keepsake. No speech.
26:41 mindwell carry remember | mindwell carries remember within reach of the seated receiver at the safe edge; not yet rescued.
26:56 waitstill receive remember | waitstill receives remember by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. 4/4 safe.; The fourth keepsake is safe. All fire light and fire audio stop now. All four spirits are out of this fire; their historical deaths have not changed. Ordinary light returns; remove the curses before leaving.
```

### Loss transcript, finale only

```text
23:11 deliverance name deliverance | deliverance names deliverance and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
23:26 remember point deliverance | remember points to deliverance; sighted players can carry that keepsake. No speech.
23:41 mindwell carry deliverance | mindwell carries deliverance within reach of the seated receiver at the safe edge; not yet rescued.
23:56 waitstill receive deliverance | waitstill receives deliverance by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. 1/4 safe.
24:11 deliverance name waitstill | deliverance names waitstill and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
24:26 remember point waitstill | remember points to waitstill; sighted players can carry that keepsake. No speech.
24:41 mindwell carry waitstill | mindwell carries waitstill within reach of the seated receiver at the safe edge; not yet rescued.
24:56 waitstill receive waitstill | waitstill receives waitstill by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. 2/4 safe.
24:56 deliverance go mindwell |  ERROR: waitstill may not move through the house while blindfolded (handoff 8 safety note); the group cannot leave together
24:56 waitstill receive mindwell |  ERROR: a different player must carry the named keepsake to you first
25:26 remember wait  | Fire spreading; five minutes remain. Safe keepsakes stay safe. Spoken warning and matching visible warning.; Fire spreading; five minutes remain. Safe keepsakes stay safe. Spoken warning and matching visible warning.
28:26 remember wait  | Fire closing around the remaining keepsakes; two minutes remain. Safe keepsakes stay safe. Spoken warning and matching visible warning.; Fire closing around the remaining keepsakes; two minutes remain. Safe keepsakes stay safe. Spoken warning and matching visible warning.
29:21 deliverance name mindwell | deliverance names mindwell and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
29:36 remember point mindwell | Final fire surge; one minute remains. Safe keepsakes stay safe. Spoken warning and matching visible warning.; Final fire surge; one minute remains. Safe keepsakes stay safe. Spoken warning and matching visible warning.; remember points to mindwell; sighted players can carry that keepsake. No speech.
29:51 mindwell carry mindwell | mindwell carries mindwell within reach of the seated receiver at the safe edge; not yet rescued.
30:06 waitstill receive mindwell | waitstill receives mindwell by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. 3/4 safe.
30:21 deliverance name remember | deliverance names remember and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.
30:26 remember point remember | The fire reaches its end. Unrescued keepsakes remain in the flame light; safe keepsakes remain outside it. The fire swells, then stops.; 3 of four freed. Those left in the fire remain caught in this recreation. The seance is over. Ordinary light returns; remove the curses before leaving.; The fire reaches its end. Unrescued keepsakes remain in the flame light; safe keepsakes remain outside it. The fire swells, then stops.; 3 of four freed. Those left in the fire remain caught in this recreation. The seance is over. Ordinary light returns; remove the curses before leaving.
```

Duplicate speech/visual entries below represent two channels for one cue. Warnings crossed within an action appear when that action finishes; the one-minute cue in the loss is ten seconds late. A physical master timeline must fire warnings on time instead of copying this simulation's action-boundary scheduling.

## 5. Verdict and three improvements

The direction works as a rescue procedure with observable results. It does not yet work as the full intended game.

- **Shared final act:** yes at the structural level. Four transactions converge on one fourth receipt; everyone is at the table. Waitstill experiences it by touch and sound instead of watching. No post-win lore scene delays the result. This meets escape report §4.3 item 2's shared climax, but the repeated procedure contains no puzzle or recurring judgment.
- **Staged failure:** yes in text. The loss has warnings, preserved partial successes, a terminal sound/light cue, and an explicit 3/4 result. This addresses §4.3 item 5. No equipment or live performance was tested.
- **Curses redistribute work:** partly. Deliverance sees/names, Remember hears/points, Mindwell sees/carries, Waitstill hears/receives. Each did four useful actions in the winning run. Between actions, each waits roughly 45 seconds per child. The engine treats gloves as no hands, which is stronger than bulky gloves inhibiting dexterity.
- **Four essential players:** no. I played two further protocol runs, first replacing every Mindwell carry with Remember, then replacing every Deliverance name with Mindwell. Both still won at 26:56. The curse roles are usable, but gloved Deliverance or muffled Mindwell can be bypassed. Adding a rule that only a named player may do a task would conceal that weakness.
- **Blind player at table:** yes throughout both finales and both bypass runs. Tactile receipt is essential under these proposed prerequisites. Fixed reach, actual furniture, comfort, and cue audibility still need rehearsal.
- **Fiction drives actions:** partly. Existing keepsakes connect investigation to rescue, but the safe edge is an asserted supernatural boundary. Why saying the child's name and handing over a token frees a spirit is not established. Mandatory pointing also makes carrying depend on a relay even when a sighted person could identify the keepsake directly. These are procedure costs, not discovered puzzle logic.
- **Last revelation changes victory:** no. Neither win needs the husband's motive. No supplied spoke reveals it. This fails the handoff's condensed-finale requirement and immersive report line 415. I did not import the vengeance direction or invent a letter to patch it.

The three changes that would most improve this direction:

1. Settle whether freeing manifestations is the accepted meaning of rescue, and whether the father's motive must change the winning action. If it must, this prototype is incomplete at its foundation. Do not add a reconciliation speech after victory and call the requirement met.
2. Rehearse the four cursed roles at the real table and eliminate bypasses through useful responsibilities, not arbitrary exclusive permissions. Confirm that the safe edge and feedback mean “rescued,” not “dead again.” The two successful three-player runs are the regression cases.
3. Allocate the twenty minutes before adding content. This investigation already takes 20:27 before the turn. A four-minute rescue plus this 2:30 turn leaves only 13:30 for opening/investigation. The current opening/investigation must lose about 6:57, or the total target must grow. Do not shorten the finale to cover that overshoot.

Captain-owned choices remain in the existing `halloween-2026-review` task: which finale intention/failure/win to accept; what role the husband's motive plays; and the total/finale time allocation. Its existing captain hold cites the handoff questions and the unknowns ledger. This report offers evidence for that decision, not a new decision requiring this scout to stop. No captain decision was taken here.

## 6. Scratch files, reproduction, and checks

All scratch files are under `/home/griswald/.treehouse/halloween-ff9827/5/halloween`. No tracked repository file, storyboard, shared engine, or design note was edited. No browser session, GitHub operation, commit, push, or PR was used.

Commands used:

```sh
cp -r /media/griswald/wd-black-2tb/personal/firstmate/data/hw-sim-engine ./sim
python3 evidence/play_session.py baseline-group --seed 0
python3 evidence/play_session.py baseline-split --seed 0 --set GROUP_MOVES_TOGETHER=False
REPLAY=evidence/baseline-group.jsonl python3 evidence/play_session.py rescue-win --seed 0 --finale rescue_proposal
REPLAY=evidence/baseline-group.jsonl python3 evidence/play_session.py rescue-loss --seed 0 --finale rescue_proposal
python3 evidence/audit.py
cd sim
python3 -m unittest test_engine
```

The seat driver launches `python3 sim/sim.py protocol --variant rescue` with the shown flags. `seat PLAYER` exposes only that player's observation. `effort` is a driver shorthand for repeated work; it adds no engine rule. Idle seats emit ordinary `wait` commands.

Checks: the 17 original engine tests passed. The trace audit passed cursed-channel and stationary-blind checks for all six runs and verified both proposal endings have no undefined rules. The two bypass runs won. These checks verify simulation behavior, not theatrical feasibility. No rescue win rate is claimed from one seed and deliberate loss.

| File | Purpose |
|---|---|
| `sim/rescue.py:5` | Objective; subclass adds proposal actions, accessible signals, deadline, win/loss |
| `sim/sim.py:20` | Adds `rescue_proposal` option and dispatch; other finale modes retain original engine |
| `sim/engine.py`, `sim/config.py` | Unmodified source copy |
| `evidence/play_session.py` | Protocol seat driver with complete input/output recording |
| `evidence/baseline-group.{jsonl,txt}` | Actual group investigation, waits/errors included |
| `evidence/baseline-split.{jsonl,txt}` | Actual split investigation to Q1 |
| `evidence/rescue-win.{jsonl,txt}`, `evidence/rescue-loss.{jsonl,txt}` | Full investigations plus finales |
| `evidence/bypass-{mindwell,deliverance}.jsonl` | Counterexamples to four-player necessity |
| `evidence/audit.py`, `evidence/audit.txt` | Replay and channel/stationarity audit |
| `evidence/{sim,rescue}.patch` | Complete proposal changes, also embedded below |

Completion gate: read and applied `/media/griswald/wd-black-2tb/personal/firstmate/.agents/skills/captain-hold-lifecycle/SKILL.md`. Ran `FM_HOME=/media/griswald/wd-black-2tb/personal/firstmate /media/griswald/wd-black-2tb/personal/firstmate/bin/fm-captain-hold.sh complete hw-play-rescue halloween-2026-review`. Result: `complete: hw-play-rescue captain-call inventory reviewed (halloween-2026-review)`. No new captain task was created and no existing decision was closed.

Nothing here should ship as a settled game. The engine owner should separately address future-event visibility, the all-channel objective leak, and concurrent stage reporting. Those are observed model issues, not rescue design choices; they were not fixed in Part 1.

Sources read in order: engine README/report; design handoff §§7–13; escape research report §4; immersive research report “What this means for our game”; unknowns ledger “Answer these first.” All are under `/media/griswald/wd-black-2tb/personal/firstmate/data/`. Relevant exact locations: `hw-sim-engine/report.md` §3 Q1/Q4–8/Q12; `hw-research-escape-design/report.md:303`; `hw-research-immersive/report.md:337`, `:347`, `:415`, `:417`; `hw-unknowns-ledger/report.md:277`. This uses the supplied research synthesis; it makes no new external research claim.

### Baseline transcripts, idle lines removed

**baseline-group**

```text
2:20 deliverance go deliverance | deliverance, waitstill, mindwell, remember arrive in deliverance.
2:20 deliverance work  |  ERROR: nobody here knows what deliverance_1 asks for; examine it or get it relayed
2:40 deliverance examine  | You take in the clue for deliverance_1.
2:55 deliverance work  | deliverance_1: no result yet (0:15 of effort so far).
3:10 deliverance work  | deliverance_1: no result yet (0:30 of effort so far).
3:25 deliverance work  | deliverance_1: no result yet (0:45 of effort so far).
3:40 deliverance work  | deliverance_1: no result yet (1:00 of effort so far).
3:55 deliverance hint  | Hint for deliverance_1.
4:08 deliverance work  | deliverance_1 is solved.
4:15 waitstill examine  | You take in the clue for deliverance_2.
4:30 waitstill relay remember | waitstill tells remember what they know.
4:45 remember work  | deliverance_2: no result yet (0:15 of effort so far).
5:00 remember work  | deliverance_2: no result yet (0:30 of effort so far).
5:15 remember work  | deliverance_2: no result yet (0:45 of effort so far).
5:30 remember work  | deliverance_2: no result yet (1:00 of effort so far).
5:45 remember hint  | Hint for deliverance_2.
6:26 remember work  | deliverance_2 is solved.; Role revealed: deliverance was the hands of the network.; Fate revealed: part of what happened to deliverance.; remember takes deliverance_relic.
6:46 remember go seance | deliverance, waitstill, mindwell, remember arrive in seance.
6:56 remember place  | remember places deliverance_relic on the table.
7:16 waitstill go waitstill | deliverance, waitstill, mindwell, remember arrive in waitstill.
7:36 mindwell examine  | You take in the clue for waitstill_1.
7:36 mindwell hint  |  ERROR: the medium does not offer a hint yet (0:00 of effort on waitstill_1 since the last hint; she waits for 1:00)
7:51 mindwell work  | waitstill_1: no result yet (0:15 of effort so far).
8:06 mindwell work  | waitstill_1: no result yet (0:30 of effort so far).
8:21 mindwell work  | waitstill_1: no result yet (0:45 of effort so far).
8:36 mindwell work  | waitstill_1: no result yet (1:00 of effort so far).
8:56 mindwell examine  | You take in the clue for waitstill_1.
9:01 mindwell work  | waitstill_1 is solved.
9:21 mindwell examine  | You take in the clue for waitstill_2.
9:36 mindwell work  | waitstill_2: no result yet (0:15 of effort so far).
9:51 mindwell work  | waitstill_2: no result yet (0:30 of effort so far).
10:06 mindwell work  | waitstill_2: no result yet (0:45 of effort so far).
10:47 mindwell work  | waitstill_2 is solved.; Role revealed: waitstill was the eyes of the network.; Fate revealed: part of what happened to waitstill.; mindwell takes waitstill_relic.
11:07 mindwell go seance | deliverance, waitstill, mindwell, remember arrive in seance.
11:17 mindwell place  | mindwell places waitstill_relic on the table.
11:37 mindwell go mindwell | deliverance, waitstill, mindwell, remember arrive in mindwell.
11:57 waitstill examine  | You take in the clue for mindwell_1.
12:12 waitstill work  | mindwell_1: no result yet (0:15 of effort so far).
12:27 waitstill work  | mindwell_1: no result yet (0:30 of effort so far).
12:42 waitstill work  | mindwell_1: no result yet (0:45 of effort so far).
12:57 waitstill work  | mindwell_1: no result yet (1:00 of effort so far).
13:12 waitstill hint  | Hint for mindwell_1.
13:16 waitstill work  | mindwell_1 is solved.
13:36 waitstill examine  | You take in the clue for mindwell_2.
13:51 waitstill work  | mindwell_2: no result yet (0:15 of effort so far).
14:06 waitstill work  | mindwell_2: no result yet (0:30 of effort so far).
14:21 waitstill work  | mindwell_2: no result yet (0:45 of effort so far).
14:36 waitstill work  | mindwell_2: no result yet (1:00 of effort so far).
14:51 waitstill hint  | Hint for mindwell_2.
15:23 waitstill work  | mindwell_2 is solved.; Role revealed: mindwell was the ears of the network.; Fate revealed: part of what happened to mindwell.; waitstill takes mindwell_relic.
15:43 waitstill go seance | deliverance, waitstill, mindwell, remember arrive in seance.
15:53 waitstill place  | waitstill places mindwell_relic on the table.
16:13 remember go remember | deliverance, waitstill, mindwell, remember arrive in remember.
16:33 deliverance examine  | You take in the clue for remember_1.
16:48 deliverance work  | remember_1: no result yet (0:15 of effort so far).
17:03 deliverance work  | remember_1: no result yet (0:30 of effort so far).
17:18 deliverance work  | remember_1: no result yet (0:44 of effort so far).
17:33 deliverance work  | remember_1: no result yet (0:59 of effort so far).
17:48 deliverance work  | remember_1: no result yet (1:14 of effort so far).
18:03 deliverance hint  | Hint for remember_1.
18:08 deliverance work  | remember_1 is solved.
18:28 deliverance examine  | You take in the clue for remember_2.
18:43 deliverance work  | remember_2: no result yet (0:15 of effort so far).
18:58 deliverance work  | remember_2: no result yet (0:30 of effort so far).
19:13 deliverance work  | remember_2: no result yet (0:45 of effort so far).
19:56 deliverance work  | remember_2 is solved.; Role revealed: remember was the voice of the network.; Fate revealed: part of what happened to remember.; deliverance takes remember_relic.
20:16 deliverance go seance | deliverance, waitstill, mindwell, remember arrive in seance.
21:11 deliverance place  | The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; deliverance places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
21:41 deliverance curse  | Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
22:11 waitstill curse  | Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
22:41 mindwell curse  | mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
22:56 remember curse  | Get the children out of the burning house.; remember is now silenced.; You apply your curse: you are silenced.; Objective: Get the children out of the burning house.
```
**baseline-split**

```text
2:20 deliverance go deliverance | deliverance arrives in deliverance.
2:20 waitstill go waitstill | waitstill arrives in waitstill.
2:20 mindwell go mindwell | mindwell arrives in mindwell.
2:20 remember go remember | remember arrives in remember.
2:40 deliverance examine  | You take in the clue for deliverance_1.
2:40 waitstill examine  | You take in the clue for waitstill_1.
2:40 mindwell examine  | You take in the clue for mindwell_1.
2:40 remember examine  | You take in the clue for remember_1.
2:55 deliverance work  | deliverance_1: no result yet (0:15 of effort so far).
2:55 waitstill work  | waitstill_1: no result yet (0:15 of effort so far).
2:55 mindwell work  | mindwell_1: no result yet (0:15 of effort so far).
2:55 remember work  | remember_1: no result yet (0:15 of effort so far).
3:10 deliverance work  | deliverance_1: no result yet (0:30 of effort so far).
3:10 waitstill work  | waitstill_1: no result yet (0:30 of effort so far).
3:10 mindwell work  | mindwell_1: no result yet (0:30 of effort so far).
3:10 remember work  | remember_1: no result yet (0:30 of effort so far).
3:25 deliverance work  | deliverance_1: no result yet (0:45 of effort so far).
3:25 waitstill work  | waitstill_1: no result yet (0:45 of effort so far).
3:25 mindwell work  | mindwell_1: no result yet (0:45 of effort so far).
3:25 remember work  | remember_1: no result yet (0:45 of effort so far).
3:40 deliverance work  | deliverance_1: no result yet (1:00 of effort so far).
3:40 waitstill work  | waitstill_1: no result yet (1:00 of effort so far).
3:40 mindwell work  | mindwell_1: no result yet (1:00 of effort so far).
3:40 remember work  | remember_1: no result yet (1:00 of effort so far).
3:40 deliverance hint  | 
```

### Complete proposal patch

The report survives teardown; this patch preserves the rules. Apply to a fresh scratch copy of the provided engine. Use `python3 sim.py play --variant rescue --finale rescue_proposal` or the protocol. New protocol actions use `to` for the child, e.g. `{"player":"remember","action":"point","to":"deliverance"}`. No puzzle files are needed.

```diff
--- /media/griswald/wd-black-2tb/personal/firstmate/data/hw-sim-engine/sim.py	2026-10-08 19:53:09.096951491 -0400
+++ sim/sim.py	2026-10-08 20:04:57.698684930 -0400
@@ -17,6 +17,8 @@
 import config as C
 import engine as E
 
+E.FINALE_PRESETS['rescue_proposal'] = []
+
 HERE = os.path.dirname(os.path.abspath(__file__))
 
 
@@ -229,7 +231,11 @@
         for func, q in questions():
             print("%-14s %s" % (func, q))
         return
-    game = E.Game(args.variant, args.seed, args.finale)
+    if args.finale == 'rescue_proposal':
+        from rescue import RescueGame
+        game = RescueGame(args.variant, args.seed)
+    else:
+        game = E.Game(args.variant, args.seed, args.finale)
     if args.mode == "play":
         play(game)
     elif args.mode == "protocol":
--- /dev/null	2026-10-04 13:04:26.040801784 -0400
+++ sim/rescue.py	2026-10-08 20:05:26.428225792 -0400
@@ -0,0 +1,124 @@
+"""PROPOSAL only. Rescue transactions, no added puzzles or historical facts."""
+import config as C
+from engine import Game, Illegal, HUB, CHILDREN, fmt
+
+OBJECTIVE = ('She is holding her children in this fire; free their spirits, not their past lives: '
+             'before the fire ends, bring all four keepsakes from its center to Waitstill at '
+             'the safe table edge; name one, point it out, carry it, and let Waitstill receive it; '
+             'each safe keepsake loses its flame light and its scream, and the fourth ends the fire.')
+
+class RescueGame(Game):
+    def __init__(self, variant='rescue', seed=0):
+        if variant != 'rescue':
+            raise ValueError('rescue_proposal requires --variant rescue')
+        self.safe = []
+        self.target = None
+        self.named = set()
+        self.pointed = set()
+        self.carrier = None
+        self.warnings = set()
+        super().__init__(variant, seed, 'none')
+        self.say('medium', HUB, 'At this table, a name may be passed by speech or by pointing to its keepsake; silence does not forbid pointing. The outer edge beside Waitstill is outside the fire display. Keep Waitstill seated there.')
+
+    def signal(self, text):
+        self.say('medium', HUB, text)
+        self.emit('sight', HUB, text, None, 'eyes')
+
+    def invoke_next(self):
+        if self.to_invoke:
+            return super().invoke_next()
+        self.invoked = None
+        self.phase = 'finale'
+        if C.FIRE_TIMER_STARTS == 'after_curses':
+            self.deadline = self.now() + C.FIRE_TIMER_SECONDS
+        self.stages.append(('finale', self.now()))
+        self.signal(OBJECTIVE + ' The instruction is also printed at the table.')
+        self.signal('Fire spreading: all four keepsakes remain in the fire. Rescue any child first. Safe placements persist; the fire clock does not reset.')
+
+    def sight(self, p):
+        out = super().sight(p)
+        if self.phase == 'finale':
+            out += [OBJECTIVE, 'Safe: ' + (', '.join(self.safe) or 'none'),
+                    'Still in fire: ' + ', '.join(c for c in CHILDREN if c not in self.safe)]
+        return out
+
+    def legal(self, p):
+        if self.phase != 'finale':
+            return super().legal(p)
+        if self.over or self.next_player() is not p:
+            return []
+        return ['wait', 'name <child>', 'point <child>', 'carry <child>', 'receive <child>']
+
+    def advance(self, players, seconds):
+        if self.phase != 'finale':
+            return super().advance(players, seconds)
+        end = max(p.t for p in players) + seconds
+        # Exact deadline belongs to defeat, not an ambiguous last-moment win.
+        if end >= self.deadline:
+            for p in self.players.values(): p.t = self.deadline
+            self.signal('The fire reaches its end. Unrescued keepsakes remain in the flame light; safe keepsakes remain outside it. The fire swells, then stops.')
+            self.signal(f'{len(self.safe)} of four freed. Those left in the fire remain caught in this recreation. The seance is over. Ordinary light returns; remove the curses before leaving.')
+            self.lose(f'the fire ended with {4-len(self.safe)} children still in it; {len(self.safe)} remain rescued')
+            return False
+        for p in players: p.t = end
+        for remaining, text in [(300, 'Fire spreading; five minutes remain.'), (120, 'Fire closing around the remaining keepsakes; two minutes remain.'), (60, 'Final fire surge; one minute remains.')]:
+            if end >= self.deadline - remaining and remaining not in self.warnings:
+                self.warnings.add(remaining)
+                self.signal(text + ' Safe keepsakes stay safe. Spoken warning and matching visible warning.')
+        return True
+
+    def require(self, p, child, faculties):
+        if self.phase != 'finale' or p.room != HUB:
+            raise Illegal('rescue happens at the seance table after all four curses')
+        if child not in CHILDREN or child in self.safe:
+            raise Illegal('choose a child still in the fire')
+        missing = set(faculties) - p.faculties
+        if missing: raise Illegal('this action requires ' + ', '.join(sorted(missing)))
+
+    def beat(self):
+        # One shared table transaction: nobody reads a future state on a past clock.
+        return self.advance(list(self.players.values()), C.RELAY_SECONDS)
+
+    def do_name(self, p, child):
+        self.require(p, child, ['eyes', 'voice'])
+        if self.carrier: raise Illegal('receive the carried keepsake first')
+        if not self.beat(): return
+        self.target = child
+        self.named = {q.id for q in self.present(HUB) if 'ears' in q.faculties} | {p.id}
+        self.pointed = set()
+        self.say(p.id, HUB, f'{p.id} names {child} and identifies its keepsake. A hearing player can now point it out; the blind receiver knows whose keepsake to expect.')
+
+    def do_point(self, p, child):
+        self.require(p, child, ['eyes', 'hands'])
+        if self.target != child or p.id not in self.named:
+            raise Illegal('hear a child named before pointing out its keepsake')
+        if not self.beat(): return
+        self.pointed = {q.id for q in self.present(HUB) if 'eyes' in q.faculties}
+        self.emit('sight', HUB, f'{p.id} points to {child}; sighted players can carry that keepsake. No speech.', None, 'eyes')
+
+    def do_carry(self, p, child):
+        self.require(p, child, ['eyes', 'hands'])
+        if self.target != child or p.id not in self.pointed:
+            raise Illegal('someone must point out the named keepsake first')
+        if self.carrier: raise Illegal('one keepsake is already in transit')
+        if not self.beat(): return
+        self.carrier = p.id
+        self.emit('sight', HUB, f'{p.id} carries {child} within reach of the seated receiver at the safe edge; not yet rescued.', None, 'eyes')
+        for q in self.present(HUB):
+            if 'hands' in q.faculties and q.id != p.id:
+                self.note(f'{child} is within reach at the fixed receiving place.', q.id)
+
+    def do_receive(self, p, child):
+        self.require(p, child, ['hands', 'ears', 'voice'])
+        if self.target != child or not self.carrier or self.carrier == p.id or p.id not in self.named:
+            raise Illegal('a different player must carry the named keepsake to you first')
+        if not self.beat(): return
+        self.safe.append(child)
+        self.signal(f'{p.id} receives {child} by touch, sets the keepsake outside the fire and says its name: SAFE. Its flame light goes out and its scream stops. {len(self.safe)}/4 safe.')
+        self.finale_log.append(('rescue:'+child, self.now(), {q.id:q.curse for q in self.players.values()}))
+        self.target, self.carrier = None, None
+        self.named, self.pointed = set(), set()
+        if len(self.safe) == 4:
+            self.signal('The fourth keepsake is safe. All fire light and fire audio stop now. All four spirits are out of this fire; their historical deaths have not changed. Ordinary light returns; remove the curses before leaving.')
+            self.over = dict(result='won', t=self.now(), why='You won because all four keepsakes reached the safe edge before the fire ended.')
+            self.stages.append(('end', self.now()))
```

### Replayable baseline inputs

Each `pid action [to]` below expands to a protocol object with `player`, `action`, and optional `to`. Consecutive identical actions are printed with `xN`; expand them N times. Waits are retained here so the unchanged baseline can be reproduced exactly. For proposal runs, replay the group list with `--finale rescue_proposal`, then use the finale transcript actions and wait unused seats as necessary.

**baseline-group**

```text
deliverance go deliverance
deliverance work
deliverance examine
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance hint
deliverance work
waitstill examine
mindwell wait
remember wait
deliverance wait
mindwell wait
remember wait
deliverance wait
waitstill relay remember
mindwell wait
deliverance wait x2
waitstill wait
mindwell wait
remember work
deliverance wait
waitstill wait
mindwell wait
deliverance wait
waitstill wait
mindwell wait
remember work
deliverance wait
waitstill wait
mindwell wait
deliverance wait
waitstill wait
mindwell wait
remember work
deliverance wait
waitstill wait
mindwell wait
deliverance wait
waitstill wait
mindwell wait
remember work
deliverance wait
waitstill wait
mindwell wait
deliverance wait
waitstill wait
mindwell wait
remember hint
deliverance wait
waitstill wait
mindwell wait
remember work
deliverance wait
waitstill wait
mindwell wait
remember go seance
deliverance wait
waitstill wait
mindwell wait
remember place
deliverance wait
waitstill go waitstill
deliverance wait
waitstill wait
mindwell examine
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell hint
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell examine
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell examine
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell work
deliverance wait
waitstill wait
mindwell go seance
deliverance wait
waitstill wait
mindwell place
remember wait
deliverance wait
waitstill wait
deliverance wait
waitstill wait
mindwell go mindwell
deliverance wait
waitstill examine
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill hint
deliverance wait
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill examine
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill work
mindwell wait
remember wait
deliverance wait x2
waitstill hint
deliverance wait
waitstill work
deliverance wait
waitstill go seance
deliverance wait
waitstill place
mindwell wait
remember go remember
deliverance examine
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance hint
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance examine
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
waitstill wait
mindwell wait
remember wait
deliverance work
deliverance go seance
deliverance place
deliverance curse
waitstill curse
mindwell curse
remember curse
```
**baseline-split**

```text
deliverance go deliverance
waitstill go waitstill
mindwell go mindwell
remember go remember
deliverance examine
waitstill examine
mindwell examine
remember examine
deliverance work
waitstill work
mindwell work
remember work
deliverance work
waitstill work
mindwell work
remember work
deliverance work
waitstill work
mindwell work
remember work
deliverance work
waitstill work
mindwell work
remember work
deliverance hint
```
