# Historical fire loop: played proposal

2026-10-08. Scout `hw-play-loop`. Four players controlled through live JSON-lines subprocesses, seed 0, default investigation jitter 0.7–1.6. No stock bot run. One group investigation, one split investigation, then two full group runs with the proposed finale. These are mechanical text trials, not human rehearsals or measured puzzle difficulty.

**Result:** playable as a witnessed-account ritual; weak as unfinished history. Win 26:50; loss 30:05. The unchanged group investigation reaches the curses at 22:35. The finale cannot repair that time budget.

## 1. PROPOSAL

- **She now intends to force the house through the children's fatal fire again.**
- **If the players fail, the fire reaches its fatal ending and repeats its opening sound and light once; the medium declares the loop unbroken, raises usable light, and ends play before anyone moves.**
- **The players win when they show and witness the four recovered accounts beside the matching keepsakes, then speak the agreed account at the table before the fatal ending.**

Medium's objective, one sentence, used verbatim in the run:

> She is forcing this house through the fire again; before its final surge, show each child's recovered account, return that keepsake, and bear witness together here until all four are acknowledged, then speak the whole account to close the loop—you will know it worked when the fire ceases; Remember, begin by showing Mindwell Deliverance's account.

This uses section 13's **symbolic resolution** option. The unresolved thing is acknowledgment of the children's fates, not a new secret spy dispatch, escape route, motive, or historical event. The handoff does not establish acknowledgment as the cause of the loop. That causal link is a proposal, and the trial does not make it canon. The line is too long to rely on a single spoken delivery; the trial supplies persistent visible instructions and repeatable spoken status.

## 2. Part 1: play as written

Both runs use the copied engine unchanged. Group and split use the same seed so differences do not come from new puzzle durations. The driver records every request, response, refusal and wait in JSONL, and gives each player only its own observation/memory for decisions. It knows the declared action vocabulary and child names. Its route policy waits for a relic to be placed before moving on. A first controller attempt omitted that wait and looped between the hub and a finished room; that is a driver error, excluded from game timing and retained separately.

### Opening and first move

The initial objective says “find my children; discover what became of them.” It does not name the next room or tell us why returning each keepsake changes anything. I chose Deliverance from the available room names and the README's return rule. This is route knowledge supplied by the interface, not discovered in the fiction. Opening costs 2:00 with no player action.

```
2:20 deliverance go deliverance | Try this child next; no spoken route instruction was supplied.
2:40 deliverance examine        | Read/listen for what to do.
     You take in the clue for deliverance_1.
```

### Spokes: little to decide, three people mostly wait

The engine gives a clue identifier, not clue content. “Work” consumes effort, and the result reports elapsed effort. I could react to a stall but could not interpret an actual puzzle. In each spoke the child-linked player led; the others waited. Waitstill tried helping once in Deliverance's room:

```
2:20 waitstill work | I want a job too; try helping before the reader has explained it.
     deliverance_1: no result yet (0:15 of effort so far).
```

This was accepted, but advanced Deliverance's clock, not Waitstill's. `engine.py:324` gathers capable knowers and advances that crew, even if the actor is not in it. Do not read the line as evidence that Waitstill performed useful work. No second job appeared. Across the group run the wait-command counts were Deliverance 76, Waitstill 63, Mindwell 46, Remember 31; these are scheduler passes, not human idle seconds. All four led their own room, but travel together did not make the puzzle cooperative.

### Hints: early request refused; later offer has no semantic advice

```
2:55 deliverance hint
     REFUSED: the medium does not offer a hint yet
     (0:15 of effort on deliverance_1 since the last hint; she waits for 1:00)
3:40 deliverance work
     deliverance_1: no result yet (1:00 of effort so far).
3:55 deliverance hint
     Hint for deliverance_1.
4:08 deliverance work
     deliverance_1 is solved.
```

I asked when I wanted a direction; the rule counted effort instead. That can be late for someone who cannot identify the task at all. Conversely, the later hint is available just because a jittered task ran long; it can be early for someone making steady progress. The run used five hints. These are timing risks, not a claim that I tested the quality of real hint wording: the engine only prints “Hint for …”. No other too-late hint was demonstrated.

### Returns and the turn: reason missing until the fourth placement

```
6:25 deliverance work
     Role revealed: deliverance was the hands of the network.
     Fate revealed: part of what happened to deliverance.
6:55 deliverance place
     deliverance places deliverance_relic on the table.
10:55 waitstill place
     waitstill places waitstill_relic on the table.
15:32 mindwell place
     mindwell places mindwell_relic on the table.
20:50 remember place
     The fourth relic lands. The truth is plain: all four children died in the fire.
     The mother understands. She breaks.
22:35 remember curse
     Run ended: What was left unfinished in the historical fire, and what act resolves it?
```

Each of the first three returns changes the visible relic list, but supplies no new mother response or instruction. The player's reason for the next action remains “collect the next thing.” The fourth-placement line includes the reveal and first invocation; the fire timer actually anchors at **20:05**, not 20:50. Curses then leave 7:30 of its ten minutes. Undefined rule **Q11** ends the group run before any finale action is possible. We cannot infer what historical task to finish from “part of what happened.”

### Split run: everyone works, then the medium has no location

```
2:20 deliverance go deliverance
2:20 waitstill go waitstill
2:20 mindwell go mindwell
2:20 remember go remember
2:40 each player examines their own first clue.
3:40 each player has spent 1:00 working their own first step.
3:40 deliverance hint
     Run ended: Where is the medium when the players are in different rooms?
```

No player idled before the stop. Nobody returned a relic, reached the turn, or tested a split finale. Undefined rule **Q1** ends it. The engine's stage list labels the whole concurrent period “remember”; that is the last move marker, not the only room being played. The proper wall-time reading is 2:00 opening plus 1:40 of four concurrent spokes. This trial does not overturn the captain's settled group route.

## 3. All added rules

These are **trial rules**, not approved design. Q numbers refer to engine report section 3. “Captain call” means adoption needs the existing design decision; it did not block this authorized scratch experiment. No baseline rule was repaired.

| # | Added or explicitly retained rule | Question answered | Owner |
|---|---|---|---|
| R1 | Treat the children's unacknowledged fates as the loop's symbolic unfinished business. Use only recovered roles/fates, never a new historical message. | Q11: what was unfinished? | Captain call |
| R2 | Four child accounts, in existing child-table order. For each: Remember shows a written account; Mindwell returns/matches its keepsake at its marked table position; Deliverance describes that match aloud; Waitstill witnesses its established role/fate aloud. These are role-bound contributions, not four new puzzles. | Q11: what actions resolve it? | Designer choice for trial, conditional on R1 |
| R3 | Every contribution takes 15 seconds, synchronizes all four clocks, requires the named role's remaining faculties and all players at the table. Wrong role, wrong child, premature close and generic finale work are refused without time cost. No clue correctness or physical difficulty is modeled. | Q11: when does an action count? | Designer choice |
| R4 | After four witnessed accounts, Deliverance speaks the joint account using `close`, 15 seconds. This alone wins. An early close is refused. A completed or expired game accepts no more actions. | Q8 and Q11: what constitutes victory? | Captain call for the winning act; designer choice for guards |
| R5 | Remember may show writing/point with intact hands and eyes; Mindwell reads it and uses hands/eyes to match relics. Deliverance's spoken description reaches Waitstill; Waitstill retains hearing and speech. Forbidden spoken relays are refused with the permitted route named. | Q6, Q7: communication across the curses | Designer choice |
| R6 | Medium objective, current contribution, warnings, acknowledgments and ending have both spoken and visible versions; visible state persists. `status` repeats the instruction and costs 15 seconds. No touch channel, new code or curse cure. | Q6 and Q11: common objective/progress | Designer choice |
| R7 | Keep the original 600-second timer starting at the fourth placement, including the 150-second turn. The mother advances through the repeating fire, with taught spoken/visible cues at start, five minutes left, two minutes left and thirty seconds left. No separate ritual meter. | Q4 and Q11: clock/progress | Captain call for the time budget; designer choice for warning points |
| R8 | Each witnessed account gets spoken confirmation and a persistent visible acknowledgment; its sound layer fades while the master fire continues. Count is 0–4, never “children saved.” This is a text cue specification, not implemented audio hardware. | Q11: how progress is legible | Designer choice |
| R9 | At or beyond the deadline, loss takes precedence over the attempted contribution. Play the fatal fire beat, repeat its opening once, then restore usable room light. State the acknowledgment count, declare the loop unbroken, and instruct curse removal before movement. Winning cuts the fire immediately and restores light; no historical resurrection or rescue is claimed. Ending cues take no extra modeled seconds. | Q5 and Q8: visible endings and deadline tie | Captain call for fictional consequence; designer choice for cue sequence and tie rule |
| R10 | Keep everyone at the séance table. Existing blind-movement refusal still applies; this deliberately avoids needing a solution to Q2. Keep obedience to invocation as the tested path; Q3 stays unanswered. | Q2/Q3 scope; Q11 staging | Designer choice under handoff §8 |

R5 is necessary here: the silent player's proposed contribution must reach the hearing-cursed player. Writing is the single added player communication channel. The visible medium cues also prevent Mindwell losing the objective, clock and stop. No extra private facts appear magically. Everyone already heard or saw the investigation, so the assigned roles are a ritual rule, not a knowledge monopoly.

## 4. Finale plays and timing

All four curses remain active through both outcomes. Every successful contribution records its curse map. Every observation after the turn keeps Waitstill in `seance`. The driver tries three wrong moves before proceeding: close immediately, move while blind, and speak from Remember to Mindwell. All are refused. No refusal advances time.

The win follows the permitted sequence. The loss is an explicit stress case: Remember requests six 15-second status/recheck intervals before each account. It is not a discovered human error rate. The group still makes two complete acknowledgments and most of a third before expiry. It demonstrates the losing path, warnings and interrupted action.

Times below truncate fractional seconds, matching the engine display. Component rounding can differ by one second.

| Stage | Group baseline | Split baseline | Loop win | Loop loss |
|---|---:|---:|---:|---:|
| Opening | 2:00 | 2:00 | 2:00 | 2:00 |
| Deliverance spoke, outbound travel and reveal | 4:25 | concurrent | 4:25 | 4:25 |
| Waitstill spoke, outbound travel and reveal | 3:30 | concurrent | 3:30 | 3:30 |
| Mindwell spoke, outbound travel and reveal | 4:06 | concurrent | 4:06 | 4:06 |
| Remember spoke, outbound travel and reveal | 4:03 | concurrent | 4:03 | 4:03 |
| Four returns and placements | 2:00 | not reached | 2:00 | 2:00 |
| Concurrent split work, including outbound travel | — | 1:40 | — | — |
| Turn and curses | 2:30 | not reached | 2:30 | 2:30 |
| Playable finale | 0:00 | not reached | 4:15 | 7:30 |
| **Total** | **22:35** | **3:40** | **26:50** | **30:05** |
| Stop/result | Q11 undefined | Q1 undefined | won | lost, 2/4 witnessed |

### Win transcript, finale only

The following is a direct trimmed transcript. Duplicate visible/spoken copies and scheduler waits are removed; every requested finale action remains. Warnings are shown at the next action observation. No human dialogue is fabricated.

```text
22:35 deliverance {"action": "close"}
  REFUSED: The loop cannot close: all four accounts must first be witnessed.
22:35 waitstill {"action": "go", "to": "waitstill"}
  REFUSED: waitstill may not move through the house while blindfolded (handoff 8 safety note); the group cannot leave together
22:35 remember {"action": "relay", "to": "mindwell"}
  REFUSED: Use the shown account for Mindwell; Remember may show writing, not speak.
22:50 remember {"action": "show", "to": "deliverance"}
  Remember shows Mindwell the recovered deliverance role and fate in writing.
23:05 mindwell {"action": "return", "to": "deliverance"}
  Mindwell returns deliverance_relic to its marked position beside that account.
23:20 deliverance {"action": "describe", "to": "deliverance"}
  Deliverance tells Waitstill which account and relic Mindwell matched.
23:35 waitstill {"action": "witness", "to": "deliverance"}
  Waitstill speaks and confirms the recovered deliverance role and fate.
  deliverance account acknowledged; 1/4. Its sound layer fades; its table position stays visibly acknowledged. The fire continues toward the same deadline.
23:50 remember {"action": "show", "to": "waitstill"}
  Remember shows Mindwell the recovered waitstill role and fate in writing.
24:05 mindwell {"action": "return", "to": "waitstill"}
  Mindwell returns waitstill_relic to its marked position beside that account.
24:20 deliverance {"action": "describe", "to": "waitstill"}
  Deliverance tells Waitstill which account and relic Mindwell matched.
24:35 waitstill {"action": "witness", "to": "waitstill"}
  Waitstill speaks and confirms the recovered waitstill role and fate.
  waitstill account acknowledged; 2/4. Its sound layer fades; its table position stays visibly acknowledged. The fire continues toward the same deadline.
24:50 remember {"action": "show", "to": "mindwell"}
  Remember shows Mindwell the recovered mindwell role and fate in writing.
25:05 mindwell {"action": "return", "to": "mindwell"}
  Visible cue: The fire is halfway through its return; five minutes remain.
  Mindwell returns mindwell_relic to its marked position beside that account.
25:20 deliverance {"action": "describe", "to": "mindwell"}
  Deliverance tells Waitstill which account and relic Mindwell matched.
25:35 waitstill {"action": "witness", "to": "mindwell"}
  Waitstill speaks and confirms the recovered mindwell role and fate.
  mindwell account acknowledged; 3/4. Its sound layer fades; its table position stays visibly acknowledged. The fire continues toward the same deadline.
25:50 remember {"action": "show", "to": "remember"}
  Remember shows Mindwell the recovered remember role and fate in writing.
26:05 mindwell {"action": "return", "to": "remember"}
  Mindwell returns remember_relic to its marked position beside that account.
26:20 deliverance {"action": "describe", "to": "remember"}
  Deliverance tells Waitstill which account and relic Mindwell matched.
26:35 waitstill {"action": "witness", "to": "remember"}
  Waitstill speaks and confirms the recovered remember role and fate.
  remember account acknowledged; 4/4. Its sound layer fades; its table position stays visibly acknowledged. The fire continues toward the same deadline.
  All four accounts witnessed. Deliverance: close, by speaking the agreed account.
26:50 deliverance {"action": "close"}
  Deliverance speaks the agreed account of all four children. The fire and remaining voices cease; all four table positions stay acknowledged. Usable room light returns. The loop has ended. Remove curses before moving.
```

### Loss transcript, finale only

```text
22:35 deliverance {"action": "close"}
  REFUSED: The loop cannot close: all four accounts must first be witnessed.
22:35 waitstill {"action": "go", "to": "waitstill"}
  REFUSED: waitstill may not move through the house while blindfolded (handoff 8 safety note); the group cannot leave together
22:35 remember {"action": "relay", "to": "mindwell"}
  REFUSED: Use the shown account for Mindwell; Remember may show writing, not speak.
22:50 remember {"action": "status"}
23:05 remember {"action": "status"}
23:20 remember {"action": "status"}
23:35 remember {"action": "status"}
23:50 remember {"action": "status"}
24:05 remember {"action": "status"}
24:20 remember {"action": "show", "to": "deliverance"}
  Remember shows Mindwell the recovered deliverance role and fate in writing.
24:35 mindwell {"action": "return", "to": "deliverance"}
  Mindwell returns deliverance_relic to its marked position beside that account.
24:50 deliverance {"action": "describe", "to": "deliverance"}
  Deliverance tells Waitstill which account and relic Mindwell matched.
25:05 waitstill {"action": "witness", "to": "deliverance"}
  The fire is halfway through its return; five minutes remain.
  Waitstill speaks and confirms the recovered deliverance role and fate.
  deliverance account acknowledged; 1/4. Its sound layer fades; its table position stays visibly acknowledged. The fire continues toward the same deadline.
25:20 remember {"action": "status"}
25:35 remember {"action": "status"}
25:50 remember {"action": "status"}
26:05 remember {"action": "status"}
26:20 remember {"action": "status"}
26:35 remember {"action": "status"}
26:50 remember {"action": "show", "to": "waitstill"}
  Remember shows Mindwell the recovered waitstill role and fate in writing.
27:05 mindwell {"action": "return", "to": "waitstill"}
  Mindwell returns waitstill_relic to its marked position beside that account.
27:20 deliverance {"action": "describe", "to": "waitstill"}
  Deliverance tells Waitstill which account and relic Mindwell matched.
27:35 waitstill {"action": "witness", "to": "waitstill"}
  Waitstill speaks and confirms the recovered waitstill role and fate.
  waitstill account acknowledged; 2/4. Its sound layer fades; its table position stays visibly acknowledged. The fire continues toward the same deadline.
27:50 remember {"action": "status"}
28:05 remember {"action": "status"}
  The fire is nearing its fatal end; two minutes remain.
28:20 remember {"action": "status"}
28:35 remember {"action": "status"}
28:50 remember {"action": "status"}
29:05 remember {"action": "status"}
29:20 remember {"action": "show", "to": "mindwell"}
  Remember shows Mindwell the recovered mindwell role and fate in writing.
29:35 mindwell {"action": "return", "to": "mindwell"}
  Visible cue: The fatal ending is approaching; thirty seconds remain.
  Mindwell returns mindwell_relic to its marked position beside that account.
29:50 deliverance {"action": "describe", "to": "mindwell"}
  Deliverance tells Waitstill which account and relic Mindwell matched.
30:05 waitstill {"action": "witness", "to": "mindwell"}
  The fire reaches its fatal ending. 2/4 accounts were witnessed; the loop repeats. Fire sound cuts, then its opening crackle returns once; fire light repeats its opening state, then usable room light returns. The medium ends the game and tells everyone to remove their curses before moving.
```

## 5. Verdict and three improvements

**This works as a runnable coordination ritual. It does not yet work as a convincing historical-loop finale.** It required a new causal rule: witnessing the known deaths can close the loop. Nothing in the handoff proves that rule, and the mother already learns the deaths at the fourth relic. Repeating them could feel like doing the same ending twice. The trial deliberately leaves the husband's motive out: no existing spoke reveals it, and adding evidence would move toward the other assigned direction.

| Research check | Observed result |
|---|---|
| Escape report §4.3 item 2: one final act attended by all | Pass in the model: one linear table sequence and one final spoken close. Waitstill hears the close; “everyone watches” must mean everyone can perceive it. Three players attend while Deliverance closes. |
| Escape report §4.3 item 5: legible, staged failure | Partial pass: warnings, fatal fire, one restart, acknowledgment count and safe end. It remains a binary loss with partial-progress feedback, not a distinct tiered ending. Physical effects and their duration are untested. |
| Immersive curses table: work redistributed | Narrow pass: Remember writes four times; Mindwell matches four times; Deliverance describes four times and closes; Waitstill witnesses four times. No one is deleted. But role locks enforce necessity, and no interpretation or recurring judgment is tested. A sighted talkative player could otherwise do most of it. |
| Blind player stays at table | Pass: movement probe refused; all finale observations retain `seance`. Spoken instructions and confirmations remain available. No touch or navigation required. |
| Objective and deadline | Pass in text after adding visible and spoken equivalents; medium line needs shortening/rehearsal. Fire escalation alone would not communicate remaining time. |
| Final revelation changes play | Weak: no last new revelation is implemented. The already-known facts enable a formal closing act. This does not yet satisfy the handoff's desire to unite the last revelation with victory. |
| Twenty-minute target | Fail: even the clean win takes 26:50. The four curses finish 2:35 after target. The loss takes 30:05 before an unbudgeted performed exit. |

The three changes that would most improve this direction:

1. **Settle Q11 before content design:** accept acknowledgment as sufficient symbolic resolution, or identify an unfinished act already supported by the agreed history. If neither is satisfying, reject this direction. Do not invent a dispatch or historical failure merely to justify the model.
2. **Give each cursed role a necessary judgment, not only a turn in a ritual.** Rehearse the same table flow with four people and plain role/fate placeholders. Check whether another player can replace a role, whether Mindwell gets every cue, and whether Waitstill can challenge an incorrect account. No puzzle content is proposed here.
3. **Allocate the 20 minutes before adding more work.** The 4:15 clean finale requires curses complete by 15:45, a reduction of 6:50 from this baseline, even before an exit beat. Keep the settled hub-and-spoke route; test a shorter spoke workload and turn separately. Do not present these guessed durations as rehearsal measurements.

Still unanswered: what was historically unfinished; why witnessing changes the haunting; what the family/player condition is after an unbroken loop beyond the staged ending; whether the father's motive must gate this direction; exact spoke evidence; meaningful wrong-answer feedback; physical cue operation/reset; and whether one medium can deliver all accessible cues while performing. These are not solved by a green test.

## 6. Reproduction, evidence and scratch changes

Commands run from the disposable worktree:

```sh
cp -r /media/griswald/wd-black-2tb/personal/firstmate/data/hw-sim-engine ./sim
python3 drive.py baseline-group
python3 drive.py baseline-split
python3 drive.py loop-win
python3 drive.py loop-loss
python3 -m unittest discover -s sim -p 'test*.py'
```

The baseline driver opens `python3 -u sim/sim.py protocol --variant loop --seed 0`; the split run adds `--set GROUP_MOVES_TOGETHER=False`. Finale runs open `python3 -u sim/loop_protocol.py --seed 0`, which uses the same protocol emitter. All decisions use returned observations, legal actions and per-player remembered events. The baseline's literal clue/fate text cannot support semantic puzzle solving, so this is action-level play, not a claimed cognitive playtest.

Output: baseline group `undefined 1355.7356`; split `undefined 220`; finale win `won 1610.7356`; finale loss `lost 1805.7356`. Tests: **21 passed**, including the original 17 plus checks for skipped roles, early closure, terminal win, exact-deadline loss, and accessible objective/progress. All six copied source/document files match the shared engine byte-for-byte. No tracked repository file changed, no push, no PR, no browser or Lavish session opened.

Scratch file list:

- `sim/loop_protocol.py`: added subclass and independent protocol entry point. Original `sim/engine.py`, `sim/config.py` and `sim/sim.py` unchanged.
- `sim/test_loop_proposal.py`: four rule-boundary tests.
- `drive.py`: observation-driven four-player scripts, logs every exchange.
- `transcripts/{baseline-group,baseline-split,loop-win,loop-loss}.{jsonl,txt}` and matching `-summary.json`: full records and summaries.
- `transcripts/driver-route-error.{jsonl,txt}`: excluded first driver attempt, preserved as a controller failure.
- `transcripts/tests.txt`: test output.
- `build_report.py`: report assembly only; `report.md`: this deliverable.

Evidence anchors in the copied files: `engine.py:176` observation; `engine.py:226` clock/deadline; `engine.py:283` blind movement guard; `engine.py:324` work dispatch; `engine.py:459` finale initialization; `loop_protocol.py:10` timings and cue thresholds; `:26` proposal subclass; `:38` shared instructions; `:72` loss and warnings; `:93` contributions; `:143` winning act. Source reports: handoff §§7–13; engine report §3 Q1–Q12 and §5 assumptions; escape research §4.3 items 2 and 5; immersive report “Curses: retain competence, change the route” and “How the medium could hand over the final objective”; unknowns ledger “Answer these first,” especially 1–5.

Engine-owner findings to review separately: work can advance a non-acting knower's clock; split-stage labels are not a concurrent timing breakdown; the base engine sends its objective through an `any`-modality note as well as speech, so despite the engine report's claim, its JSON observation leaks objective text to Mindwell. The scratch proposal uses actual ears/eyes channels for all new cues. These issues were not repaired in Part 1. No production change should ship from this scout; the proposal is a design experiment.

Because only this report survives teardown, the three executable additions are included below in full. Restore them under the listed paths alongside a fresh engine copy to reproduce all four successful recorded runs. Full raw JSONL remains scratch evidence until teardown; the report preserves baseline excerpts and every finale action, plus code to regenerate the raw logs.

### Source: sim/loop_protocol.py

```python
"""PROPOSAL: symbolic witnessing closes the historical fire loop.

No new historical event or puzzle answer is supplied. The interpretation that an
unacknowledged fate can be resolved by witnessing remains a captain call.
"""
import argparse
import engine as E
import sim

ACTION_SECONDS = 15  # rehearsal placeholder per contribution, not puzzle-solving time
WARNINGS = ((0, 'The fire repeats; ten minutes from the fourth relic.'),
            (300, 'The fire is halfway through its return; five minutes remain.'),
            (480, 'The fire is nearing its fatal end; two minutes remain.'),
            (570, 'The fatal ending is approaching; thirty seconds remain.'))
OBJECTIVE = ('She is forcing this house through the fire again; before its final surge, '
             'show each child\'s recovered account, return that keepsake, and bear witness '
             'together here until all four are acknowledged, then speak the whole account '
             'to close the loop—you will know it worked when the fire ceases; '
             'Remember, begin by showing Mindwell Deliverance\'s account.')
ORDER = [('remember', 'show'), ('mindwell', 'return'),
         ('deliverance', 'describe'), ('waitstill', 'witness')]

class LoopGame(E.Game):
    def __init__(self, seed=0):
        self.round = 0
        self.part = 0
        self.warned = set()
        self.confirmed = []
        self.channel_log = []
        super().__init__('loop', seed, 'none')

    def broadcast(self, text):
        # A spoken cue and its visible written counterpart, never an any-modality note.
        self.say('medium', E.HUB, text)
        self.emit('sight', E.HUB, 'Visible cue: ' + text, None, 'eyes')
        self.channel_log.append((E.fmt(self.now()), text))

    def instruction(self):
        if self.round == 4:
            return 'All four accounts witnessed. Deliverance: close, by speaking the agreed account.'
        p, action = ORDER[self.part]
        return f'{len(self.confirmed)}/4 witnessed. {p}: {action} {E.CHILDREN[self.round]}.'

    def invoke_next(self):
        if self.to_invoke:
            return super().invoke_next()
        self.invoked = None
        self.phase = 'finale'
        self.stages.append(('finale', self.now()))
        self.broadcast(OBJECTIVE)
        self.broadcast('Stay at the table. Remember may write or point, never speak game clues. '
                       'Mindwell reads the same objective and progress. Waitstill receives spoken cues. '
                       'The four recovered accounts contain only the roles and fates already established.')
        self.broadcast(self.instruction())

    def sight(self, p):
        out = super().sight(p)
        if self.phase == 'finale':
            out += [OBJECTIVE, self.instruction()]
        return out

    def legal(self, p):
        if self.phase != 'finale' or self.over:
            return super().legal(p)
        if self.next_player() is not p:
            return []
        if self.round == 4:
            return ['wait', 'status'] + (['close'] if p.id == 'deliverance' else [])
        role, verb = ORDER[self.part]
        return ['wait', 'status'] + ([verb + ' ' + E.CHILDREN[self.round]] if role == p.id else [])

    def advance(self, players, seconds):
        end = max(p.t for p in players) + seconds
        if self.deadline is not None and end >= self.deadline:
            for p in self.players.values():
                p.t = self.deadline
            self.broadcast(f'The fire reaches its fatal ending. {len(self.confirmed)}/4 accounts were witnessed; '
                           'the loop repeats. Fire sound cuts, then its opening crackle returns once; '
                           'fire light repeats its opening state, then usable room light returns. '
                           'The medium ends the game and tells everyone to remove their curses before moving.')
            self.lose(f'the loop reached its fatal ending with {len(self.confirmed)}/4 accounts witnessed '
                      'and no completed closing testimony')
            return False
        result = super().advance(players, seconds)
        if self.deadline is not None:
            elapsed = self.now() - self.t_turn
            for threshold, text in WARNINGS:
                if elapsed >= threshold and threshold not in self.warned:
                    self.warned.add(threshold)
                    self.broadcast(text)
        return result

    def contribution(self, p, child, verb):
        if self.phase != 'finale':
            raise E.Illegal('The witnessing has not begun.')
        if self.round == 4:
            raise E.Illegal('All accounts are witnessed; speak the closing account.')
        role, expected = ORDER[self.part]
        if p.id != role or verb != expected or child != E.CHILDREN[self.round]:
            raise E.Illegal('That contribution is not ready. ' + self.instruction())
        required = {'show': {'hands', 'eyes'}, 'return': {'hands', 'eyes'},
                    'describe': {'eyes', 'voice'}, 'witness': {'ears', 'voice'}}[verb]
        if not required <= p.faculties:
            raise E.Illegal('The contribution needs ' + ', '.join(sorted(required)))
        if any(q.room != E.HUB for q in self.players.values()):
            raise E.Illegal('All four must remain at the table.')
        if not self.advance(list(self.players.values()), ACTION_SECONDS):
            return
        text = {'show': f'Remember shows Mindwell the recovered {child} role and fate in writing.',
                'return': f'Mindwell returns {child}_relic to its marked position beside that account.',
                'describe': f'Deliverance tells Waitstill which account and relic Mindwell matched.',
                'witness': f'Waitstill speaks and confirms the recovered {child} role and fate.'}[verb]
        modality = 'eyes' if verb in ('show', 'return') else 'ears'
        self.emit('contribution', E.HUB, text, None, modality)
        self.finale_log.append((verb + ':' + child, p.t,
                               {q.id: q.curse for q in self.players.values()}))
        self.part += 1
        if self.part == 4:
            self.confirmed.append(child)
            self.part = 0
            self.round += 1
            self.broadcast(f'{child} account acknowledged; {len(self.confirmed)}/4. '
                           'Its sound layer fades; its table position stays visibly acknowledged. '
                           'The fire continues toward the same deadline.')
        self.broadcast(self.instruction())

    def do_show(self, p, child):
        self.contribution(p, child, 'show')

    def do_return(self, p, child):
        self.contribution(p, child, 'return')

    def do_describe(self, p, child):
        self.contribution(p, child, 'describe')

    def do_witness(self, p, child):
        self.contribution(p, child, 'witness')

    def do_status(self, p, _):
        if self.advance(list(self.players.values()), ACTION_SECONDS):
            self.broadcast(self.instruction())

    def do_close(self, p, _):
        if self.phase != 'finale' or self.round != 4:
            raise E.Illegal('The loop cannot close: all four accounts must first be witnessed.')
        if p.id != 'deliverance' or 'voice' not in p.faculties:
            raise E.Illegal('Deliverance voices the agreed account while all four attend.')
        if not self.advance(list(self.players.values()), ACTION_SECONDS):
            return
        self.broadcast('Deliverance speaks the agreed account of all four children. '
                       'The fire and remaining voices cease; all four table positions stay acknowledged. '
                       'Usable room light returns. The loop has ended. Remove curses before moving.')
        self.finale_log.append(('close', p.t, {q.id: q.curse for q in self.players.values()}))
        self.over = dict(result='won', t=self.now(), why='You won because all four accounts were witnessed '
                         'and the agreed account was spoken before the fatal ending.')
        self.stages.append(('end', self.now()))

    def do_work(self, p, target):
        if self.phase == 'finale':
            raise E.Illegal('There is no additional box to solve. ' + self.instruction())
        super().do_work(p, target)

    def do_relay(self, p, target):
        if self.phase == 'finale' and ('voice' not in p.faculties or target == 'mindwell'):
            raise E.Illegal('Use the shown account for Mindwell; Remember may show writing, not speak.')
        super().do_relay(p, target)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--seed', type=int, default=0)
    args = parser.parse_args()
    sim.protocol(LoopGame(args.seed))
```

### Source: sim/test_loop_proposal.py

```python
import unittest
import engine as E
from loop_protocol import LoopGame, ORDER

class LoopRules(unittest.TestCase):
    def ready(self):
        g = LoopGame()
        g.t_turn = 120
        g.deadline = 720
        for p in g.players.values():
            p.t = 270
            p.cursed = True
            p.faculties.discard(p.bound)
        g.to_invoke = []
        g.invoke_next()
        return g

    def test_cannot_skip_roles_or_close_early(self):
        g = self.ready()
        with self.assertRaises(E.Illegal):
            g.do_close(g.players['deliverance'], None)
        with self.assertRaises(E.Illegal):
            g.do_witness(g.players['waitstill'], 'deliverance')
        self.assertEqual(g.round, 0)

    def test_each_role_contributes_and_win_is_terminal(self):
        g = self.ready()
        for child in E.CHILDREN:
            for role, verb in ORDER:
                getattr(g, 'do_' + verb)(g.players[role], child)
        g.do_close(g.players['deliverance'], None)
        self.assertEqual(g.over['result'], 'won')
        self.assertFalse(g.act('deliverance', {'action': 'close'})['ok'])
        self.assertTrue(all(p.cursed for p in g.players.values()))
        self.assertEqual(g.players['waitstill'].room, E.HUB)

    def test_exact_deadline_loses_before_acknowledgment(self):
        g = self.ready()
        for p in g.players.values():
            p.t = g.deadline - 15
        g.do_show(g.players['remember'], 'deliverance')
        self.assertEqual(g.over['result'], 'lost')
        self.assertEqual(g.part, 0)
        self.assertFalse(g.undefined)

    def test_objective_and_progress_use_real_available_channels(self):
        g = self.ready()
        deaf = g.observe(g.players['mindwell'])
        blind = g.observe(g.players['waitstill'])
        self.assertFalse(deaf['hears'])
        self.assertTrue(any('0/4 witnessed' in x for x in deaf['sees']))
        self.assertFalse(blind['sees'])
        self.assertTrue(any('0/4 witnessed' in x for x in blind['hears']))
        self.assertTrue(any('She is forcing' in x for x in deaf['sees']))
        self.assertTrue(any('She is forcing' in x for x in blind['hears']))

if __name__ == '__main__':
    unittest.main()
```

### Source: drive.py

```python
"""Observation-only protocol driver; scripts are player choices, not engine access."""
import json
import re
import subprocess
import sys
from pathlib import Path

CHILDREN = ['deliverance', 'waitstill', 'mindwell', 'remember']
name = sys.argv[1]
split = name == 'baseline-split'
args = ['python3', '-u', 'sim/sim.py', 'protocol', '--variant', 'loop', '--seed', '0']
if split:
    args += ['--set', 'GROUP_MOVES_TOGETHER=False']
if name.startswith('loop-'):
    args = ['python3', '-u', 'sim/loop_protocol.py', '--seed', '0']
proc = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
raw = open('transcripts/' + name + '.jsonl', 'w')
brief = open('transcripts/' + name + '.txt', 'w')
mem = {p: [] for p in CHILDREN}
visited = set()
probed = set()
shared = set()
finished = {p: set() for p in CHILDREN}

def receive():
    r = json.loads(proc.stdout.readline())
    raw.write(json.dumps({'response': r}) + '\n')
    for p, o in r['obs'].items():
        mem[p].extend(o['hears'] + o['notices'])
        if 'this room is finished' in o['sees']:
            finished[p].add(o['room'])
    return r

def send(r, action, reason):
    p = r['next']
    a = dict(player=p, **action)
    before = r['obs'][p]
    raw.write(json.dumps({'action': a, 'reason': reason}) + '\n')
    r = transmit(a)
    after = r['obs'][p]
    if action['action'] != 'wait':
        brief.write(f"{after['clock']} {p} {json.dumps(action)} | {reason}\n")
        for key in ('hears', 'notices'):
            for line in after[key]:
                brief.write('  ' + line + '\n')
        if not r['ok']:
            brief.write('  REFUSED: ' + r['error'] + '\n')
    return r

def transmit(a):
    proc.stdin.write(json.dumps(a) + '\n')
    proc.stdin.flush()
    return receive()

def investigation(r):
    p = r['next']; o = r['obs'][p]
    if 'curse' in o['can']:
        return {'action': 'curse'}, 'The spirit calls my child; apply the issued curse.'
    if o['holding']:
        return ({'action': 'place'} if o['room'] == 'seance' else {'action': 'go', 'to': 'seance'}), 'Return this keepsake to the table.'
    if o['room'] == 'seance':
        table = next(s for s in o['sees'] if s.startswith('relics on'))
        completed = [c for c in CHILDREN if c + '_relic' in table]
        # Only use visible relic custody, not other players\' private knowledge.
        if any(' takes ' in s and s.split(' takes ')[1].rstrip('.') not in table for s in mem[p]):
            return {'action': 'wait'}, 'Let the relic holder finish the return.'
        target = p if split else next((c for c in CHILDREN if c not in completed), None)
        if target and target in finished[p]:
            return {'action': 'wait'}, 'We finished that room; let its holder place the relic first.'
        if target and target not in completed:
            return {'action': 'go', 'to': target}, 'Try this child next; no spoken route instruction was supplied.'
        return {'action': 'wait'}, 'I have returned my relic.'
    step_line = next((s for s in o['sees'] if s.startswith('current step:')), '')
    if not step_line:
        return {'action': 'wait'}, 'Someone holds the relic; wait for the return.'
    sid = step_line.split()[2]
    # Deliberately try to help before reading, then obey the refusal.
    if not split and p == 'waitstill' and sid == 'deliverance_1' and 'help' not in probed:
        probed.add('help')
        return {'action': 'work'}, 'I want a job too; try helping before the reader has explained it.'
    lead = o['room']
    if p != lead:
        return {'action': 'wait'}, 'The current step has one job; let the child-linked player lead.'
    if sid not in o['knows']:
        return {'action': 'examine'}, 'Read/listen for what to do.'
    if not split and sid == 'deliverance_1' and 'earlyhint' not in probed:
        probed.add('earlyhint')
        return {'action': 'hint'}, 'I read the clue but still want direction; ask the medium now.'
    if 'hint' in o['can']:
        return {'action': 'hint'}, 'The medium now permits a nudge after repeated effort.'
    return {'action': 'work'}, 'Keep attempting the current task.'

def finale(r):
    p = r['next']; o = r['obs'][p]
    if 'premature-close' not in probed and p == 'deliverance':
        probed.add('premature-close')
        return {'action': 'close'}, 'We found all four fates already. Does saying them end this now?'
    if 'blind-move' not in probed and p == 'waitstill':
        probed.add('blind-move')
        return {'action': 'go', 'to': 'waitstill'}, 'Try returning to my room to check the account; respect any refusal.'
    if 'silent-speech' not in probed and p == 'remember':
        probed.add('silent-speech')
        return {'action': 'relay', 'to': 'mindwell'}, 'Try passing my account; find out which communication route is permitted.'
    # A loss run spends 90 seconds checking/rechecking each child account before showing it.
    # It still plays all four roles and makes progress; this is a deliberate slow-play stress case.
    instruction = next((x for x in reversed(mem[p]) if '/4 witnessed.' in x), '')
    if name == 'loop-loss' and 'show ' in instruction and p == 'remember':
        child = instruction.split('show ')[-1].rstrip('.')
        key = 'delayed-' + child
        count = sum(x == key for x in delays)
        if count < 6:
            delays.append(key)
            return {'action': 'status'}, 'I am rechecking the account and instructions before committing (15 seconds).'
    for legal in o['can']:
        verb, *target = legal.split()
        if verb in ('show', 'return', 'describe', 'witness', 'close'):
            return dict(action=verb, **({'to': target[0]} if target else {})), 'Use my remaining faculty to pass the shared account onward.'
    return {'action': 'wait'}, 'Wait for the next named contribution at the same table.'

delays = []

r = receive()
for i in range(6000):
    if 'over' in r:
        break
    action, reason = investigation(r) if r['obs'][r['next']]['phase'] != 'finale' else finale(r)
    r = send(r, action, reason)
else:
    raise RuntimeError('driver did not terminate')
brief.write('\nSUMMARY ' + json.dumps(r['summary'], indent=2) + '\n')
Path('transcripts/' + name + '-summary.json').write_text(json.dumps(r['summary'], indent=2))
proc.stdin.close(); proc.wait(timeout=5)
print(name, r['summary']['result'], r['summary']['total'], r['summary']['why'])
```

## Completion record

Applied the captain-hold lifecycle skill after reviewing the report. The unresolved adoption choices are already carried by captain-held `halloween-2026-review`: the mother's intention, symbolic unfinished act, winning action, visible failure and time budget. This scout makes no captain decision and creates no duplicate task.

```text
FM_HOME=/media/griswald/wd-black-2tb/personal/firstmate bin/fm-captain-hold.sh complete hw-play-loop halloween-2026-review
complete: hw-play-loop captain-call inventory reviewed (halloween-2026-review)
```

No other captain-gated implementation was started. The report's suggestions remain proposals.
