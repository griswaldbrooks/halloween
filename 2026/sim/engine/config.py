"""Every tunable constant of the simulation, one per line, with the basis of the estimate.

All durations are real-world seconds. Every number here is a guess to be replaced by
rehearsal measurements; none of them is a design decision. `python3 sim.py config` prints
this file's constants with their comments; `--set NAME=VALUE` overrides one for a run.
"""

# --- opening -------------------------------------------------------------------------
SEANCE_OPENING_SECONDS = 120     # medium's framing, objects handed out, "if the spirit calls you, obey": a typical escape-room briefing runs 2 to 3 min
# --- movement ------------------------------------------------------------------------
TRAVEL_SECONDS = 20              # one walk between the seance room and a child's room: about 10 m at indoor pace plus four people bunching at a doorway
SPOKE_TO_SPOKE_DIRECT = False    # hub-and-spoke: a child's room connects only through the seance room (captain, 2026-10-08); True would allow spoke-to-spoke walks at one TRAVEL_SECONDS
GROUP_MOVES_TOGETHER = True      # captain: "go out to one child's puzzle, come back" reads as the whole group moving; False lets players walk alone
SPOKE_ORDER_FIXED = False        # False: children's rooms may be visited in any order; True: Deliverance, Waitstill, Mindwell, Remember in that order
# --- the four child puzzles (contents unspecified by the handoff; these are shapes only) ---
SPOKE_STEP_COUNT = 2             # steps per child's puzzle: two learn-then-use beats per child (notes 2026-10-01 "learn-then-use pairs")
SPOKE_STEP_SECONDS = 60          # base solve time of one step for an average group: a short escape-room puzzle beat; a 20-min game cannot afford the 4 to 6 min typical of 60-min rooms
STEP_EXAMINE_SECONDS = 20        # reading one clue card or looking over one prop: about 60 words read aloud
STEP_WORK_CHUNK_SECONDS = 15     # granularity of effort: one `work` action is this much trying before the engine re-evaluates
STEP_TIME_JITTER = (0.7, 1.6)    # hidden per-step multiplier on SPOKE_STEP_SECONDS drawn per run: groups are faster or slower than the designer's estimate; (1.0, 1.0) makes runs deterministic
REVEAL_SECONDS = 30              # the child's role and fate landing (read or heard) at the end of a spoke: one short letter or recording
# --- the medium's hints ------------------------------------------------------------------
HINT_AFTER_SECONDS = 60          # effort on one step before the medium offers a hint: escape-room GMs nudge after 2 to 3 min of no progress; shortened for a 20-min game
HINT_SECONDS = 15                # the medium speaking one hint
HINT_FRACTION = 0.5              # a hint removes this fraction of the remaining effort on the step
HINT_MAX = None                  # cap on hints per run (None: unlimited); the handoff says nothing about a cap
MEDIUM_WITH_GROUP = True         # True: the medium walks with the group and can hint anywhere the whole group is; False: she stays at the table and hints only in the seance room
# --- talking ---------------------------------------------------------------------------
RELAY_SECONDS = 15               # one player telling one other player one clue
CONFER_SECONDS = 20              # everyone present pooling what they know
WAIT_SECONDS = 10                # idle granularity when nobody else is ahead to wait for
# --- the seance table and the turn ---------------------------------------------------------
PLACE_RELIC_SECONDS = 10         # setting a relic on its marked position
TURN_REVEAL_SECONDS = 30         # the truth landing and the mother breaking down (handoff 9, steps 1 to 5): a performed beat, not a puzzle
MEDIUM_INVOCATION_SECONDS = 15   # the medium calling one player by their child's name (handoff 8)
CURSE_APPLY_SECONDS = 15         # the called player putting on their own gloves, blindfold or earmuffs, or taking the silence card: blindfold about 10 s, bulky gloves about 20 s
INVOCATION_ORDER = ("deliverance", "waitstill", "mindwell", "remember")  # the handoff gives no order; this is the table order of handoff section 2
FIRE_TIMER_SECONDS = 600         # handoff 10: "a fixed soundtrack of perhaps ~10 minutes"
FIRE_TIMER_STARTS = "turn"       # "turn": the soundtrack starts at the fourth relic, before the curses (handoff 9 order: fire audio is step 3, curses step 6); "after_curses": starts once all four are cursed
