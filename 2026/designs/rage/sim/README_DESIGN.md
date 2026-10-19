# hw-design-rage simulation copy

A copy of `data/hw-sim-engine/` with the rage design of `data/hw-design-rage/report.md` encoded. The pristine engine is untouched; `design.diff` is the exact change against it.

What changed (all in `config.py` and `engine.py`, each line commented with the report section it comes from):
- One gate per room with per-room effort (`SPOKE_SECONDS_BY_CHILD`), fixed order, opening 3:00, walks 15 s, a 25 s return beat after each placement (the mother's line and the next door).
- The turn as section 6: 40 s reveal, 20 s threat, four invocations of 5 s plus 10 s to apply each curse, 15 s objective; the 7:00 clock starts after that (`FIRE_TIMER_STARTS="after_curses"`, `FIRE_TIMER_SECONDS=420`).
- The finale preset `rage`: carried, seen, heard, said in parallel; `slate` (Remember's assembly, requires all four); `testimony` (requires the slate; any voice). Finale knowledge is planted in each bearer at the end of that child's room (`PLANTED`), not at the finale.
- The `show` action (slate or pointing): the shower needs hands, the shown needs eyes. Relay to the deaf and from the silenced is refused at no cost.
- The medium's ladder: hint offered at 90 s of effort (45 s in the finale), bypass at 240 s (120 s in the finale).
- Marks on the fire clock (`RAGE_STAGES`) spoken and shown; the loss names the tier (children heard); a win on the testimony.
- A called player who does something else is refused without penalty instead of ending the run.

Run: `python3 drive.py transcripts/win.moves out.txt --seed 1` (see `drive.py` for the moves format); `python3 -m unittest test_engine` (18 tests).
Transcripts kept: `baseline.txt` (deterministic), `win.txt` (seed 1), `slow_parallel.txt` (seed 5, 1.2 to 1.6 x), `loss.txt` (seed 5, sequential), `loss_seed1.txt`, `worst.txt` (1.6 x fixed), `slow_parallel_clockturn.txt` (clock at the turn), `slow_parallel_clock8.txt`, `slow_sequential_clock10.txt`.
