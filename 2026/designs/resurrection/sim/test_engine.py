"""python3 -m unittest test_engine   (run from this directory)"""
import unittest

import config as C
import engine as E
import sim


def fixed(**over):
    """Deterministic config for a test; restored afterwards by the test's tearDown."""
    saved = {k: getattr(C, k) for k in over}
    for k, v in over.items():
        setattr(C, k, v)
    return saved


def act(g, pid, **a):
    """Act as pid regardless of turn order: sync every clock to the latest, others pass."""
    for q in g.players.values():
        q.t = g.now()
        q.passed_at = q.t if q.id != pid else -1
    return g.act(pid, a)


class Base(unittest.TestCase):
    def setUp(self):
        self.saved = fixed(STEP_TIME_JITTER=(1.0, 1.0))

    def tearDown(self):
        for k, v in self.saved.items():
            setattr(C, k, v)

    def run_bot(self, game):
        while not game.over:
            p = game.next_player()
            r = game.act(p.id, sim.bot_plan(game, p))
            self.assertTrue(r["ok"], r)
        return game


class Clock(Base):
    def test_opening_costs_time_and_group_walks_together(self):
        g = E.Game()
        self.assertEqual(g.now(), C.SEANCE_OPENING_SECONDS)
        self.assertIn("in order", g.act("deliverance", dict(action="go", to="waitstill"))["error"])  # design 5: the light sends them in order
        self.assertTrue(g.act("deliverance", dict(action="go", to="deliverance"))["ok"])
        self.assertEqual({p.room for p in g.players.values()}, {"deliverance"})
        self.assertEqual({p.t for p in g.players.values()}, {C.SEANCE_OPENING_SECONDS + C.TRAVEL_SECONDS})

    def test_only_lowest_clock_acts(self):
        g = E.Game()
        g.players["deliverance"].t += 5
        r = g.act("deliverance", dict(action="wait"))
        self.assertFalse(r["ok"])
        self.assertIn("waitstill acts next", r["error"])

    def test_two_players_on_one_step_do_not_double_progress(self):
        g = E.Game()
        g.act("deliverance", dict(action="go", to="deliverance"))
        for pid in ("deliverance", "waitstill"):
            self.assertTrue(act(g, pid, action="examine")["ok"])
        for q in g.players.values():
            q.t = g.now()  # everyone free at the same moment
        self.assertTrue(g.act("deliverance", dict(action="work"))["ok"])
        self.assertTrue(g.act("waitstill", dict(action="work"))["ok"])  # overlaps deliverance's effort
        self.assertEqual(g.steps["deliverance_1"].worked, C.STEP_WORK_CHUNK_SECONDS)

    def test_hint_only_after_stall_and_halves_remaining(self):
        g = E.Game()
        g.act("deliverance", dict(action="go", to="deliverance"))
        act(g, "deliverance", action="examine")
        self.assertIn("does not offer the next tier yet", act(g, "deliverance", action="hint")["error"])
        s = g.steps["deliverance_1"]
        s.worked, s.remaining = C.HINT_TIERS[0][0], 100
        self.assertTrue(act(g, "deliverance", action="hint")["ok"])
        self.assertEqual(s.remaining, 100 * (1 - C.HINT_TIERS[0][1]))
        self.assertEqual(g.hints, 1)
        s.worked = C.BYPASS_SECONDS["deliverance"]
        self.assertTrue(act(g, "deliverance", action="hint")["ok"])  # push
        self.assertTrue(act(g, "deliverance", action="hint")["ok"])  # bypass: the mother's voice names the act
        self.assertTrue(s.done)


class Turn(Base):
    def test_bot_reaches_turn_then_variant_question(self):
        for v in E.VARIANTS:
            g = self.run_bot(E.Game(v))
            self.assertEqual(g.over["result"], "undefined")
            self.assertEqual(g.undefined[-1][1], E.VARIANTS[v]["missing"])
            self.assertTrue(all(p.cursed for p in g.players.values()))
            self.assertEqual(g.deadline, g.t_zero + C.FIRE_TIMER_SECONDS)  # design 6: the clock starts after the fourth curse and the objective
            self.assertGreater(g.t_zero, g.t_turn)

    def test_turn_with_player_away_is_undefined(self):
        g = E.Game()
        for c in E.CHILDREN:
            g.relics.append(c + "_relic")
        g.players["remember"].room = "remember"
        g.relics.pop()
        g.players["deliverance"].relic = "remember_relic"
        self.assertTrue(act(g, "deliverance", action="place")["ok"])
        self.assertEqual(g.over["result"], "undefined")
        self.assertIn("away from the seance room", g.over["why"])

    def test_invoked_player_must_curse(self):
        g = self.turned()
        self.assertEqual(g.invoked, "deliverance")
        g.act("deliverance", dict(action="wait"))
        self.assertIn("obey it", g.over["why"])

    def turned(self):
        g = E.Game(finale="floated")
        for c in E.CHILDREN[:3]:
            g.relics.append(c + "_relic")
        g.players["deliverance"].relic = "remember_relic"
        act(g, "deliverance", action="place")
        return g

    def cursed(self):
        g = self.turned()
        while g.invoked:
            g.act(g.invoked, dict(action="curse"))
        return g


class Curses(Turn):
    def test_blind_player_cannot_move_and_pins_the_group(self):
        g = self.cursed()
        r = g.act(g.next_player().id, dict(action="go", to="deliverance"))
        self.assertIn("blindfolded", r["error"])
        self.assertIn("cannot leave together", r["error"])

    def test_deaf_player_misses_spoken_lines_and_blind_sees_nothing(self):
        g = self.cursed()
        g.say("medium", E.HUB, "a spoken line")
        self.assertNotIn("a spoken line", g.observe(g.players["mindwell"])["hears"])
        self.assertIn("a spoken line", g.observe(g.players["deliverance"])["hears"])
        self.assertEqual(g.observe(g.players["waitstill"])["sees"], [])

    def test_slate_carries_silenced_and_deaf_relays(self):
        # design section 4: the spirit slate. hands-to-eyes replaces voice-to-ear; blind cannot read, gloved cannot write.
        g = self.cursed()
        g.players["remember"].knows.add("x")
        self.assertTrue(act(g, "remember", action="relay", to="deliverance")["ok"])
        self.assertIn("x", g.players["deliverance"].knows)
        g = self.cursed()
        g.players["deliverance"].knows.add("x")
        self.assertTrue(act(g, "deliverance", action="relay", to="mindwell")["ok"])
        self.assertIn("x", g.players["mindwell"].knows)
        g = self.cursed()
        self.assertIn("no slate path", act(g, "remember", action="relay", to="waitstill")["error"])

    def test_gloved_holder_relays_then_other_works_satchel(self):
        g = self.cursed()
        self.assertIn("satchel", g.players["deliverance"].knows)
        self.assertIn("can supply hands", act(g, "deliverance", action="work")["error"])
        self.assertTrue(act(g, "deliverance", action="relay", to="remember")["ok"])
        self.assertTrue(act(g, "remember", action="work")["ok"])
        self.assertEqual(g.steps["satchel"].worked, C.STEP_WORK_CHUNK_SECONDS)

    def test_fire_timer_expiry_is_a_legible_loss(self):
        g = self.cursed()
        for q in g.players.values():
            q.t = g.deadline - 1
        act(g, "deliverance", action="relay", to="remember")
        self.assertEqual(g.over["result"], "lost")
        self.assertIn("You lost because the fire soundtrack ran out", g.over["why"])
        self.assertIn(E.VARIANTS["resurrection"]["loss"], g.over["why"])


class Cli(Base):
    def test_config_and_questions_list_everything(self):
        names = [n for n, _, _ in sim.config_lines()]
        self.assertIn("FIRE_TIMER_SECONDS", names)
        self.assertEqual(len(names), len([k for k in vars(C) if k.isupper()]))
        self.assertGreaterEqual(len(sim.questions()), 8)  # the design answered the two relay questions with the slate

    def test_split_strategy_hits_medium_location_question(self):
        self.saved.update(fixed(GROUP_MOVES_TOGETHER=False, SPOKE_ORDER_FIXED=False, HINT_TIERS=((0, 0.5), (0, 0.5), (0, 1.0)), BYPASS_SECONDS={}))
        g = self.run_bot(E.Game())
        self.assertIn("Where is the medium", g.over["why"])


if __name__ == "__main__":
    unittest.main()
