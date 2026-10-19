"""Halloween 2026 hub-and-spoke game engine. Python 3 standard library only.

Model: four players, each with their own clock in real seconds. Only the player with the
lowest clock may act (ties: table order), so causality holds; joint actions pull every
participant forward to the same moment. Rooms are the seance room (hub) and one room per
child (spokes). Where the handoff gives no rule the engine raises Undefined and the run
ends; the question is the deliverable, not a guess.
"""
import random

import config as C

CHILDREN = ("deliverance", "waitstill", "mindwell", "remember")
FACULTY = {"deliverance": "hands", "waitstill": "eyes", "mindwell": "ears", "remember": "voice"}
CURSE = {"hands": "gloved", "eyes": "blindfolded", "ears": "muffled", "voice": "silenced"}
HUB = "seance"
ROOMS = (HUB,) + CHILDREN
ALL_FACULTIES = frozenset(FACULTY.values())


class Undefined(Exception):
    """The handoff does not say what happens here. The message is the missing rule as a question."""


class Illegal(Exception):
    """The action is refused by a rule the handoff does give (or by physics). Costs no time."""


# Finale variants, implemented exactly as far as handoff section 13 states them.
VARIANTS = {
    "resurrection": dict(
        objective="Prevent the mother's ritual from completing. She intends to resurrect her four children using you as vessels or sacrifices.",
        loss="the ritual completed; the handoff says the players are her vessels or sacrifices but not what that looks like",
        missing="What player action prevents the resurrection ritual, and how is the ritual's progress shown to the players? (handoff 13, resurrection)",
    ),
    "rage": dict(
        objective="She means to put him into the fire. Before it reaches him, give her the report her children never gave: what was seen, what was heard, what was carried, what was said, and one of you say it to her whole. Each child she hears will fall quiet. You'll know it worked when the screaming stops and she answers him. Start with what is in front of you.",
        loss="the fire reached him: his voice joined the children's screams, then silence and darkness; the medium lit her lamp and named who was at rest",
        win_step="testimony",  # hw-design-rage: the report said whole, after the slate is assembled
        missing="(answered by hw-design-rage: the reason is in the four relics, one line each, assembled on the slate and spoken)",
    ),
    "loop": dict(
        objective="Alter, complete, or symbolically resolve something left unfinished before the loop reaches its fatal conclusion.",
        loss="the loop reached its fatal conclusion; the handoff does not say what that does to the players",
        missing="What was left unfinished in the historical fire, and what act resolves it? (handoff 13, trapped loop)",
    ),
    "rescue": dict(
        objective="Get the children out of the burning house.",
        loss="the children were not got out; the handoff does not say what that means for children already dead",
        missing="What object or signal stands for each child in the fire, and where must it be taken for that child to count as out? (handoff 13, rescue)",
    ),
}

# Finale step presets. "none": the handoff specifies no finale puzzle. "floated": the four
# prop concepts of handoff section 10, which it marks exploratory, not locked. Each row:
# (id, needs, clue modality, holder, performer, seconds, source).
FINALE_PRESETS = {
    "none": [],
    # hw-design-rage section 7: four pieces in parallel, the assembly, then the testimony.
    # Knowledge of carried/seen/said/slate/testimony is planted at the end of that child's spoke (finish_spoke), not here.
    "rage": [
        ("carried", "hands", "eyes", None, None, 60, "the sealed paper: the gloved bearer knows the fold and reads; another's hands open it", ()),
        ("seen", "eyes", "eyes", None, "waitstill", 60, "the slate: a sighted player reads the marks; the blind bearer, who read the key, says what they mean", ()),
        ("heard", "eyes", "ears", None, "mindwell", 75, "the ear-book: hearers catch the fire's whisper and point the page; the deaf bearer decodes it", ()),
        ("said", "hands", "eyes", None, "remember", 30, "the father's words: the silenced bearer writes them from memory", ()),
        ("slate", "hands", "eyes", None, "remember", 45, "the assembly: Remember writes the four lines in the form and raises the board", ("carried", "seen", "heard", "said")),
        ("testimony", "voice", "eyes", None, None, 30, "one voice says the report whole; Remember shows the speaker the slate", ("slate",)),
    ],
    "floated": [
        ("satchel", "hands", "eyes", "deliverance", None, 60, "handoff 10 Deliverance: gloved player has the interpretation, another operates the lock"),
        ("whisper_box", "hands", "ears", None, "mindwell", 60, "handoff 10 Mindwell: others hear the whisper in the soundscape and relay it to the hearing-impaired player"),
        ("lookout", "eyes", "eyes", "waitstill", None, 60, "handoff 10 Waitstill: blind player has the knowledge, others are the eyes"),
        ("testimony", "voice", "eyes", "remember", None, 60, "handoff 10 Remember: a final message must be voiced despite the silence curse"),
    ],
}


def fmt(t):
    return "%d:%02d" % divmod(int(t), 60)


class Player:
    def __init__(self, child):
        self.id = child
        self.bound = FACULTY[child]
        self.t = 0
        self.room = HUB
        self.faculties = set(ALL_FACULTIES)
        self.knows = set()
        self.relic = None
        self.cursed = False
        self.passed_at = -1  # clock at which this player last passed (waited with nobody ahead)
        self.seen = 0  # index into game.events already observed

    @property
    def curse(self):
        return CURSE[self.bound] if self.cursed else None


class Step:
    def __init__(self, sid, room, needs, clue, seconds, holder=None, by=None, src="", requires=()):
        self.id, self.room, self.needs, self.clue = sid, room, frozenset(needs), clue
        self.base, self.holder, self.by, self.src = seconds, holder, by, src
        self.requires = frozenset(requires)
        self.remaining = seconds
        self.worked = 0
        self.hinted_at = 0  # effort at the last hint: the medium waits HINT_AFTER_SECONDS again before the next
        self.until = 0  # wall-clock moment up to which effort has already been credited
        self.done = False


class Game:
    def __init__(self, variant="resurrection", seed=0, finale="none"):
        if variant not in VARIANTS:
            raise ValueError("unknown variant %r (choose from %s)" % (variant, ", ".join(VARIANTS)))
        self.variant_name, self.variant = variant, VARIANTS[variant]
        self.rng = random.Random(seed)
        self.players = {c: Player(c) for c in CHILDREN}
        self.events = []
        self.undefined = []
        self.over = None
        self.hints = 0
        self.relics = []           # relics on the table, in placement order
        self.phase = "investigation"
        self.invoked = None        # player currently called by the medium
        self.to_invoke = []
        self.t_turn = None
        self.deadline = None
        self.stages = [("opening", 0)]
        self.finale_log = []       # (step id, t, curses active) for the bot's report
        self.steps = {}
        for child in CHILDREN:
            clue = "ears" if child == "mindwell" else "eyes"  # placeholder shape: the handoff does not specify spoke puzzles
            for i in range(C.SPOKE_STEP_COUNT):
                s = Step("%s_%d" % (child, i + 1), child, {FACULTY[child]}, clue, C.SPOKE_SECONDS_BY_CHILD.get(child, C.SPOKE_STEP_SECONDS))
                s.remaining = s.base * self.rng.uniform(*C.STEP_TIME_JITTER)
                self.steps[s.id] = s
        for row in FINALE_PRESETS[finale]:
            sid, needs, clue, holder, by, secs, src = row[:7]
            self.steps[sid] = Step(sid, HUB, {needs}, clue, secs, holder, by, src, row[7] if len(row) > 7 else ())
            self.steps[sid].remaining = secs * self.rng.uniform(*C.STEP_TIME_JITTER)
        self.stages_fired = set()
        self.lines = []  # finale pieces done, in order (the lines on the slate)
        self.finale_steps = [r[0] for r in FINALE_PRESETS[finale]]
        for p in self.players.values():
            p.t = C.SEANCE_OPENING_SECONDS
        self.say("medium", HUB, "The circle opens. When she calls your child's name, do the one thing your object is for, and keep helping with what you have left. Deliverance first: the kitchen. Stay together.")
        self.note("The mother asks: find what became of my children; bring back what each one left.")
        self.stages.append(("investigation", C.SEANCE_OPENING_SECONDS))

    # ---- events and observation -----------------------------------------------------------
    def emit(self, kind, room, text, who=None, modality="any", t=None):
        self.events.append(dict(t=t if t is not None else self.now(), kind=kind, room=room, text=text, who=who, modality=modality))

    def say(self, who, room, text):
        self.emit("spoken", room, text, who, "ears")

    def note(self, text, who=None):
        self.emit("note", None, text, who, "any")

    def now(self):
        return max(p.t for p in self.players.values())

    def next_player(self):
        if self.invoked:
            return self.players[self.invoked]
        return min(self.players.values(), key=lambda p: (p.t, p.passed_at == p.t, CHILDREN.index(p.id)))

    def present(self, room):
        return [p for p in self.players.values() if p.room == room]

    def active_steps(self, room):
        ids = self.finale_steps if room == HUB else ["%s_%d" % (room, i + 1) for i in range(C.SPOKE_STEP_COUNT)]
        if room == HUB and self.phase != "finale":
            ids = []
        return [self.steps[i] for i in ids if not self.steps[i].done]

    def current_step(self, room):
        steps = self.active_steps(room)
        return steps[0] if steps else None  # steps within a room are sequential

    def perceives(self, p, ev):
        if ev["who"] == p.id and ev["kind"] != "spoken":
            return True
        if ev["modality"] == "any" and ev["who"] in (None, p.id):
            return True
        if ev["room"] not in (None, p.room):
            return False
        return ev["modality"] in p.faculties

    def observe(self, p):
        new = [e for e in self.events[p.seen:] if self.perceives(p, e)]
        p.seen = len(self.events)
        obs = dict(player=p.id, child=p.id, bound=p.bound, t=p.t, clock=fmt(p.t), room=p.room,
                   faculties=sorted(p.faculties), curse=p.curse, holding=p.relic,
                   knows=sorted(p.knows), phase=self.phase, your_turn=(self.next_player() is p),
                   sees=self.sight(p) if "eyes" in p.faculties else [],
                   hears=[e["text"] for e in new if e["modality"] == "ears"],
                   notices=[e["text"] for e in new if e["modality"] != "ears"],
                   can=self.legal(p))
        if self.deadline is not None:
            obs["fire_remaining"] = max(0, self.deadline - p.t)
        if self.over:
            obs["over"] = self.over
        return obs

    def sight(self, p):
        here = [q.id + (" (%s)" % q.curse if q.curse else "") for q in self.present(p.room) if q is not p]
        out = ["room: %s" % p.room, "others here: %s" % (", ".join(here) or "nobody")]
        if p.room == HUB:
            out.append("relics on the table: %s" % (", ".join(self.relics) or "none"))
        steps = self.active_steps(p.room) if (p.room == HUB and self.phase == "finale") else [self.current_step(p.room)]
        for s in steps:
            if s:
                out.append("%s: %s (needs %s; clue is %s%s%s)" % ("open" if p.room == HUB else "current step", s.id, "+".join(sorted(s.needs)), s.clue,
                           "; %s must work it" % s.by if s.by else "", "; after %s" % "+".join(sorted(s.requires)) if s.requires else ""))
            elif p.room != HUB:
                out.append("this room is finished")
        return out

    def pick_step(self, p, to):
        if to and p.room == HUB and self.phase == "finale":
            s = self.steps.get(to)
            if not s or s.room != HUB or s.done:
                raise Illegal("no open finale piece named %r; open: %s" % (to, ", ".join(x.id for x in self.active_steps(HUB))))
            return s
        return self.current_step(p.room)

    def legal(self, p):
        if self.over or self.next_player() is not p:
            return []
        if self.invoked == p.id:
            return ["curse"]
        can = ["wait"]
        if "eyes" in p.faculties:
            can += ["go %s" % r for r in ROOMS if r != p.room]
        finale_table = p.room == HUB and self.phase == "finale"
        for s in (self.active_steps(HUB) if finale_table else [self.current_step(p.room)]):
            if s and not (s.requires - {x for x in self.steps if self.steps[x].done}):
                sfx = " " + s.id if finale_table else ""
                can += ["examine" + sfx, "work" + sfx]
                if s.worked - s.hinted_at >= self.hint_after():
                    can.append("hint" + sfx)
        others = [q for q in self.present(p.room) if q is not p]
        if others and "voice" in p.faculties:
            can += ["relay %s" % q.id for q in others] + ["confer"]
        if others and "hands" in p.faculties:
            can += ["show %s" % q.id for q in others if "eyes" in q.faculties]
        if p.relic and p.room == HUB:
            can.append("place")
        return can

    # ---- time -------------------------------------------------------------------------------------
    def advance(self, players, seconds):
        """All listed players spend `seconds` together, starting when the last of them is free.
        Returns False (and ends the game) if the fire timer runs out first."""
        start = max(p.t for p in players)
        end = start + seconds
        if self.deadline is not None and end > self.deadline:
            for p in players:
                p.t = self.deadline
            self.lose("the fire clock ran out at %s, %s after it started, and %s" % (fmt(self.deadline), fmt(C.FIRE_TIMER_SECONDS), self.variant["loss"]))
            return False
        for p in players:
            p.t = end
        if self.deadline is not None and self.phase == "finale":
            for left, text in C.RAGE_STAGES:
                at = self.deadline - left
                if start < at <= end and left not in self.stages_fired:
                    self.stages_fired.add(left)
                    self.say("mother", HUB, "%s (%s of fire left)" % (text, fmt(left)))
                    self.emit("sight", HUB, "The light steps redder: the fire has moved toward him. (%s of fire left)" % fmt(left), None, "eyes", t=at)
        return True

    def hint_after(self):
        return C.HINT_AFTER_SECONDS // 2 if self.phase == "finale" else C.HINT_AFTER_SECONDS

    def bypass_after(self):
        return C.BYPASS_AFTER_SECONDS // 2 if self.phase == "finale" else C.BYPASS_AFTER_SECONDS

    def tier(self):
        """hw-design-rage 7.7: the medium names who is at rest. The sim counts lines on the slate as the proxy for lines spoken."""
        if "slate" in self.steps and self.steps["slate"].done:
            return "she had it in her hands and no one finished it: four at rest, she and he are not"
        n = len([x for x in ("carried", "seen", "heard", "said") if self.steps[x].done])
        names = {"carried": "Deliverance", "seen": "Waitstill", "heard": "Mindwell", "said": "Remember"}
        heard = [names[x] for x in ("carried", "seen", "heard", "said") if self.steps[x].done]
        return "%d of her children were heard (%s): %d at rest, %d not" % (n, ", ".join(heard) or "none", n, 6 - n)

    def lose(self, why):
        if self.phase == "finale" and "slate" in self.steps:
            why += "; " + self.tier()
        self.over = dict(result="lost", t=self.now(), why="You lost because " + why + ".")
        self.stages.append(("end", self.now()))

    def win(self, why):
        self.over = dict(result="won", t=self.now(), why="You won because " + why + ". The last child falls quiet; his voice stops; the light warms; she says his name and he answers.")
        self.stages.append(("end", self.now()))

    # ---- actions ------------------------------------------------------------------------------------
    def act(self, pid, action):
        """action: dict with 'action' and optional 'to'. Returns a result dict; never raises."""
        if self.over:
            return dict(ok=False, error="game over: " + self.over["why"])
        if pid not in self.players:
            return dict(ok=False, error="unknown player %r" % pid)
        p = self.players[pid]
        nxt = self.next_player()
        if p is not nxt:
            return dict(ok=False, error="not %s's turn; %s acts next (clock %s)" % (pid, nxt.id, fmt(nxt.t)))
        name = action.get("action")
        handler = getattr(self, "do_" + str(name), None)
        if handler is None:
            return dict(ok=False, error="unknown action %r" % name)
        try:
            if self.invoked == pid and name != "curse":
                raise Illegal("the spirit has called you: apply your object, or take the medium's alternative (which the sim counts as the same); no penalty")
            handler(p, action.get("to"))
        except Illegal as e:
            return dict(ok=False, error=str(e))
        except Undefined as u:
            self.undefined.append((p.t, str(u)))
            self.over = dict(result="undefined", t=p.t, why="Run ended at %s: the rules do not say: %s" % (fmt(p.t), u))
            self.stages.append(("end", p.t))
        return dict(ok=True)

    def do_wait(self, p, _):
        """Idle until someone else is free to act. With nobody ahead, pass the turn at no cost;
        once everyone at this clock has passed, time has to move: WAIT_SECONDS."""
        ahead = sorted(q.t for q in self.players.values() if q.t > p.t)
        if ahead:
            self.advance([p], ahead[0] - p.t)
        elif all(q.passed_at == q.t for q in self.players.values() if q is not p):
            self.advance([p], C.WAIT_SECONDS)
        else:
            p.passed_at = p.t

    def do_go(self, p, to):
        if to not in ROOMS:
            raise Illegal("no such room %r; rooms are %s" % (to, ", ".join(ROOMS)))
        if to == p.room:
            raise Illegal("already in %s" % to)
        movers = self.present(p.room) if C.GROUP_MOVES_TOGETHER else [p]
        blind = [q.id for q in movers if "eyes" not in q.faculties]
        if blind:
            raise Illegal("%s may not move through the house while blindfolded (handoff 8 safety note)%s" % (
                ", ".join(blind), "; the group cannot leave together" if len(movers) > 1 else ""))
        if to != HUB and C.SPOKE_ORDER_FIXED:
            k = CHILDREN.index(to)
            if any(self.players_relic_outstanding(c) for c in CHILDREN[:k]):
                raise Illegal("rooms must be taken in order; %s is not yet finished" % CHILDREN[k - 1])
        cost = C.TRAVEL_SECONDS if (HUB in (to, p.room) or C.SPOKE_TO_SPOKE_DIRECT) else 2 * C.TRAVEL_SECONDS
        self.stages.append((to, max(q.t for q in movers)))
        if not self.advance(movers, cost):
            return
        for q in movers:
            q.room = to
        self.emit("sight", to, "%s arrive%s in %s." % (", ".join(q.id for q in movers), "" if len(movers) > 1 else "s", to), None, "eyes")

    def players_relic_outstanding(self, child):
        return not self.steps["%s_%d" % (child, C.SPOKE_STEP_COUNT)].done

    def do_examine(self, p, to):
        s = self.pick_step(p, to)
        if not s:
            raise Illegal("nothing to examine here")
        if s.holder:
            raise Illegal("there is nothing to read; this step's information is in %s's head" % s.holder)
        if s.clue not in p.faculties:
            if not self.advance([p], C.STEP_EXAMINE_SECONDS):
                return
            self.note("You cannot take in %s's clue: it needs %s and you are %s." % (s.id, s.clue, p.curse), p.id)
            return
        if not self.advance([p], C.STEP_EXAMINE_SECONDS):
            return
        p.knows.add(s.id)
        self.note("You take in the clue for %s." % s.id, p.id)

    def do_work(self, p, to):
        s = self.pick_step(p, to)
        if not s:
            raise Illegal("nothing to work on here")
        missing = [x for x in s.requires if not self.steps[x].done]
        if missing:
            raise Illegal("%s cannot start until %s is done (%s)" % (s.id, "+".join(missing), s.src))
        if s.by and p.id != s.by:
            raise Illegal("%s must be worked by %s (%s)" % (s.id, s.by, s.src))
        knowers = [q for q in self.present(p.room) if s.id in q.knows]
        if not knowers:
            raise Illegal("nobody here knows what %s asks for; examine it or get it relayed" % s.id)
        if s.by and p not in knowers:
            raise Illegal("%s must know what %s asks for before working it; have it shown or told to you" % (p.id, s.id))
        crew, have = [], set()
        for q in sorted(knowers, key=lambda q: (q is not p, q.t)):
            if s.needs - have:
                crew.append(q)
                have |= q.faculties
        if s.needs - have:
            raise Illegal("nobody here who knows %s can supply %s" % (s.id, "+".join(sorted(s.needs - have))))
        spent = min(C.STEP_WORK_CHUNK_SECONDS, s.remaining)
        start = max(q.t for q in crew)
        if not self.advance(crew, spent):
            return
        # Effort is wall time with someone capable on the step: two players on it at once do not double it.
        credit = max(0, start + spent - max(start, s.until))
        s.until = max(s.until, start + spent)
        s.worked += credit
        s.remaining -= credit
        if s.remaining > 1e-9 and s.worked >= self.bypass_after():
            # hw-design-rage section 4: the bypass tier. "She calls <child>: do <the step>." No penalty; the evidence goes home.
            s.remaining = 0
            self.hints += 1
            self.say("medium", p.room, "She calls %s: %s. (bypass at %s of effort)" % (p.id, s.id, fmt(s.worked)))
            self.emit("sight", p.room, "The medium points %s to %s." % (p.id, s.id), None, "eyes")
        if s.remaining > 1e-9:
            self.note("%s: no result yet (%s of effort so far)." % (s.id, fmt(s.worked)), p.id)
            return
        s.done = True
        self.emit("sight", p.room, "%s is solved." % s.id, None, "eyes")
        if s.id in self.finale_steps:
            self.finale_log.append((s.id, p.t, {q.id: q.curse for q in self.players.values()}))
            if s.id == self.variant.get("win_step"):
                self.win("%s spoke the report whole to her at %s, with %s of the fire left" % (p.id, fmt(p.t), fmt(self.deadline - p.t)))
                return
            if s.id == "slate":
                self.say("medium", HUB, "It is whole. Say it.")
                self.emit("sight", HUB, "Remember raises the board; the medium nods.", None, "eyes")
            else:
                self.lines.append(s.id)
                self.emit("sight", HUB, "A line goes onto the slate: %s." % s.id, None, "eyes")
                self.say("medium", HUB, "%s: on the slate." % s.id)  # spoken too, so the blind player gets it
            return
        if s.room in CHILDREN and not self.active_steps(s.room):
            self.finish_spoke(p, s.room)

    def finish_spoke(self, p, child):
        here = self.present(child) or [p]
        if not self.advance(here, C.REVEAL_SECONDS):
            return
        bearer = self.players[child]
        bearer.relic = child + "_relic"
        self.emit("reveal", child, "Role revealed: %s was the %s of the network." % (child, FACULTY[child]), None, "eyes")
        self.emit("reveal", child, "Fate, partial: %s was inside the house when the fire came." % child, None, "eyes")
        for piece in C.PLANTED.get(child, ()):   # hw-design-rage: what the spoke plants in its bearer for the finale
            bearer.knows.add(piece)
        self.note("%s takes %s (and now knows: %s)." % (bearer.id, bearer.relic, ", ".join(C.PLANTED.get(child, ())) or "-"), bearer.id)

    def do_hint(self, p, to):
        s = self.pick_step(p, to)
        if not s:
            raise Illegal("nothing is stalled here")
        if s.worked - s.hinted_at < self.hint_after():
            raise Illegal("the medium does not offer a hint yet (%s of effort on %s since the last hint; she waits for %s)" % (fmt(s.worked - s.hinted_at), s.id, fmt(self.hint_after())))
        if C.HINT_MAX is not None and self.hints >= C.HINT_MAX:
            raise Illegal("no hints left (cap %d)" % C.HINT_MAX)
        rooms = {q.room for q in self.players.values()}
        if p.room != HUB:
            if not C.MEDIUM_WITH_GROUP:
                raise Illegal("the medium stays at the seance table; go back to ask her")
            if len(rooms) > 1:
                raise Undefined("Where is the medium when the players are in different rooms? (one live medium; hub-and-spoke)")
        here = self.present(p.room)
        if not self.advance(here, C.HINT_SECONDS):
            return
        self.hints += 1
        s.hinted_at = s.worked
        self.say("medium", p.room, "Hint for %s." % s.id)
        if any("ears" in q.faculties for q in here):
            s.remaining *= 1 - C.HINT_FRACTION
        else:
            self.note("The medium speaks, but nobody in the room can hear her.")

    def do_relay(self, p, to):
        q = self.players.get(to)
        if not q or q.room != p.room or q is p:
            raise Illegal("%r is not another player in this room" % to)
        if "voice" not in p.faculties:
            raise Illegal("you are silenced; show them instead (write on the slate or point)")
        if "ears" not in q.faculties:
            raise Illegal("%s cannot hear you; show them instead (write on the slate or point)" % q.id)
        if not self.advance([p, q], C.RELAY_SECONDS):
            return
        self.say(p.id, p.room, "%s tells %s what they know." % (p.id, q.id))
        for r in self.present(p.room):
            if "ears" in r.faculties:
                r.knows |= p.knows

    def do_show(self, p, to):
        """hw-design-rage section 3.3: the slate and pointing. The shower needs hands; the one shown needs eyes."""
        q = self.players.get(to)
        if not q or q.room != p.room or q is p:
            raise Illegal("%r is not another player in this room" % to)
        if "hands" not in p.faculties:
            raise Illegal("you cannot write or point with gloved hands; say it instead")
        if "eyes" not in q.faculties:
            raise Illegal("%s cannot see what you show; tell them instead" % q.id)
        if not self.advance([p, q], C.SHOW_SECONDS):
            return
        self.emit("sight", p.room, "%s shows %s (slate or pointing)." % (p.id, q.id), None, "eyes")
        q.knows |= p.knows

    def do_confer(self, p, _):
        here = self.present(p.room)
        if len(here) < 2:
            raise Illegal("nobody here to confer with")
        if "voice" not in p.faculties:
            raise Illegal("you cannot start a conference without a voice; ask someone else to")
        if not self.advance(here, C.CONFER_SECONDS):
            return
        pool = set()
        for q in here:
            if "voice" in q.faculties:
                pool |= q.knows
        self.say(p.id, p.room, "The players confer.")
        for q in here:
            if "ears" in q.faculties:
                q.knows |= pool

    def do_place(self, p, _):
        if p.room != HUB:
            raise Illegal("the table is in the seance room")
        if not p.relic:
            raise Illegal("you hold no relic")
        if not self.advance([p], C.PLACE_RELIC_SECONDS):
            return
        self.relics.append(p.relic)
        self.emit("sight", HUB, "%s places %s in its outline; that seat's candle lights." % (p.id, p.relic), None, "eyes")
        p.relic = None
        if len(self.relics) == 4:
            self.turn(p)
            return
        # hw-design-rage 5.5: the mother's line and the next door, everyone present, before anyone leaves
        here = self.present(HUB)
        if not self.advance(here, C.RETURN_BEAT_SECONDS):
            return
        nxt = [c for c in CHILDREN if self.players_relic_outstanding(c)]
        self.say("mother", HUB, "The mother answers the relic (she refuses what it means).")
        self.say("medium", HUB, "She says: %s. Go together." % (nxt[0] if nxt else "-"))

    def turn(self, p):
        away = [q.id for q in self.players.values() if q.room != HUB]
        if away:
            raise Undefined("Can the turn fire while %s is away from the seance room? They would be cursed out of the medium's sight. (handoff 9)" % ", ".join(away))
        self.phase = "turn"
        self.t_turn = p.t
        self.stages.append(("turn", p.t))
        here = list(self.players.values())
        self.emit("sight", HUB, "The fourth candle lights. The medium rings the bell: all four are seated.", None, "eyes")
        self.advance(here, C.TURN_REVEAL_SECONDS)
        self.say("mother", HUB, "The drop used. The black shown. Under the stair. Under the bed. None of them left the house. (she breaks)")
        self.emit("sight", HUB, "Light turns amber and red; shadows move on the walls.", None, "eyes")
        self.say("fire", HUB, "Crackle, then four distant voices. The fire bed begins, low.")
        self.advance(here, C.THREAT_SECONDS)
        self.say("mother", HUB, "Josiah's seal on the paper in my son's satchel. He swore. Then let him burn as they did.")
        self.emit("sight", HUB, "The centre candle flares.", None, "eyes")
        if C.FIRE_TIMER_STARTS == "turn":
            self.deadline = self.t_turn + C.FIRE_TIMER_SECONDS
        self.to_invoke = list(C.INVOCATION_ORDER)
        self.invoke_next()

    def invoke_next(self):
        if not self.to_invoke:
            self.invoked = None
            self.advance(list(self.players.values()), C.OBJECTIVE_SECONDS)
            self.phase = "finale"
            if C.FIRE_TIMER_STARTS == "after_curses":
                self.deadline = self.now() + C.FIRE_TIMER_SECONDS
            self.stages.append(("finale", self.now()))
            for s in self.finale_steps:
                if self.steps[s].holder:
                    self.players[self.steps[s].holder].knows.add(s)
            self.say("medium", HUB, self.variant["objective"])
            self.emit("sight", HUB, "The objective card lies in the centre of the table: SEEN. HEARD. CARRIED. SAID. One voice says it whole.", None, "eyes")
            self.note("Objective: " + self.variant["objective"])
            if not self.finale_steps:
                raise Undefined(self.variant["missing"])
            return
        child = self.to_invoke.pop(0)
        self.invoked = child
        if not self.advance(list(self.players.values()), C.MEDIUM_INVOCATION_SECONDS):
            return
        self.say("medium", HUB, "She calls %s: your %s." % (child.capitalize(), FACULTY[child]))
        self.emit("sight", HUB, "The medium turns to %s; the lantern flickers once." % child, None, "eyes")

    def do_curse(self, p, _):
        if self.invoked != p.id:
            raise Illegal("the spirit has not called you")
        if not self.advance(list(self.players.values()), C.CURSE_APPLY_SECONDS):
            return
        p.cursed = True
        p.faculties.discard(p.bound)
        self.emit("sight", HUB, "%s is now %s." % (p.id, p.curse), None, "eyes")
        self.note("You apply your curse: you are %s." % p.curse, p.id)
        self.finale_log.append(("curse:" + p.id, p.t, {q.id: q.curse for q in self.players.values()}))
        self.invoke_next()

    # ---- summary -------------------------------------------------------------------------------
    def summary(self):
        end = self.over["t"] if self.over else self.now()
        marks = self.stages + [("end", end)]
        per = []
        for (name, t0), (_, t1) in zip(marks, marks[1:]):
            if t1 > t0:
                per.append((name, t1 - t0))
        return dict(result=self.over["result"] if self.over else "running", why=self.over["why"] if self.over else "",
                    total=end, stages=per, hints=self.hints, undefined=[(fmt(t), q) for t, q in self.undefined],
                    finale=[(s, fmt(t), c) for s, t, c in self.finale_log])
