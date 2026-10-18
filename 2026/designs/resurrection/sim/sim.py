#!/usr/bin/env python3
"""Halloween 2026 text simulation. Standard library only.

  python3 sim.py play      [--variant V] [--seed N] [--finale none|floated] [--set K=V ...]
  python3 sim.py protocol  [same options]   JSON lines in, JSON lines out (see README)
  python3 sim.py bot       [same options] [--quiet]
  python3 sim.py config                     every tunable with its comment
  python3 sim.py questions                  every rule gap the engine can raise, by stage
"""
import argparse
import ast
import json
import os
import re
import sys

import config as C
import engine as E

HERE = os.path.dirname(os.path.abspath(__file__))


def parse_args(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("mode", choices=["play", "protocol", "bot", "config", "questions"])
    ap.add_argument("--variant", default="resurrection", choices=sorted(E.VARIANTS))
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--finale", default="none", choices=sorted(E.FINALE_PRESETS))
    ap.add_argument("--set", action="append", default=[], metavar="NAME=VALUE", help="override a config constant for this run")
    ap.add_argument("--quiet", action="store_true", help="bot: print only the summary")
    return ap.parse_args(argv)


def apply_sets(sets):
    for s in sets:
        name, _, val = s.partition("=")
        if not hasattr(C, name) or name.startswith("_"):
            sys.exit("unknown constant %r; see `sim.py config`" % name)
        setattr(C, name, ast.literal_eval(val))


def config_lines():
    with open(os.path.join(HERE, "config.py")) as f:
        src = f.read()
    seen = {}
    for m in re.finditer(r"^([A-Z_]+)\s*=\s*(.+?)\s+#\s*(.*)$", src, re.M):
        seen[m.group(1)] = m.group(3)  # a later redefinition (the design block) wins, as in Python
    for name, comment in seen.items():
        yield name, getattr(C, name), comment


def questions():
    """Every Undefined the engine can raise, with the function it lives in: the rule-gap inventory."""
    with open(os.path.join(HERE, "engine.py")) as f:
        src = f.read()
    out = []
    for m in re.finditer(r"def (\w+)\(|Undefined\(\s*(\"(?:[^\"\\]|\\.)*\")", src):
        if m.group(1):
            func = m.group(1)
        else:
            out.append((func, ast.literal_eval(m.group(2))))
    for name, v in E.VARIANTS.items():
        out.append(("variant:" + name, v["missing"]))
    return out


def parse_text_action(line):
    words = line.split()
    if not words:
        return None
    verb, arg = words[0], (words[1] if len(words) > 1 else None)
    return dict(action=verb, to=arg)


def show(obs):
    print("\n[%s] %s (%s%s) in %s%s" % (obs["clock"], obs["player"], obs["bound"],
          ", " + obs["curse"] if obs["curse"] else "", obs["room"],
          "   fire: %s left" % E.fmt(obs["fire_remaining"]) if "fire_remaining" in obs else ""))
    for k in ("sees", "hears", "notices"):
        for line in obs[k]:
            print("  %-7s %s" % (k + ":", line))
    if obs["knows"] or obs["holding"]:
        print("  knows: %s  holding: %s" % (", ".join(obs["knows"]) or "-", obs["holding"] or "-"))
    print("  can: %s" % ", ".join(obs["can"]))


def finish(game):
    s = game.summary()
    print("\n== %s ==" % s["result"].upper())
    print(s["why"])
    print("total run length: %s (target 20:00)" % E.fmt(s["total"]))
    print("time per stage:")
    for name, secs in s["stages"]:
        print("  %-14s %s" % (name, E.fmt(secs)))
    print("hints used: %d" % s["hints"])
    if s["finale"]:
        print("curses active at each finale step:")
        for step, t, curses in s["finale"]:
            print("  %-16s %s  %s" % (step, t, ", ".join("%s=%s" % (k, v or "-") for k, v in curses.items())))
    print("undefined rules hit:")
    for t, q in s["undefined"] or [("-", "none")]:
        print("  %s  %s" % (t, q))
    return s


def play(game):
    print(__doc__.split("\n")[0])
    print("You drive all four players. Commands: " + ", ".join(
        ["go <room>", "examine", "work", "hint", "relay <player>", "confer", "place", "curse", "wait", "look", "quit"]))
    while not game.over:
        p = game.next_player()
        show(game.observe(p))
        try:
            line = input("%s> " % p.id).strip()
        except EOFError:
            print()
            return
        if line in ("quit", "q"):
            return
        if line == "look":
            p.seen = max(0, p.seen - 20)
            continue
        a = parse_text_action(line)
        if not a:
            continue
        r = game.act(p.id, a)
        if not r["ok"]:
            print("  !! " + r["error"])
    finish(game)


def protocol(game):
    def emit(extra):
        line = dict(next=game.next_player().id if not game.over else None,
                    obs={pid: game.observe(p) for pid, p in game.players.items()})
        line.update(extra)
        if game.over:
            line["over"] = game.over
            line["summary"] = game.summary()
        print(json.dumps(line), flush=True)

    emit(dict(ok=True))
    for raw in sys.stdin:
        raw = raw.strip()
        if not raw:
            continue
        try:
            a = json.loads(raw)
        except ValueError as e:
            emit(dict(ok=False, error="bad json: %s" % e))
            continue
        if a.get("action") == "observe":
            emit(dict(ok=True))
            continue
        emit(game.act(a.get("player"), a))
        if game.over:
            return


def bot_plan(game, p):
    """One plausible move for player p. Group mode: the player bound to the room's child leads
    that puzzle, the rest wait. Split mode (GROUP_MOVES_TOGETHER=False): each player takes
    their own child's room alone."""
    hub, ps = E.HUB, game.players
    wait = dict(action="wait")
    if game.invoked:
        return dict(action="curse")
    if game.phase == "investigation":
        if p.relic:
            return dict(action="place") if p.room == hub else dict(action="go", to=hub)
        if p.room == hub:
            if any(q.relic for q in ps.values()):
                return wait  # let the relic holder place it before the group leaves
            todo = [c for c in E.CHILDREN if game.players_relic_outstanding(c)]
            if C.GROUP_MOVES_TOGETHER:
                return dict(action="go", to=todo[0]) if todo else wait
            return dict(action="go", to=p.id) if p.id in todo else wait
        step = game.current_step(p.room)
        lead = p.room if C.GROUP_MOVES_TOGETHER else p.id  # the player bound to the child leads that child's room
        if not step or p.id != lead:
            return wait
        if step.id not in p.knows:
            return dict(action="examine")
        th = game.hint_threshold(step)
        if th is not None and step.worked >= th and (C.HINT_MAX is None or game.hints < C.HINT_MAX):
            return dict(action="hint")
        return dict(action="work")
    # finale: the party stays at the table and works the floated props in order
    step = game.current_step(hub)
    if not step:
        return wait
    knowers = [q for q in ps.values() if step.id in q.knows]
    doers = [q for q in ps.values() if step.needs <= q.faculties and (not step.by or q.id == step.by)]
    if step.by:  # the actor must do it with a crew of knowers covering the rest (design 7.2, Remember's own act)
        actor = ps[step.by]
        have = set().union(*[q.faculties for q in knowers]) if knowers else set()
        if actor in knowers and step.needs <= have:
            want = actor.id, dict(action="work")
        else:
            missing = step.needs - actor.faculties
            target = [q for q in ps.values() if q is not actor and missing <= q.faculties][0]
            want = actor.id, dict(action="relay", to=target.id)
        return want[1] if want[0] == p.id else wait
    if not knowers:
        perceivers = [q for q in ps.values() if step.clue in q.faculties] or [ps["deliverance"]]
        want = perceivers[0].id, dict(action="examine")
    elif [q for q in doers if q in knowers]:
        want = [q for q in doers if q in knowers][0].id, dict(action="work")
    elif game.hint_threshold(step) is not None and step.worked >= game.hint_threshold(step):
        want = knowers[0].id, dict(action="hint")
    else:
        want = knowers[0].id, dict(action="relay", to=(doers[0] if doers else ps["deliverance"]).id)
    return want[1] if want[0] == p.id else wait


def bot(game, quiet):
    steps = 0
    while not game.over and steps < 5000:
        p = game.next_player()
        a = bot_plan(game, p)
        r = game.act(p.id, a)
        steps += 1
        obs = {pid: game.observe(q) for pid, q in game.players.items()}[p.id]
        if not quiet and (a["action"] != "wait" or not r["ok"]):
            what = a["action"] + (" " + a["to"] if a.get("to") else "")
            tail = "; ".join(obs["hears"] + obs["notices"])
            print("%s %-11s %-16s %s" % (obs["clock"], p.id, what, ("!! " + r["error"]) if not r["ok"] else tail))
        if not r["ok"]:
            print("bot has no legal move: %s" % r["error"])
            break
    return finish(game)


def main(argv=None):
    args = parse_args(argv)
    apply_sets(args.set)
    if args.mode == "config":
        for name, val, comment in config_lines():
            print("%-26s = %-28r # %s" % (name, val, comment))
        return
    if args.mode == "questions":
        for func, q in questions():
            print("%-14s %s" % (func, q))
        return
    game = E.Game(args.variant, args.seed, args.finale)
    if args.mode == "play":
        play(game)
    elif args.mode == "protocol":
        protocol(game)
    else:
        print("bot: variant=%s seed=%d finale=%s %s" % (args.variant, args.seed, args.finale, " ".join(args.set)))
        bot(game, args.quiet)


if __name__ == "__main__":
    main()
