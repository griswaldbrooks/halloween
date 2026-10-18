"""Every tunable constant of the simulation, one per line, with the basis of the estimate.

All durations are real-world seconds. Every number here is a guess to be replaced by
rehearsal measurements; none of them is a design decision. `python3 sim.py config` prints
this file's constants with their comments; `--set NAME=VALUE` overrides one for a run.
"""

# --- opening -------------------------------------------------------------------------
SEANCE_OPENING_SECONDS = 180     # hw-design-rage section 3: 0:30 safety at the door, framing, binding and demo, the spirit's yes/no, the first door: medium's framing, objects handed out, "if the spirit calls you, obey": a typical escape-room briefing runs 2 to 3 min
# --- movement ------------------------------------------------------------------------
TRAVEL_SECONDS = 15              # hw-design-rage: spokes adjacent to the hub, within fifteen seconds; was 20: one walk between the seance room and a child's room: about 10 m at indoor pace plus four people bunching at a doorway
SPOKE_TO_SPOKE_DIRECT = False    # hub-and-spoke: a child's room connects only through the seance room (captain, 2026-10-08); True would allow spoke-to-spoke walks at one TRAVEL_SECONDS
GROUP_MOVES_TOGETHER = True      # captain: "go out to one child's puzzle, come back" reads as the whole group moving; False lets players walk alone
SPOKE_ORDER_FIXED = True         # hw-design-rage 5: the spirit names each door; order fixed. Was False: False: children's rooms may be visited in any order; True: Deliverance, Waitstill, Mindwell, Remember in that order
# --- the four child puzzles (contents unspecified by the handoff; these are shapes only) ---
SPOKE_STEP_COUNT = 1             # hw-design-rage: one gate per room (synthesis rule change 4). Was 2: steps per child's puzzle: two learn-then-use beats per child (notes 2026-10-01 "learn-then-use pairs")
SPOKE_STEP_SECONDS = 75          # default gate effort; overridden per child by SPOKE_SECONDS_BY_CHILD. Was 60: base solve time of one step for an average group: a short escape-room puzzle beat; a 20-min game cannot afford the 4 to 6 min typical of 60-min rooms
STEP_EXAMINE_SECONDS = 20        # reading one clue card or looking over one prop: about 60 words read aloud
STEP_WORK_CHUNK_SECONDS = 15     # granularity of effort: one `work` action is this much trying before the engine re-evaluates
STEP_TIME_JITTER = (0.7, 1.6)    # hidden per-step multiplier on SPOKE_STEP_SECONDS drawn per run: groups are faster or slower than the designer's estimate; (1.0, 1.0) makes runs deterministic
REVEAL_SECONDS = 30              # the fate beat through the prop plus the medium's one line: the child's role and fate landing (read or heard) at the end of a spoke: one short letter or recording
# --- the medium's hints ------------------------------------------------------------------
HINT_AFTER_SECONDS = 90          # hw-design-rage section 4: nudge at 1:30 stuck, push at 3:00 (a second hint); halved in the finale. Was 60: effort on one step before the medium offers a hint: escape-room GMs nudge after 2 to 3 min of no progress; shortened for a 20-min game
HINT_SECONDS = 15                # the medium speaking one hint
HINT_FRACTION = 0.5              # a hint removes this fraction of the remaining effort on the step
HINT_MAX = None                  # cap on hints per run (None: unlimited); the handoff says nothing about a cap
MEDIUM_WITH_GROUP = True         # True: the medium walks with the group and can hint anywhere the whole group is; False: she stays at the table and hints only in the seance room
# --- talking ---------------------------------------------------------------------------
RELAY_SECONDS = 15               # one player telling one other player one clue
CONFER_SECONDS = 20              # everyone present pooling what they know
WAIT_SECONDS = 10                # idle granularity when nobody else is ahead to wait for
# --- the seance table and the turn ---------------------------------------------------------
PLACE_RELIC_SECONDS = 10         # setting the relic in its painted outline: setting a relic on its marked position
TURN_REVEAL_SECONDS = 40         # hw-design-rage section 6: T1 'none of them left the house' (20 s) and the room turning (15 s) after the bell (5 s). Was 30: the truth landing and the mother breaking down (handoff 9, steps 1 to 5): a performed beat, not a puzzle
MEDIUM_INVOCATION_SECONDS = 5    # 'She calls Deliverance: your hands.' Was 15: the medium calling one player by their child's name (handoff 8)
CURSE_APPLY_SECONDS = 10         # gauntlets on, veil down, muffs on, ribbon tightened: each demonstrated at the opening. Was 15: the called player putting on their own gloves, blindfold or earmuffs, or taking the silence card: blindfold about 10 s, bulky gloves about 20 s
INVOCATION_ORDER = ("deliverance", "waitstill", "mindwell", "remember")  # the handoff gives no order; this is the table order of handoff section 2
FIRE_TIMER_SECONDS = 420         # hw-design-rage CAPTAIN CALL 3: a 7:00 clock; the handoff's ~10 minutes is the alternative. Was 600: handoff 10: "a fixed soundtrack of perhaps ~10 minutes"
FIRE_TIMER_STARTS = "after_curses"  # hw-design-rage CAPTAIN CALL 4: the clock starts at the medium's "now", after the fourth curse and the objective. Was "turn": "turn": the soundtrack starts at the fourth relic, before the curses (handoff 9 order: fire audio is step 3, curses step 6); "after_curses": starts once all four are cursed
# --- hw-design-rage additions ------------------------------------------------------------
SPOKE_SECONDS_BY_CHILD = {"deliverance": 90, "waitstill": 75, "mindwell": 75, "remember": 60}  # section 5 gate estimates: the drop; the signal; the decode and the knot; the tiles
RETURN_BEAT_SECONDS = 25         # section 5.5: the mother's recorded line (15 s) and the medium naming the next door (10 s), everyone at the table
THREAT_SECONDS = 20              # section 6: T2, her intention, with the bed ducked
OBJECTIVE_SECONDS = 15           # section 6: the medium says the objective sentence and lays the card; then "now" starts the clock
BYPASS_AFTER_SECONDS = 240       # section 4: at 4:00 of effort on a gate the medium bypasses it ("She calls X: do Y"); halved in the finale
SHOW_SECONDS = 25                # writing a word on the slate or pointing a page for one player to see
RAGE_STAGES = ((300, "Josiah."), (180, "As you condemned me, I condemn you."), (60, "The fire turns to him."))  # section 7.1 marks: (fire left, her line); each also steps the light
PLANTED = {"deliverance": ("carried",), "waitstill": ("seen",), "mindwell": (), "remember": ("said", "slate", "testimony")}  # what each spoke plants in its bearer; Mindwell's page must be pointed out by a hearer in the finale
