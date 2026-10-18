# Halloween 2026 text simulation: engine report

Task `hw-sim-engine`, 2026-10-08. Code and this report live in `/media/griswald/wd-black-2tb/personal/firstmate/data/hw-sim-engine/`. Nothing in the halloween repo was changed; no commits, pushes or PRs.

## What this is

A runnable Python model of the hub-and-spoke game as the 2026-10-07 handoff states it, and nothing beyond it. Four players with their own clocks in real seconds, a seance room and four children's rooms, abstract puzzle steps per child, the medium's hints, the relic table, the turn, the self-applied curses, the ten-minute fire soundtrack, the information rules of the four curses, and the four finale directions of handoff section 13 as pluggable variants. Where the handoff gives no rule the engine raises `Undefined("<question>")`, records it, and ends the run. The list of those questions is the main finding (section 3).

It is not the previous browser simulation rebuilt. That build modelled the rev 07 storyboard (nine rooms in a snake, an offering and curse economy, removals), which the handoff has superseded. What it got right still stands and this engine confirms it under the new structure: the opening and the reveals are scripted beats with no game in them, and the run length overshoots 20 minutes. What it got wrong for the captain's purpose was the form: a decision DAG you step through is not something you can play against. This engine is driven move by move by a person or an agent, and the mechanics refuse illegal moves, charge time for everything, and stop where the design stops.

Files: `config.py` (26 tunables, each with the basis of its estimate), `engine.py` (rules), `sim.py` (interfaces and the bot), `test_engine.py` (17 tests), `README.md` (action vocabulary and protocol format).

## 1. How to run and play

```
cd /media/griswald/wd-black-2tb/personal/firstmate/data/hw-sim-engine
python3 sim.py config                    # every constant with its comment
python3 sim.py questions                 # every rule gap the engine can raise
python3 sim.py bot --finale floated      # a scripted run end to end
python3 sim.py play                      # interactive: you drive all four players
python3 sim.py protocol                  # JSON lines in, JSON lines out, for agent players
python3 -m unittest test_engine          # 17 tests, all pass
```

Options on `play`, `protocol` and `bot`: `--variant resurrection|rage|loop|rescue`, `--seed N`, `--finale none|floated`, `--set NAME=VALUE` (any constant). `--finale floated` loads the four prop concepts of handoff section 10 as abstract steps so the curse rules have something to bite on; the default `none` loads nothing, because the handoff specifies no finale puzzle.

In `play`, each prompt names the player whose turn it is, shows what that player sees, hears and noticed, and lists the legal actions. In `protocol`, one JSON action per stdin line with a player id, one JSON line per action on stdout carrying every player's observation; an agent player reads only its own. Both share one vocabulary: `go`, `examine`, `work`, `hint`, `relay`, `confer`, `place`, `curse`, `wait`. The README documents it.

Verification commands run and their results:

- `python3 -m unittest test_engine`: `Ran 17 tests ... OK`.
- `python3 sim.py bot --quiet` for each variant: all four reach the turn at 22:35 (seed 0) and end on that variant's missing rule.
- `python3 sim.py bot --quiet --set GROUP_MOVES_TOGETHER=False`: ends at 3:40 on "Where is the medium when the players are in different rooms?".
- `printf ... | python3 sim.py protocol`: initial observation, accepted move, out-of-turn move refused with the next player named.

### A real bot run

`python3 sim.py bot --finale floated` (seed 0, resurrection variant). The clock printed is the acting player's clock after the action; the tail is what that player heard and noticed. `wait` lines are omitted. Long tails are cut here with `...`.

```
bot: variant=resurrection seed=0 finale=floated
2:20 deliverance go deliverance   The mother asks: find my children; discover what became of them.; deliverance, waitstill, mindwell, remember arrive in deliverance.
2:40 deliverance examine          You take in the clue for deliverance_1.
2:55 deliverance work             deliverance_1: no result yet (0:15 of effort so far).
3:10 deliverance work             deliverance_1: no result yet (0:30 of effort so far).
3:25 deliverance work             deliverance_1: no result yet (0:45 of effort so far).
3:40 deliverance work             deliverance_1: no result yet (1:00 of effort so far).
3:55 deliverance hint             Hint for deliverance_1.
4:08 deliverance work             deliverance_1 is solved.
4:28 deliverance examine          You take in the clue for deliverance_2.
4:43 deliverance work             deliverance_2: no result yet (0:15 of effort so far).
4:58 deliverance work             deliverance_2: no result yet (0:30 of effort so far).
5:13 deliverance work             deliverance_2: no result yet (0:45 of effort so far).
5:28 deliverance work             deliverance_2: no result yet (1:00 of effort so far).
5:43 deliverance hint             Hint for deliverance_2.
6:25 deliverance work             deliverance_2 is solved.; Role revealed: deliverance was the hands of the network.; Fate revealed: part of what happened to deliverance.; deliverance takes deliverance_relic.
6:45 deliverance go seance        deliverance, waitstill, mindwell, remember arrive in seance.
6:55 deliverance place            deliverance places deliverance_relic on the table.
7:15 waitstill   go waitstill     deliverance, waitstill, mindwell, remember arrive in waitstill.
7:35 waitstill   examine          You take in the clue for waitstill_1.
7:50 waitstill   work             waitstill_1: no result yet (0:15 of effort so far).
8:05 waitstill   work             waitstill_1: no result yet (0:30 of effort so far).
8:20 waitstill   work             waitstill_1: no result yet (0:45 of effort so far).
8:35 waitstill   work             waitstill_1: no result yet (0:59 of effort so far).
8:39 waitstill   work             waitstill_1 is solved.
8:59 waitstill   examine          You take in the clue for waitstill_2.
9:14 waitstill   work             waitstill_2: no result yet (0:15 of effort so far).
9:29 waitstill   work             waitstill_2: no result yet (0:30 of effort so far).
9:44 waitstill   work             waitstill_2: no result yet (0:45 of effort so far).
10:25 waitstill   work             waitstill_2 is solved.; Role revealed: waitstill was the eyes of the network.; Fate revealed: ...; waitstill takes waitstill_relic.
10:45 waitstill   go seance        deliverance, waitstill, mindwell, remember arrive in seance.
10:55 waitstill   place            waitstill places waitstill_relic on the table.
11:15 mindwell    go mindwell      deliverance, waitstill, mindwell, remember arrive in mindwell.
11:35 mindwell    examine          You take in the clue for mindwell_1.
11:50 mindwell    work             mindwell_1: no result yet (0:15 of effort so far).
12:05 mindwell    work             mindwell_1: no result yet (0:30 of effort so far).
12:20 mindwell    work             mindwell_1: no result yet (0:45 of effort so far).
12:35 mindwell    work             mindwell_1: no result yet (1:00 of effort so far).
12:50 mindwell    hint             Hint for mindwell_1.
12:55 mindwell    work             mindwell_1 is solved.
13:15 mindwell    examine          You take in the clue for mindwell_2.
13:30 mindwell    work             mindwell_2: no result yet (0:15 of effort so far).
13:45 mindwell    work             mindwell_2: no result yet (0:30 of effort so far).
14:00 mindwell    work             mindwell_2: no result yet (0:45 of effort so far).
14:15 mindwell    work             mindwell_2: no result yet (1:00 of effort so far).
14:30 mindwell    hint             Hint for mindwell_2.
15:02 mindwell    work             mindwell_2 is solved.; Role revealed: mindwell was the ears of the network.; Fate revealed: ...; mindwell takes mindwell_relic.
15:22 mindwell    go seance        deliverance, waitstill, mindwell, remember arrive in seance.
15:32 mindwell    place            mindwell places mindwell_relic on the table.
15:52 remember    go remember      deliverance, waitstill, mindwell, remember arrive in remember.
16:12 remember    examine          You take in the clue for remember_1.
16:27 remember    work             remember_1: no result yet (0:15 of effort so far).
16:42 remember    work             remember_1: no result yet (0:30 of effort so far).
16:57 remember    work             remember_1: no result yet (0:45 of effort so far).
17:12 remember    work             remember_1: no result yet (0:59 of effort so far).
17:27 remember    work             remember_1: no result yet (1:14 of effort so far).
17:42 remember    hint             Hint for remember_1.
17:47 remember    work             remember_1 is solved.
18:07 remember    examine          You take in the clue for remember_2.
18:22 remember    work             remember_2: no result yet (0:15 of effort so far).
18:37 remember    work             remember_2: no result yet (0:30 of effort so far).
18:52 remember    work             remember_2: no result yet (0:45 of effort so far).
19:35 remember    work             remember_2 is solved.; Role revealed: remember was the voice of the network.; Fate revealed: ...; remember takes remember_relic.
19:55 remember    go seance        deliverance, waitstill, mindwell, remember arrive in seance.
20:50 remember    place            The mother understands. She breaks.; Crackling, then screaming. The soundscape begins.; Deliverance. deliverance, the spirit calls you.; remember places remember_relic on the table.; The fourth relic lands. The truth is plain: all four children died in the fire.; Light turns to fire; shadows move; fog comes in.; The medium turns to deliverance.
21:20 deliverance curse            Waitstill. waitstill, the spirit calls you.; deliverance is now gloved.; You apply your curse: you are gloved.; The medium turns to waitstill.
21:50 waitstill   curse            Mindwell. mindwell, the spirit calls you.; You apply your curse: you are blindfolded.
22:20 mindwell    curse            mindwell is now muffled.; You apply your curse: you are muffled.; The medium turns to remember.
22:35 remember    curse            Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.; remember is now silenced.; You apply your curse: you are silenced.; Objective: ...
22:50 deliverance relay waitstill  deliverance tells waitstill what they know.
23:05 waitstill   work             satchel: no result yet (0:15 of effort so far).
23:20 waitstill   work             satchel: no result yet (0:30 of effort so far).
23:35 waitstill   work             satchel: no result yet (0:45 of effort so far).
23:50 waitstill   work
23:55 deliverance examine          You take in the clue for whisper_box.
23:55 deliverance relay mindwell

== UNDEFINED ==
Run ended at 23:55: the rules do not say: How is information relayed to the hearing-cursed player? (handoff 10 Mindwell: 'relay information to the hearing-impaired player')
total run length: 23:55 (target 20:00)
time per stage:
  opening        2:00
  deliverance    4:25
  seance         0:30
  waitstill      3:30
  seance         0:30
  mindwell       4:06
  seance         0:30
  remember       4:03
  seance         0:30
  turn           2:30
  finale         1:20
hints used: 5
curses active at each finale step:
  curse:deliverance 21:05  deliverance=gloved, waitstill=-, mindwell=-, remember=-
  curse:waitstill  21:35  deliverance=gloved, waitstill=blindfolded, mindwell=-, remember=-
  curse:mindwell   22:05  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=-
  curse:remember   22:35  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
  satchel          23:50  deliverance=gloved, waitstill=blindfolded, mindwell=muffled, remember=silenced
undefined rules hit:
  23:55  How is information relayed to the hearing-cursed player? (handoff 10 Mindwell: 'relay information to the hearing-impaired player')
```

Three things in that transcript are the information rules working, not bugs. At 21:50 the blindfolded Waitstill player does not see "waitstill is now blindfolded" (it is a visual event) and only notices their own act. At 23:50 the same player solves the satchel and sees nothing, because "satchel is solved" is visual. At 22:35 the muffled Mindwell player never hears the mother's objective; only the three who can hear get it.

## 2. What the mechanics pushed back on

- The ten-minute soundtrack is not ten minutes of play. The handoff orders the turn as truth, breakdown, fire audio, lights, fog, then curses (section 9). If the soundtrack starts at the fourth relic, the reveal beat and four invocations with four self-applied curses consume 2:30 of it before anyone can act. The engine exposes this as `FIRE_TIMER_STARTS` ("turn" or "after_curses"); the handoff does not say which.
- The blindfolded player pins the group. Handoff section 8's safety note says a sight-blocked player must not navigate. With the group moving together, nobody can leave the seance room after the curses; with individual movement, the Waitstill player is stuck at the table for the whole finale. Either the finale happens entirely at the table, or the design must say what the blind player does while others move.
- Two of the handoff's own floated finale concepts are unplayable under its own curse rules. Mindwell's box depends on others relaying a whispered clue to the hearing-impaired player, and Remember's testimony depends on the silenced player voicing a message. The engine raises both as questions the first time a run reaches them. The Deliverance (gloved holder relays, another operates) and Waitstill (blind holder relays, another looks) concepts do run.
- Splitting up changes everything and the design is silent on it. With `GROUP_MOVES_TOGETHER=False` and no hints, four players solving their own child's room in parallel reach the turn at 9:20 instead of 20:30. With hints, the run ends at 3:40 on "Where is the medium when the players are in different rooms?", because one live medium cannot hint in two rooms. The captain's "go out, come back, repeat" reads as the group moving together; if that is the rule, it should be stated, because it costs eleven minutes.
- The muffled player cannot hear the medium at all after their curse: no hints, no invocation of later players, no objective. The medium's whole channel to that player closes. In the finale every spoken instruction needs a second route to the Mindwell player.
- Hints never resolve a step by themselves. A hint halves the remaining effort; the group still has to work the rest. On seed 0 the group used 5 hints over eight steps because `HINT_AFTER_SECONDS` (60) equals the base step time, so an average step gets offered a hint the moment it runs long. Whether the medium hints that early is a design choice the constant makes visible.

## 3. Undefined rules, by stage

Each is the single question whose answer would let the engine continue. `python3 sim.py questions` prints the list with the function that raises it. The engine raises the first one a run reaches and stops; a different play reaches a different one.

Investigation:

1. Where is the medium when the players are in different rooms? (one live medium; hub-and-spoke). Raised by `hint` when the group is split and `MEDIUM_WITH_GROUP` is on.

The turn:

2. Can the turn fire while a player is away from the seance room? They would be cursed out of the medium's sight. (handoff 9)
3. What happens if a player the spirit has called does something other than apply their curse? (handoff 8: "If the spirit calls you, obey it")
4. Does the ten-minute soundtrack start at the fourth relic, before the curses, or once all four are cursed? (handoff 9 order vs section 10). Carried as the `FIRE_TIMER_STARTS` constant rather than raised, because the engine needs an answer to run; the default follows the section 9 order.

The finale, all variants:

5. What physically and visibly happens to the players when the ten minutes run out? (handoff "Best next design session", question 2). Recorded whenever the timer expires.
6. How is information relayed to the hearing-cursed player? (handoff 10 Mindwell: "relay information to the hearing-impaired player"). Raised by `relay` to the muffled player.
7. How does the voice-cursed player pass on what only they know? (handoff 10 Remember; a silenced player cannot relay). Raised by `relay` from the silenced player.
8. The four floated props are complete. Does that constitute victory? The handoff names no winning action (handoff "Best next design session", question 3). Raised when `--finale floated` runs to the end.

The finale, per variant (raised the moment the fourth curse lands, because the handoff defines nothing the players can then do):

9. Resurrection: what player action prevents the resurrection ritual, and how is the ritual's progress shown to the players?
10. Rage: where in the house is the husband's true motive found, and what physical act proves it to her? No spoke reveal contains it: spokes reveal each child's role and fate (handoff 5).
11. Trapped loop: what was left unfinished in the historical fire, and what act resolves it?
12. Rescue: what object or signal stands for each child in the fire, and where must it be taken for that child to count as out?

Questions 9 to 12 are the handoff's own three unanswered questions seen from inside the engine. They are already carried for the captain by the held task `halloween-2026-review` and are the subject of the queued `hw-synthesis` scout. Questions 1 to 8 are new and specific; firstmate should fold them into that task's hold reason or into the synthesis brief. I did not rewrite the hold reason myself.

## 4. Timing

Every number below is a guess written into `config.py` with its basis, to be replaced by rehearsal measurements. The engine's value is the shape, not the digits.

Baseline, deterministic (`--set "STEP_TIME_JITTER=(1.0,1.0)"`, no hints needed), group moving together, two steps of 60 s per child:

| stage | time | made of |
|---|---|---|
| opening | 2:00 | `SEANCE_OPENING_SECONDS` |
| each child's room | 4:00 | walk out 0:20, examine 2 x 0:20, work 2 x 1:00, reveal 0:30, walk back 0:20, place 0:10 |
| four rooms | 16:00 | |
| turn to end of curses | 2:30 | reveal beat 0:30, 4 x (invocation 0:15 + curse 0:15) |
| curses complete at | 20:30 | |
| soundtrack ends at | 28:00 | turn at 18:00 + `FIRE_TIMER_SECONDS` |
| playable finale | 7:30 | |

With the per-step jitter on (groups run faster or slower than the designer's estimate), seeds 0 to 9 reach the end of the curses between 20:59 and 23:16 using 3 to 7 hints. So the investigation alone fills the 20-minute target before the finale begins, and a full run is 28 to 31 minutes. That matches the previous simulation's 25 to 28 minutes under different rules: the overshoot is structural, not a rev 07 artefact.

Where the sixteen minutes of investigation go: puzzle effort 8:00, reading clues 2:40, walking 2:40, reveals 2:00, placing relics 0:40. Sensitivity, one constant at a time from the deterministic baseline, time to the end of the curses:

| change | end of curses | note |
|---|---|---|
| baseline | 20:30 | |
| `SPOKE_STEP_SECONDS` 60 to 90 | 24:30 | +1:00 per step |
| `SPOKE_STEP_COUNT` 2 to 3 | 25:50 | each step also costs an examine |
| `SPOKE_STEP_COUNT` 2 to 1 | 15:10 | |
| `TRAVEL_SECONDS` 20 to 0 | 17:50 | eight walks |
| `GROUP_MOVES_TOGETHER` off, no hints | 9:20 | four rooms in parallel; hints then raise question 1 |

The constants that dominate are `SPOKE_STEP_SECONDS` x `SPOKE_STEP_COUNT` x four children (8:00 of 20:30) and `FIRE_TIMER_SECONDS` (10:00, fixed by the handoff). Travel and reading are each about 2:40 and are the only places a layout or prop decision buys minutes without cutting puzzles. To land a 20-minute run with a 10-minute soundtrack, the opening, four rooms and turn must fit in 10 minutes: about 1:50 per child's room including the walk, the reveal and the relic. Either the soundtrack is shorter than the handoff's "perhaps ~10 minutes", or each child gets one short beat, or the group splits.

## 5. Assumptions the engine had to make to run at all

None of these is a design decision. Each is a constant or a line of code a designer can change, and the report lists them so none is mistaken for one.

1. Spoke puzzle shapes are placeholders: two steps per child, 60 s each, needing the child's own faculty, with a visual clue (Mindwell: an audible one). The handoff specifies no puzzle content.
2. Step effort is hidden and jittered per run (0.7 to 1.6 x the base) so that stalls and hints mean something. (1.0, 1.0) makes it deterministic.
3. Effort is wall time with at least one capable knower on the step; four people on one prop do not solve it four times faster.
4. A hint removes half the remaining effort and the medium waits the stall time again before the next one. The handoff says only that hints may be given.
5. Everyone starts with all four faculties; the binding to a child matters only when the curse removes that faculty.
6. Reveals are visual events to everyone present; the relic goes to the player who finished the last step.
7. The group walks together (`GROUP_MOVES_TOGETHER`), the spokes may be taken in any order (`SPOKE_ORDER_FIXED` off), spokes connect only through the hub, and the medium walks with the group (`MEDIUM_WITH_GROUP`).
8. The invocation order is the handoff's table order, Deliverance, Waitstill, Mindwell, Remember.
9. The soundtrack starts at the fourth relic (`FIRE_TIMER_STARTS="turn"`), following the section 9 ordering.
10. The finale, when any finale steps are loaded, happens at the seance table, because the blind player may not move. The holder of a floated step's knowledge has it from the moment the finale begins; the handoff says the cursed player "may possess" it without saying how.
11. A relay is spoken: the speaker needs voice, the listener ears, and everyone in the room who can hear learns it too. Confer pools what every speaker knows into every listener.
12. Only the player with the lowest clock may act; a player's room is checked at their own clock. Joint actions start when the last participant is free.
13. A player who is called and does not curse, or a turn that fires with someone away, ends the run as undefined rather than being refused, because the handoff states the rule ("obey it") without its consequence.
14. Loss at the timer uses the variant's one-line loss text from section 13 and records that the physical failure state is unspecified.

## 6. What the engine cannot yet express, and why

- Any win. No variant has a winning action in the handoff, so `over.result` can only be `lost` or `undefined`. The engine's win sentence exists in code shape ("you won because you did X before Y") but nothing produces it.
- The mother's progress. Resurrection, rage and loop all imply something she is doing that the players race; the handoff gives no observable for it, so there is no ritual meter, no destructive act, no loop state.
- Puzzle content, codes and props. Steps are durations and faculty sets. The engine cannot tell you whether a specific knot or lock is solvable, only how long you budgeted for it.
- Non-verbal communication. The brief fixes "a silenced player cannot relay" and "a deaf player misses spoken clues"; the engine has no writing, pointing or touch channel because the handoff names none. Two floated finale concepts depend on exactly such a channel.
- Spoke failure. A step can only take longer; it cannot be failed, skipped or cost something, because the handoff defines no failure inside a child's room (the unknowns ledger lists "spoke failure cost" as open).
- Partial outcomes. Curses are binary and permanent; there is no cure, no partial sight, no removal of a player.
- The real house. Travel is one constant per walk; there is no layout, no door, no fog-in-the-corridor.
- A live performer's judgement. The medium hints on a timer and invokes in a fixed order; Tamari would read the room.

## 7. Recommendation

The engine is ready for the agent-player task (`hw-playtests`): `python3 sim.py protocol` with the README's vocabulary. For design work, the useful next move is not more puzzles but answers to questions 4, 6 and 7 above together with the handoff's three: when the soundtrack starts, how the deaf player receives information, and how the silenced player gives it. Those three decide whether the cross-sensory finale the handoff wants can exist at all, and the engine will run the floated finale to its end as soon as they are answered. Then time one tabletop rehearsal and replace the constants in `config.py` with measurements.

Nothing here should ship to the halloween repo; the engine belongs with the design notes until the design settles.
