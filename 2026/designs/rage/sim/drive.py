#!/usr/bin/env python3
"""Replay a moves file against the engine.

  python3 drive.py MOVES OUT [--seed N] [--variant rage] [--finale rage] [--set K=V ...]

Moves file, one move per line, `player action [to]`; `#` starts a comment.
  sync            a barrier: the moves above it finish (every player's queue empty) before any below start
  P needs X       P waits until they know step X (told, shown, examined or planted)
  P work* X       P repeats `work X` until the step is done or the engine refuses it for good
  P workh* X      the same, taking the medium's hint whenever she offers it
Between barriers each player's moves run as their own queue, so pieces run in parallel. The player
whose clock is lowest acts; an empty queue means they wait. A refused move is retried after a
wait up to sixty times (a precondition another player is still producing), then dropped and
logged. A player the spirit has called applies their curse regardless of the script.
Output: the acting player's clock, their move, what they heard and noticed, the fire left.
"""
import contextlib
import io
import sys

import config as C
import engine as E
import sim


def main(argv):
    moves_path, out_path = argv[0], argv[1]
    seed, variant, finale, sets = 0, "rage", "rage", []
    i = 2
    while i < len(argv):
        if argv[i] == "--seed": seed = int(argv[i + 1]); i += 2
        elif argv[i] == "--variant": variant = argv[i + 1]; i += 2
        elif argv[i] == "--finale": finale = argv[i + 1]; i += 2
        elif argv[i] == "--set": sets.append(argv[i + 1]); i += 2
        else: sys.exit("unknown arg %r" % argv[i])
    sim.apply_sets(sets)
    segments, cur = [], {c: [] for c in E.CHILDREN}
    for line in open(moves_path):
        line = line.split("#")[0].strip()
        if not line:
            continue
        if line == "sync":
            segments.append(cur); cur = {c: [] for c in E.CHILDREN}; continue
        w = line.split()
        cur[w[0]].append([w[1], w[2] if len(w) > 2 else None, 0])
    segments.append(cur)
    g = E.Game(variant, seed, finale)
    out = open(out_path, "w")

    def log(p, what, r):
        obs = g.observe(p)
        tail = ("!! " + r["error"]) if not r["ok"] else "; ".join(obs["hears"] + obs["notices"])
        fire = ("  [fire %s]" % E.fmt(obs["fire_remaining"])) if "fire_remaining" in obs else ""
        out.write("%s %-11s %-18s %s%s\n" % (obs["clock"], p.id, what, tail[:230], fire))

    queues = segments.pop(0)
    n = 0
    while not g.over and n < 6000:
        n += 1
        p = g.next_player()
        if g.invoked == p.id:
            log(p, "curse", g.act(p.id, dict(action="curse"))); continue
        if all(not q for q in queues.values()):
            if not segments:
                break
            queues = segments.pop(0)
        q = queues[p.id]
        if not q:
            g.act(p.id, dict(action="wait")); g.observe(p); continue
        action, to, tries = q[0]
        if action == "needs":
            if to in p.knows:
                q.pop(0)
            else:
                g.act(p.id, dict(action="wait")); g.observe(p)
            continue
        if action in ("work*", "workh*"):
            step = g.steps.get(to) if to else g.current_step(p.room)
            sid = step.id if step else None
            hint_name = "hint" + ((" " + sid) if (g.phase == "finale" and p.room == E.HUB and sid) else "")
            if action == "workh*" and sid and hint_name in g.legal(p):
                log(p, "hint " + (to or ""), g.act(p.id, dict(action="hint", to=to))); continue
            r = g.act(p.id, dict(action="work", to=to))
            if r["ok"] or q[0][2] >= 60:
                log(p, "work " + (to or ""), r)
            if (sid and g.steps[sid].done) or g.over or (not r["ok"] and q[0][2] >= 60):
                q.pop(0)
            elif not r["ok"]:
                q[0][2] += 1; g.act(p.id, dict(action="wait")); g.observe(p)
            continue
        r = g.act(p.id, dict(action=action, to=to))
        if r["ok"] or q[0][2] >= 60:
            log(p, action + (" " + to if to else ""), r); q.pop(0)
        else:
            q[0][2] += 1; g.act(p.id, dict(action="wait")); g.observe(p)
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        s = sim.finish(g)
    out.write(buf.getvalue()); out.close()
    print(buf.getvalue())
    return s


if __name__ == "__main__":
    main(sys.argv[1:])
