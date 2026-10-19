#!/usr/bin/env python3
"""Plays the investigation with the bot, then drives the finale from a script of (player, action[, to]) lines.

  python3 finale_drive.py transcripts/win.finale --seed 1 [--set K=V]

Script lines: `player: action [to]`; blank lines and # comments ignored. The engine's clock decides who acts;
a player with nothing queued waits. A refused action is logged (!!) and dropped, costing nothing, as in the room.
Writes <script>.txt (the transcript from the fourth curse) and prints it with the summary."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C
import engine as E
import sim

def main():
    script = sys.argv[1]; args = sim.parse_args(["bot", "--finale", "resurrection"] + sys.argv[2:])
    sim.apply_sets(args.set)
    g = E.Game(args.variant, args.seed, "resurrection")
    while not g.over and g.phase != "finale":  # the bot plays the investigation and obeys the calls
        p = g.next_player(); g.act(p.id, sim.bot_plan(g, p))
    for p in g.players.values():
        g.observe(p)  # clear what was seen before the clock
    script_lines = []
    for line in open(script):
        line = line.split("#")[0].strip()
        if not line: continue
        who, _, rest = line.partition(":"); w = rest.split()
        script_lines.append((who.strip(), dict(action=w[0], to=w[1] if len(w) > 1 else None)))
    out = ["# %s: finale from time zero %s (fourth curse at %s)" % (script, E.fmt(g.t_zero), E.fmt(g.stages[-1][1]))]
    def log(p, a, r):
        o = g.observe(p)
        tail = "; ".join(o["hears"] + o["notices"])
        if a["action"] == "wait" and r["ok"] and not tail: return
        line = "%s +%s %-11s %-18s %s" % (o["clock"], E.fmt(p.t - g.t_zero), p.id, a["action"] + (" " + a["to"] if a.get("to") else ""), ("!! " + r["error"]) if not r["ok"] else "")
        if tail: line += " | " + tail
        out.append(line)
        for pid, q in g.players.items():
            if pid == p.id: continue
            ob = g.observe(q); t = "; ".join(ob["hears"] + ob["notices"])
            if t: out.append("      -> %-11s %s" % (pid, t))
    # strict sequence: everyone else passes until the named player holds the lowest clock
    for who, a in script_lines:
        guard = 0
        while not g.over:
            p = g.next_player()
            if p.id == who:
                log(p, a, g.act(p.id, a)); break
            log(p, dict(action="wait"), g.act(p.id, dict(action="wait")))
            guard += 1
            if guard > 200: out.append("(driver: %s never became free)" % who); break
        if g.over: break
    s = g.summary()
    out.append("== %s == %s" % (s["result"].upper(), s["why"]))
    out.append("total %s; stages: %s; hints %d; taken %s" % (E.fmt(s["total"]), ", ".join("%s %s" % (n, E.fmt(t)) for n, t in s["stages"]), s["hints"], s["taken"]))
    for st, t, c in s["finale"]:
        if not st.startswith("curse:"): out.append("  finale %-18s %s" % (st, t))
    open(script + ".txt", "w").write("\n".join(out) + "\n")
    print("\n".join(out))
main()
