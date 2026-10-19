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
        objective="Send each child home by its own sign before its scream reaches you. The one who carries the mark knows the sign and cannot give it. Tell it; someone else gives it. Deliverance first: the cord.",
        loss="the ritual completed; the handoff says the players are her vessels or sacrifices but not what that looks like",
        missing="What player action prevents the resurrection ritual, and how is the ritual's progress shown to the players? (handoff 13, resurrection)",
    ),
    "rage": dict(
        objective="Uncover and prove the full truth about the husband before she completes her destructive act.",
        loss="she completed her destructive act; the handoff does not say what the act is",
        missing="Where in the house is the husband's true motive found, and what physical act proves it to her? No spoke reveal contains it: spokes reveal each child's role and fate (handoff 5). (handoff 13, rage)",
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
    "resurrection": [  # hw-design-resurrection section 7.2: send each child home by its own sign; the bearer tells, another gives it
        ("sever_deliverance", "hands", None, "deliverance", None, 30, "the cord: lift the weight, untuck the tail, pull the tail; the gloved bearer tells"),
        ("sever_waitstill", "eyes", None, "waitstill", None, 20, "the lantern: green, once, long; the blind bearer tells"),
        ("sever_mindwell", "ears", None, "mindwell", None, 40, "the hearth: hear three-and-one, answer two-and-two; the muffled bearer tells"),
        ("sever_remember", "hands+eyes+voice", None, "remember", "remember", 30, "the slate: the silenced bearer orders the six pieces and points; another voice says it"),
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
    def __init__(self, sid, room, needs, clue, seconds, holder=None, by=None, src=""):
        self.id, self.room, self.needs, self.clue = sid, room, frozenset(needs), clue
        self.base, self.holder, self.by, self.src = seconds, holder, by, src
        self.remaining = seconds
        self.worked = 0
        self.hinted_at = 0  # effort at the last hint: the medium waits HINT_AFTER_SECONDS again before the next
        self.until = 0  # wall-clock moment up to which effort has already been credited
        self.done = False
        self.hints_taken = 0  # design 4: the ladder tier this step is on
        self.taken = False    # design 7.7: the ritual took this child before its sign was given


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
            clue = getattr(C, "SPOKE_CLUE", {}).get(child, "ears" if child == "mindwell" else "eyes")
            secs = getattr(C, "SPOKE_SECONDS", {}).get(child, C.SPOKE_STEP_SECONDS)
            for i in range(C.SPOKE_STEP_COUNT):
                s = Step("%s_%d" % (child, i + 1), child, {FACULTY[child]}, clue, secs)
                s.remaining = s.base * self.rng.uniform(*C.STEP_TIME_JITTER)
                self.steps[s.id] = s
        for row in FINALE_PRESETS[finale]:
            sid, needs, clue, holder, by, secs, src = row
            self.steps[sid] = Step(sid, HUB, set(needs.split("+")), clue, secs, holder, by, src)
        self.finale_steps = [r[0] for r in FINALE_PRESETS[finale]]
        self.ritual = finale == "resurrection"
        self.taken = []
        self.warned = set()
        self.t_zero = None
        for p in self.players.values():
            p.t = C.SEANCE_OPENING_SECONDS
        self.say("medium", HUB, "The seance opens. Each of you is bound to one child and holds its object. If the spirit calls you, obey it.")
        self.note("The mother asks: find my children; discover what became of them.")
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
        if p.room == HUB and self.ritual and self.phase == "finale":
            home = [c for c in CHILDREN if self.steps["sever_" + c].done and not self.steps["sever_" + c].taken]
            nxt = [c for c in C.INVOCATION_ORDER if not self.steps["sever_" + c].done]
            out.append("board: river lights %d (%s); red %s; she is calling %s" % (len(home), ", ".join(home) or "none", ", ".join(self.taken) or "none", nxt[0] if nxt else "nobody"))
        s = self.current_step(p.room)
        if s:
            out.append("current step: %s (needs %s; clue is %s%s)" % (s.id, "+".join(sorted(s.needs)), s.clue,
                       "; only %s has it" % s.holder if s.holder else ""))
        elif p.room != HUB:
            out.append("this room is finished")
        return out

    def legal(self, p):
        if self.over or self.next_player() is not p:
            return []
        if self.invoked == p.id:
            return ["curse"]
        can = ["wait"]
        if "eyes" in p.faculties:
            can += ["go %s" % r for r in ROOMS if r != p.room]
        s = self.current_step(p.room)
        if s:
            can += ["examine", "work"]
            if self.hint_threshold(s) is not None and s.worked >= self.hint_threshold(s):
                can.append("hint")
        others = [q for q in self.present(p.room) if q is not p]
        if others and "voice" in p.faculties:
            can += ["relay %s" % q.id for q in others] + ["confer"]
        if p.relic and p.room == HUB:
            can.append("place")
        return can

    def hint_threshold(self, s):
        """Effort at which the medium offers this step's next hint (design section 4): None when the ladder is exhausted."""
        tiers = C.FINALE_HINT_TIERS if s.room == HUB else C.HINT_TIERS
        if s.hints_taken >= len(tiers):
            return None
        t = tiers[s.hints_taken][0]
        if s.hints_taken == len(tiers) - 1 and s.room != HUB:
            t = C.BYPASS_SECONDS.get(s.room, t)
        return t

    # ---- time -------------------------------------------------------------------------------------
    def advance(self, players, seconds):
        """All listed players spend `seconds` together, starting when the last of them is free.
        Returns False (and ends the game) if the fire timer runs out first."""
        start = max(p.t for p in players)
        end = start + seconds
        if self.deadline is not None and end > self.deadline:
            for p in players:
                p.t = self.deadline
            self.ritual_tick()
            if self.over:
                return False
            self.lose("the fire soundtrack ran out at %s, %s after the turn, and %s" % (fmt(self.deadline), fmt(C.FIRE_TIMER_SECONDS), self.loss_text()))
            if not self.ritual:
                self.undefined.append((self.deadline, "What physically and visibly happens to the players when the ten minutes run out? (handoff 'Best next design session', question 2)"))
            return False
        for p in players:
            p.t = end
        self.ritual_tick()
        return not self.over

    def loss_text(self):
        if not self.ritual:
            return self.variant["loss"]
        home = [c for c in CHILDREN if self.steps["sever_" + c].done and not self.steps["sever_" + c].taken]
        return "the roll is called: %d of four went home (%s); she keeps %s. Tier %d of 4" % (
            len(home), ", ".join(home) or "nobody", ", ".join(self.taken) or "nobody", len(home))

    def ritual_tick(self):
        """Her progress (design 7.1): at each RITUAL_TAKE_AT moment the eldest child not yet home is taken.
        Every beat has a heard and a seen form."""
        if not self.ritual or self.deadline is None or self.over:
            return
        now = self.now()
        for k, child in enumerate(C.INVOCATION_ORDER):
            s = self.steps["sever_" + child]
            if s.done:
                continue
            t_take = self.t_zero + C.RITUAL_TAKE_AT[k]
            if now >= t_take - C.RITUAL_WARN_SECONDS and child not in self.warned:
                self.warned.add(child)
                self.say("fire", HUB, "%s's scream comes close. Her voice: '%s. Come.'" % (child.capitalize(), child.capitalize()))
                self.emit("sight", HUB, "The %s socket pulses fast, red and white." % child, None, "eyes", t=t_take - C.RITUAL_WARN_SECONDS)
            if now >= t_take:
                s.done = s.taken = True
                self.taken.append(child)
                self.say("fire", HUB, "%s's scream stops. From the board: 'Here, Mother.'" % child.capitalize())
                self.emit("sight", HUB, "The %s socket goes steady red. %s is taken; the bearer sits still." % (child, child.capitalize()), None, "eyes", t=t_take)
                self.finale_log.append(("taken:" + child, t_take, {q.id: q.curse for q in self.players.values()}))
                if not self.active_steps(HUB):
                    for p in self.players.values():
                        p.t = max(p.t, t_take)
                    self.lose("the fire ended with children still in it: " + self.loss_text())
                    return

    def win(self, why):
        self.over = dict(result="won", t=self.now(), why="You won because " + why + ".")
        self.stages.append(("end", self.now()))

    def lose(self, why):
        self.over = dict(result="lost", t=self.now(), why="You lost because " + why + ".")
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
                raise Undefined("What happens if a player the spirit has called does something other than apply their curse? (handoff 8: 'If the spirit calls you, obey it')")
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

    def do_examine(self, p, _):
        s = self.current_step(p.room)
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

    def do_work(self, p, _):
        s = self.current_step(p.room)
        if not s:
            raise Illegal("nothing to work on here")
        if s.by and p.id != s.by:
            raise Illegal("%s must be worked by %s (%s)" % (s.id, s.by, s.src))
        if self.ritual and s.id == "sever_remember" and p.t < self.t_zero + C.PIECES_HEARD_SECONDS:
            raise Illegal("the six pieces have not all come round in the fire yet (one cycle is %s from time zero)" % fmt(C.PIECES_HEARD_SECONDS))
        knowers = [q for q in self.present(p.room) if s.id in q.knows]
        if not knowers:
            raise Illegal("nobody here knows what %s asks for; examine it or get it relayed" % s.id)
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
        if s.taken:
            self.note("Too late: %s was taken while you worked." % s.id.split("_")[1], p.id)
            return
        if s.remaining > 1e-9:
            self.note("%s: no result yet (%s of effort so far)." % (s.id, fmt(s.worked)), p.id)
            return
        self.complete(p, s)

    def complete(self, p, s):
        s.done = True
        self.emit("sight", p.room, "%s is solved." % s.id, None, "eyes")
        if s.id in self.finale_steps:
            self.finale_log.append((s.id, p.t, {q.id: q.curse for q in self.players.values()}))
            if self.ritual:
                child = s.id.split("_")[1]
                self.say("fire", HUB, "%s's scream leaves the fire. A bell." % child.capitalize())
                self.emit("sight", HUB, "The %s socket goes dark; a river light comes up. %s is home." % (child, child.capitalize()), None, "eyes")
                if not self.active_steps(HUB):
                    if self.taken:
                        self.lose("nothing was left to send home at %s: %s" % (fmt(p.t), self.loss_text()))
                    else:
                        self.win("you sent all four home by their own signs before any scream reached its bearer, at %s with %s of the soundtrack left" % (fmt(p.t), fmt(self.deadline - p.t)))
                return
            if not self.active_steps(HUB):
                raise Undefined("The four floated props are complete at %s. Does that constitute victory under the %s variant? The handoff names no winning action (handoff 'Best next design session', question 3)." % (fmt(p.t), self.variant_name))
            return
        if s.room in CHILDREN and not self.active_steps(s.room):
            self.finish_spoke(p, s.room)

    def finish_spoke(self, p, child):
        here = self.present(child)
        if not self.advance(here, C.REVEAL_SECONDS):
            return
        p.relic = child + "_relic"
        self.emit("reveal", child, "Role revealed: %s was the %s of the network." % (child, FACULTY[child]), None, "eyes")
        self.emit("reveal", child, "Fate revealed: part of what happened to %s." % child, None, "eyes")
        self.note("%s takes %s." % (p.id, p.relic), p.id)

    def do_hint(self, p, _):
        s = self.current_step(p.room)
        if not s:
            raise Illegal("nothing is stalled here")
        th = self.hint_threshold(s)
        if th is None:
            raise Illegal("the ladder is spent on %s: the bypass already fired" % s.id)
        if s.worked < th:
            raise Illegal("the medium does not offer the next tier yet (%s of effort on %s; tier %d comes at %s)" % (fmt(s.worked), s.id, s.hints_taken + 1, fmt(th)))
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
        tiers = C.FINALE_HINT_TIERS if s.room == HUB else C.HINT_TIERS
        frac = tiers[s.hints_taken][1]
        s.hints_taken += 1
        tier = ("nudge", "push", "bypass")[min(s.hints_taken - 1, 2)]
        self.say("medium", p.room, "%s for %s." % (tier.capitalize(), s.id))
        self.emit("sight", p.room, "The medium writes one word on the slate and shows it: %s." % tier, None, "eyes")  # design 4: every hint has a seen form
        s.remaining *= 1 - frac
        if s.remaining <= 1e-9:
            self.note("The mother's voice names the act; %s does it." % (s.by or s.holder or p.id), p.id)
            self.complete(p, s)

    def do_relay(self, p, to):
        q = self.players.get(to)
        if not q or q.room != p.room or q is p:
            raise Illegal("%r is not another player in this room" % to)
        if "voice" not in p.faculties or "ears" not in q.faculties:
            # design section 4: the spirit slate. The sender writes or points (hands), or says it and the medium writes it (voice);
            # the receiver reads it (eyes). The silenced cannot reach the blind directly; the design never needs that pair.
            if "eyes" not in q.faculties or not (p.faculties & {"hands", "voice"}):
                raise Illegal("%s cannot reach %s: no voice-to-ear path and no slate path (sender needs hands or voice, receiver needs eyes)" % (p.id, q.id))
            if not self.advance([p, q], C.SLATE_SECONDS):
                return
            self.emit("sight", p.room, "%s writes on the slate and shows it to %s." % (p.id, q.id), None, "eyes")
            q.knows |= p.knows
            return
        if not self.advance([p, q], C.RELAY_SECONDS):
            return
        self.say(p.id, p.room, "%s tells %s what they know." % (p.id, q.id))
        for r in self.present(p.room):
            if "ears" in r.faculties:
                r.knows |= p.knows

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
        self.emit("sight", HUB, "%s places %s on the table." % (p.id, p.relic), None, "eyes")
        child = p.relic.split("_")[0]
        p.relic = None
        if len(self.relics) == 4:
            self.turn(p)
            return
        here = self.present(HUB)
        if not self.advance(here, C.MOTHER_LINE_SECONDS):
            return
        nxt = [c for c in CHILDREN if self.players_relic_outstanding(c)][0]
        self.emit("sight", HUB, "The %s socket goes white; the %s socket comes up amber." % (child, nxt), None, "eyes")
        self.say("mother", HUB, "She narrows what she believes and names %s. The medium sends you to %s's room." % (nxt, nxt))

    def turn(self, p):
        away = [q.id for q in self.players.values() if q.room != HUB]
        if away:
            raise Undefined("Can the turn fire while %s is away from the seance room? They would be cursed out of the medium's sight. (handoff 9)" % ", ".join(away))
        self.phase = "turn"
        self.t_turn = p.t
        self.stages.append(("turn", p.t))
        here = list(self.players.values())
        self.advance(here, C.TURN_REVEAL_SECONDS)
        self.emit("sight", HUB, "The cellar socket goes white: door, window, hearth, cellar. The river stays dark. The medium asks where they were; the group says it.", None, "eyes")
        self.say("mother", HUB, "They were all in the house when it burned. Then I will have them back, one into each of you who carries their mark, eldest first.")
        self.emit("sight", HUB, "Ember light, flicker, shadow, twenty seconds of haze; the four sockets pulse.", None, "eyes")
        self.say("fire", HUB, "A low fire bed begins.")
        if C.FIRE_TIMER_STARTS == "turn":
            self.deadline = self.t_turn + C.FIRE_TIMER_SECONDS
        self.to_invoke = list(C.INVOCATION_ORDER)
        self.invoke_next()

    def invoke_next(self):
        if not self.to_invoke:
            self.invoked = None
            self.phase = "finale"
            self.advance(list(self.players.values()), C.OBJECTIVE_SECONDS)  # design 6 beat 5: the delivery under low sound
            self.emit("sight", HUB, "The medium writes SEND THEM HOME, D W M R on the slate and points at the four pulsing sockets and the dark river.", None, "eyes")
            if C.FIRE_TIMER_STARTS == "after_curses":
                self.deadline = self.now() + C.FIRE_TIMER_SECONDS
            self.t_zero = self.deadline - C.FIRE_TIMER_SECONDS
            self.stages.append(("finale", self.now()))
            for s in self.finale_steps:
                if self.steps[s].holder:
                    self.players[self.steps[s].holder].knows.add(s)
            self.say("mother", HUB, self.variant["objective"])
            self.note("Objective: " + self.variant["objective"])
            if not self.finale_steps:
                raise Undefined(self.variant["missing"])
            return
        child = self.to_invoke.pop(0)
        self.invoked = child
        if not self.advance(list(self.players.values()), C.MEDIUM_INVOCATION_SECONDS):
            return
        self.say("medium", HUB, "%s. %s, the spirit calls you." % (child.capitalize(), child))
        self.emit("sight", HUB, "The medium turns to %s." % child, None, "eyes")

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
                    finale=[(s, fmt(t), c) for s, t, c in self.finale_log], taken=list(self.taken))
