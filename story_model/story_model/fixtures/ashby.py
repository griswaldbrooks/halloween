"""The Ashby escape room, as the design record of 2026-10-17 left it.

Source: ``2026/ashby/design-record/design-record.md`` (scenes 1-9, sections 2.2-2.3)
and ``decisions.md`` (the captain's rulings). Where the record marks something Open,
so does this file; where the record lists a gap "not to be filled by assumption",
the corresponding field is left empty so the checker reports it rather than this
file guessing. Event times are a story clock, not hours.
"""

from __future__ import annotations

from ..model import (
    Action,
    AntagonistAct,
    Artifact,
    Character,
    Ending,
    Event,
    Fact,
    Modality,
    Scene,
    Status,
    Story,
    Twist,
    Want,
    WantKind,
)

fs = frozenset

CHARACTERS = [
    Character("josiah", "Josiah Ashby"),  # fate unstated in every source
    Character("constance", "Constance Ashby", died_at="constance_dies"),
    Character("deliverance", "Deliverance", died_at="deliverance_killed"),
    Character("waitstill", "Waitstill", died_at="waitstill_killed"),
    Character("mindwell", "Mindwell", died_at="mindwell_dies"),
    Character("remember", "Remember", died_at="remember_dies"),
]

FACTS = [
    Fact(
        "family_network",
        "The family ran a secret message network: Deliverance carried, Waitstill watched and collected, "
        "Remember kept the ciphers.",
    ),
    Fact("drop_location", "The dead drop is a hiding place in the stone wall by the great tree and the boulder."),
    Fact("signal_protocol", "Challenge and countersign by lantern; the all-clear is 'the coast is clear'."),
    Fact(
        "cipher_method",
        "The family cipher is word substitution: swap the right words and a new sentence appears.",
        status=Status.WORKING,
    ),
    Fact("josiah_message_expected", "A message from Josiah is expected tonight, carried by Deliverance."),
    Fact("children_missing", "The four children are missing, not dead.", true=False),  # Constance's belief
    Fact("chest_code", "Deliverance's reply pattern is the combination of the chest."),
    Fact("property_map", "The map shows the old property: a great tree, a boulder, a wall."),
    Fact(
        "waitstill_killed_collecting",
        "Waitstill went out to collect the message from the drop and was caught and killed.",
    ),
    Fact("waitstill_dead", "Waitstill is dead."),
    Fact("constance_spy", "Constance took an active part in the network.", status=Status.WORKING),
    Fact(
        "letter_domestic",
        "Josiah's letter is a dull domestic note: late at business, household instructions, "
        "an odd request about supper.",
    ),
    Fact("josiah_indifferent", "Josiah was late, indifferent, and abandoned them.", true=False),
    Fact("letter_means_more", "The letter means more than it says."),
    Fact("deliverance_left_letter", "Deliverance, followed, left the letter at the drop and led the soldiers away."),
    Fact("deliverance_dead", "Deliverance is dead."),
    Fact("soldiers_coming", "Soldiers were already on their way to the house."),
    Fact("mindwell_habit", "Mindwell listened at doors, always with her grandmother's cup."),
    Fact("grandmother_cup", "Which of the five cups was the grandmother's."),
    Fact("soldiers_in_house", "Soldiers searched the house for the hidden children."),
    Fact("fire_ordered", "An officer ordered a fire set to drive the children out."),
    Fact("remember_dead", "Remember tried to escape and died inside the house."),
    Fact("mindwell_dead", "Mindwell stayed hidden under the stairs and died there."),
    Fact("letter_hint", "Something Mindwell knows moves the letter forward one step.", status=Status.OPEN),
    Fact(
        "josiah_warning",
        "Hidden in the supper note is Josiah's warning to get the family to safety.",
        requires=fs({"cipher_method", "letter_means_more"}),
    ),
    Fact("josiah_patriot", "The Wilkes cup was Josiah's: a sign of where his sympathies lay.", status=Status.OPEN),
]

EVENTS = [
    Event("locket_given", 0, "Josiah gives Constance a locket.", fs({"josiah", "constance"}), status=Status.OPEN),
    Event(
        "cup_inherited",
        0,
        "Mindwell inherits her grandmother's cup; the household knows it as hers.",
        fs({"mindwell", "constance"}),
        learns={"constance": fs({"grandmother_cup", "mindwell_habit"}), "mindwell": fs({"grandmother_cup"})},
    ),
    Event(
        "network",
        1,
        "The family runs its message network.",
        fs({"josiah", "constance", "deliverance", "waitstill", "mindwell", "remember"}),
        learns={
            "constance": fs({"family_network", "drop_location", "constance_spy"}),
            "josiah": fs({"family_network", "drop_location"}),
            "deliverance": fs({"family_network", "drop_location", "signal_protocol"}),
            "waitstill": fs({"family_network", "drop_location", "signal_protocol"}),
            "remember": fs({"family_network", "cipher_method"}),
            "mindwell": fs({"family_network", "mindwell_habit"}),
        },
    ),
    Event(
        "josiah_sends",
        2,
        "Josiah, away, sends Deliverance with the concealed warning.",
        fs({"josiah", "deliverance"}),
        causes=fs({"network"}),
        learns={
            "josiah": fs({"josiah_warning", "soldiers_coming", "letter_domestic", "letter_means_more"}),
            "deliverance": fs({"letter_domestic"}),
        },
    ),
    Event(
        "household_waits",
        2,
        "At home, Constance and Waitstill expect the message.",
        fs({"constance", "waitstill", "mindwell", "remember"}),
        learns={"constance": fs({"josiah_message_expected"}), "waitstill": fs({"josiah_message_expected"})},
    ),
    Event(
        "signal",
        3,
        "Waitstill signals the coast is clear; Deliverance replies.",
        fs({"waitstill", "deliverance"}),
        causes=fs({"josiah_sends"}),
        learns={"waitstill": fs({"chest_code"}), "deliverance": fs({"chest_code"})},
    ),
    Event(
        "followed",
        4,
        "Deliverance realizes he is followed, leaves the letter at the drop and keeps moving.",
        fs({"deliverance"}),
        causes=fs({"signal"}),
        learns={"deliverance": fs({"deliverance_left_letter", "soldiers_coming"})},
    ),
    Event(
        "deliverance_killed",
        5,
        "The British catch and kill Deliverance away from the drop.",
        fs({"deliverance"}),
        causes=fs({"followed"}),
        learns={"deliverance": fs({"deliverance_dead"})},
    ),
    Event(
        "waitstill_killed",
        6,
        "Waitstill goes out to the drop he knows, is caught and killed, never returns.",
        fs({"waitstill"}),
        causes=fs({"signal"}),
        learns={"waitstill": fs({"waitstill_killed_collecting", "waitstill_dead"})},
    ),
    Event(
        "mindwell_listens",
        7,
        "Waitstill is overdue. Mindwell, frightened, takes her cup to a door.",
        fs({"mindwell"}),
        causes=fs({"waitstill_killed"}),
    ),
    Event(
        "search",
        8,
        "Soldiers search the house for the hidden children.",
        fs({"mindwell", "remember"}),
        causes=fs({"network"}),
        learns={"mindwell": fs({"soldiers_in_house"})},
    ),
    Event(
        "fire_ordered",
        9,
        "An officer orders a fire to flush the children out. It spreads.",
        fs({"mindwell", "remember"}),
        causes=fs({"search"}),
        learns={"mindwell": fs({"fire_ordered"})},
    ),
    Event(
        "remember_dies",
        10,
        "Remember tries to escape and dies inside.",
        fs({"remember", "mindwell"}),
        causes=fs({"fire_ordered"}),
        learns={"remember": fs({"remember_dead"}), "mindwell": fs({"remember_dead"})},
    ),
    Event(
        "mindwell_dies",
        11,
        "Mindwell dies concealed under the stairs.",
        fs({"mindwell"}),
        causes=fs({"fire_ordered"}),
        learns={"mindwell": fs({"mindwell_dead"})},
    ),
    # Captain, 2026-10-17: "she must die, and she must die without knowing what happened to
    # her children." Where and how: deferred. Hence no learns here.
    Event(
        "constance_dies",
        12,
        "Constance dies, not knowing what became of her children.",
        fs({"constance"}),
        status=Status.OPEN,
    ),
]

ARTIFACTS = [
    Artifact(
        "locket",
        "A locket Josiah gave Constance, possibly holding a braid of hair. Tamari's point of contact.",
        Modality.OBJECT,
        origin="locket_given",
        belongs_to="constance",
        salience="in the medium's hands",
        status=Status.OPEN,
    ),
    Artifact(
        "constance_intro",
        "Constance speaks: four missing children, Josiah away, a message expected.",
        Modality.TESTIMONY,
        testimony_of="constance",
        reveals=fs({"josiah_message_expected"}),
        surface=fs({"children_missing"}),
    ),
    Artifact(
        "spyglass", "Waitstill's spyglass.", Modality.OBJECT, origin="network", belongs_to="waitstill", salience=""
    ),  # record: "the participants find Waitstill's spyglass themselves"
    Artifact(
        "waitstill_watch",
        "Waitstill, keeping watch, supplies what they need to take his place at the window.",
        Modality.TESTIMONY,
        testimony_of="waitstill",
        reveals=fs({"signal_protocol"}),
    ),
    Artifact(
        "lantern_exchange",
        "Lights in the front yard; one is Deliverance. Pick it, answer it; his reply opens the chest.",
        Modality.ENVIRONMENT,
        origin="signal",
        reveals=fs({"chest_code"}),
    ),
    # Record 2.3: "Why the chest stores a map and why Deliverance's signal supplies its
    # combination" is a gap not to be filled by assumption. No origin, on purpose.
    Artifact(
        "chest_map",
        "A chest, opened by the lantern reply; inside, a map of the old property.",
        Modality.OBJECT,
        belongs_to="waitstill",
        reveals=fs({"property_map"}),
        status=Status.OPEN,
    ),
    Artifact(
        "waitstill_errand",
        "Through the map, Waitstill's last errand: he went out for the message and was killed.",
        Modality.TESTIMONY,
        testimony_of="waitstill",
        reveals=fs({"waitstill_killed_collecting", "waitstill_dead"}),
    ),
    Artifact(
        "constance_drop",
        "Constance recognizes the property and explains the wall and the hiding place.",
        Modality.TESTIMONY,
        testimony_of="constance",
        reveals=fs({"drop_location", "family_network", "constance_spy"}),
    ),
    Artifact(
        "wall_cache",
        "Beside the right boulder, a stump where the tree was; the cache in the wall fragment.",
        Modality.ENVIRONMENT,
        origin="followed",
        salience="the stump beside the boulder on the map",
    ),
    Artifact(
        "letter",
        "A letter on vellum: business keeps Josiah late, household instructions, a small request about supper.",
        Modality.DOCUMENT,
        origin="josiah_sends",
        belongs_to="josiah",
        reveals=fs({"letter_domestic"}),
        surface=fs({"josiah_indifferent", "letter_means_more"}),
    ),
    Artifact(
        "deliverance_account",
        "Deliverance, through the letter he hid: followed, left it at the drop, led them away, killed.",
        Modality.TESTIMONY,
        testimony_of="deliverance",
        reveals=fs({"deliverance_left_letter", "deliverance_dead", "soldiers_coming"}),
    ),
    Artifact(
        "constance_mindwell",
        "Constance describes Mindwell: shy, an eavesdropper, always with her grandmother's cup.",
        Modality.TESTIMONY,
        testimony_of="constance",
        reveals=fs({"mindwell_habit", "grandmother_cup"}),
    ),
    Artifact(
        "five_cups",
        "Five decorated cups on a shelf: a ship, a blue branch, a crest, Wilkes and Liberty No. 45, the royal GR.",
        Modality.OBJECT,
        origin="cup_inherited",
        belongs_to="mindwell",
        salience="an odd shelf in a magistrate's house",
    ),
    Artifact(
        "mindwell_listening",
        "The cup at the places Mindwell listened: soldiers, the order, the fire, Remember's end, her own.",
        Modality.TESTIMONY,
        testimony_of="mindwell",
        reveals=fs({"soldiers_in_house", "fire_ordered", "remember_dead", "mindwell_dead", "letter_hint"}),
    ),
    Artifact(
        "remember_cipher",
        "Remember, in the garage, gives the method and nothing more.",
        Modality.TESTIMONY,
        testimony_of="remember",
        reveals=fs({"cipher_method"}),
        status=Status.OPEN,
    ),
    Artifact(
        "letter_decoded",
        "The supper note with the right words swapped: Josiah's warning.",
        Modality.DOCUMENT,
        origin="josiah_sends",
        belongs_to="josiah",
        reveals=fs({"josiah_warning"}),
    ),
    Artifact(
        "wilkes_cup",
        "The Wilkes and Liberty cup, revisited: it may have been Josiah's.",
        Modality.OBJECT,
        origin="network",
        belongs_to="josiah",
        reveals=fs({"josiah_patriot"}),
        status=Status.OPEN,
    ),
]

WANTS = [
    Want("children_fate", "Find out what happened to the children.", WantKind.UNDERSTAND),
    Want("message_content", "Find out what the message said.", WantKind.UNDERSTAND),
    Want(
        "waitstill_place", "Find Waitstill's belongings or the place he kept watch.", WantKind.FIND, target="waitstill"
    ),
    Want("find_drop", "Use the map, find the hiding place, bring back the message.", WantKind.FIND),
    Want("decode_letter", "Read what the letter really says.", WantKind.UNDERSTAND),
    Want("escape_fire", "Get out of the burning room.", WantKind.ESCAPE),
    Want(
        "reconcile",
        "Let Constance know Josiah did not abandon them.",
        WantKind.RECONCILE,
        target="josiah",
        status=Status.OPEN,
    ),
]

SCENES = (
    Scene(
        "s1",
        "The séance begins",
        artifacts=("locket", "constance_intro"),
        contact=("constance",),
        mentions=("josiah", "deliverance", "waitstill", "mindwell", "remember"),
        instills=("children_fate", "message_content", "waitstill_place"),
    ),
    Scene(
        "s2",
        "Waitstill at the window",
        actions=(
            Action("find Waitstill's spyglass", serves="waitstill_place"),
            Action(
                "take his place at the window, pick Deliverance's light, answer it",
                serves="message_content",
                needs_belief=fs({"josiah_message_expected"}),
                worked=True,
            ),
            Action("open the chest with his reply", serves="message_content", worked=True),
        ),
        artifacts=("spyglass", "waitstill_watch", "lantern_exchange", "chest_map"),
        mentions=("deliverance",),
        resolves=("waitstill_place",),
    ),
    Scene(
        "s3",
        "The map, and the first death",
        actions=(Action("bring the map to the table to learn what it shows", serves="message_content"),),
        artifacts=("waitstill_errand", "constance_drop"),
        instills=("find_drop",),
    ),
    Scene(
        "s4",
        "Into the backyard",
        actions=(
            Action(
                "match the map to the yard: the boulder, the stump, the wall",
                serves="find_drop",
                needs_belief=fs({"drop_location", "property_map"}),
                worked=True,
            ),
        ),
        artifacts=("wall_cache", "letter"),
        resolves=("find_drop",),
    ),
    Scene(
        "s5",
        "The letter, and the second death",
        actions=(Action("read the letter aloud at the table", serves="message_content"),),
        artifacts=("deliverance_account",),
        mentions=("josiah",),
        resolves=("message_content",),
        instills=("decode_letter",),
    ),
    Scene(
        "s6",
        "Looking for Mindwell",
        actions=(Action("take down the grandmother's cup", serves="children_fate"),),
        artifacts=("constance_mindwell", "five_cups"),
    ),
    Scene(
        "s7",
        "Mindwell listens",
        actions=(
            Action(
                "carry the cup to the places Mindwell listened",
                serves="children_fate",
                needs_belief=fs({"mindwell_habit"}),
                worked=True,
            ),
        ),
        artifacts=("mindwell_listening",),
    ),
    Scene(
        "s8",
        "Constance's fire",
        actions=(Action("tell Constance the last of it", serves="children_fate"),),
        antagonist=AntagonistAct(
            "constance", "her grief turns to rage; the house seems to catch fire", cause="mindwell_dead"
        ),
        resolves=("children_fate",),
        instills=("escape_fire",),
    ),
    Scene(
        "s9",
        "Remember, in the garage",
        actions=(
            Action("leave through the door to the garage", serves="escape_fire"),
            Action(
                "apply Remember's method to the letter",
                serves="decode_letter",
                needs_belief=fs({"letter_means_more"}),
                worked=True,
            ),
        ),
        artifacts=("remember_cipher", "letter_decoded", "wilkes_cup"),
        twist=Twist(negates="josiah_indifferent", via="letter_decoded"),
        resolves=("escape_fire", "decode_letter"),
        instills=("reconcile",),
    ),
)

ENDING = Ending(
    "Whether the decoded warning reconciles Constance with Josiah, and releases them, is left open.",
    needs=fs({"josiah_warning", "mindwell_dead", "remember_dead", "waitstill_dead", "deliverance_dead"}),
    status=Status.OPEN,
)

STORY = Story.build(
    "Ashby escape room (design record 2026-10-17)",
    characters=CHARACTERS,
    facts=FACTS,
    events=EVENTS,
    artifacts=ARTIFACTS,
    wants=WANTS,
    scenes=SCENES,
    ending=ENDING,
)
