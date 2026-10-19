# Halloween 2026: the Resurrection game, complete design

Task `hw-design-resurrection`, 2026-10-09. Paper only: nothing in the halloween repo, the storyboard, the notes or `data/hw-sim-engine/` changed. The simulation copy with this design encoded is in `sim/` beside this report (section 13).

Sources read in full once, in the brief's order: the synthesis (`hw-synthesis/report.md`, section 0 principles and sections 2 to 7), the design handoff (authoritative on story), the resurrection playtest (`hw-play-resurrection/report.md`, sections 1 to 6 and appendices A and B; the transcripts in appendix C were reproduced by running the engine rather than read), the applied-guidance sections of the two research reports, the engine README and report, and the unknowns ledger as a checklist at the end.

Settled by the captain: this ending, and a run of up to thirty minutes, aiming at about twenty-five of play. Everything else below is a proposal. Items that are taste, story darkness, cost, or a choice the handoff left to the designers are marked **CAPTAIN CALL** with a default; the design runs on the defaults and he can overrule any of them. Section 12 collects them.

---

## 1. One page

**Pitch.** Four guests sit with a medium in a house built on the cellar of the Hale house, which burned in October 1778. The folklore says Mercy Hale, hanged as a spy, hid her four children away before the soldiers came and walks the house looking for them. The medium binds each guest to one child, and the mother asks them to find her children. Four rooms, one per child, show what each child did for her network and where each was found. The fourth keepsake proves all four died in the house. She breaks, the fire comes back, and she tries to put her children into the guests who carry their marks, eldest first. The guests have one defence: she taught her children to answer the network's signs before any voice, even hers. Each guest learned their child's sign in that child's room. Now each has lost the faculty the sign needs, and must tell it to another who still has it.

**The objective sentence the medium says at the turn** (the one-breath form; the full delivery is in section 6):

> "Send each child home by its own sign before its scream reaches you. The one who carries the mark knows the sign and cannot give it. Tell it; someone else gives it."

**The three finale sentences** (refined from the playtest's PROPOSAL, same direction):

- **She now intends to** put each of her four dead children into the living guest who carries that child's mark, one at a time, eldest first, in the order she called them at the sitting.
- **If the players fail,** the fire ends with the mother calling the roll of her children and the guests she took answering from their seats: each taken guest goes still, the light at their child's place on the house-plan goes red, and that child's scream in the fire has become a voice answering her. The medium ends the sitting to release the guests and names which children she has and which went home.
- **The players win when they** send each child home by its own sign before that child's scream reaches its bearer: the bearer, who has lost the faculty the sign needs, tells the sign, and another guest who still has that faculty gives it. The fourth child sent home, before the fourth scream, ends the ritual.

**Run length.** About 25:30 for a typical group, 29:30 at the hard caps (section 9). Soundtrack after the clock starts: 6:30.

**Cast and crew on the night.**

| Who | Where | Does |
|---|---|---|
| Tamari, the medium | In the room with the group throughout | Frames, binds, sends, hints, confirms every solve, delivers the objective, runs both endings, calls the real stop |
| The captain, effects | A booth with sight of the dining room (a camera or a doorway) | Cues: the raps, the board lights, the mother's recorded voice, the fire, the stems, the sensors' fallbacks, the real stop |
| Mercy Hale, the mother | Recorded voice only | Speaks at the opening (one call), each return (one line), the turn, the finale roll, and the ending. **CAPTAIN CALL 11:** recorded voice with the captain on cues, not a second live performer |
| Four guests | Together, always | One bound to each child, in birth order Deliverance, Waitstill, Mindwell, Remember |

**Room list** (**CAPTAIN CALL 12**, the house walk decides; the fiction mapping is what matters):

| Game room | House room, proposed | Stands for |
|---|---|---|
| The sitting (hub) | Dining room, one table, five chairs | The Hale kitchen table; the board is the plan of the old house |
| Deliverance | Front hall by the door | Where the courier came home |
| Waitstill | Parlour or living room, the window bay | The lookout's window |
| Mindwell | Kitchen, the chimney wall | The listening place |
| Remember | The under-stair closet or the cellar door, worked from the top of the stair | The hiding place |
| Porch or doorstep | Outside the front door | Arrival and the out-of-character safety minute |

All four spokes open off the hub or within ten paces of it; nobody climbs stairs during play; the blind player never leaves their chair.

---

## 2. Story bible, short

Every item here is a **CAPTAIN CALL** (numbered B1 to B10 in section 12). Every code, sign and clue in sections 3 to 7 comes from this page and nowhere else (handoff section 11: no arbitrary codes).

| | Default | Why this default |
|---|---|---|
| B1. Her name | **Mercy Hale** | A Puritan virtue name the medium can say with irony at the turn ("Mercy, have mercy"). |
| B2. The family name | **Hale** | A Revolutionary spy's name and a hanging judge's name at once; the medium can note the coincidence in the folklore. Alternative: Thorne. |
| B3. The husband | **Josiah Hale**, magistrate of Wendover, Loyalist | Plain, period, signs "J. H." |
| B4. The year and dates | Fire: **the night of 14 October 1778.** Mercy hanged: **2 November 1778**, All Souls' Day. The house rebuilt on the old cellar by the Goodale family, **1791**, who found and kept the children's things. | The sitting is held near All Souls'; the Goodales explain why four keepsakes with finders' tags exist in the present house. |
| B5. The town | **Wendover, on the river road** (fictional, lower Connecticut River valley) | A ferry town explains a courier, a river to flee to, and a garrison a day's ride away (slow communication, handoff section 3). |
| B6. The betrayer | **Enoch Thatcher**, the neighbor across the road, a Loyalist, who watched Deliverance run at night and reported it to the garrison | The handoff says a neighbor; a named one lets the folklore script mention him. The Informer and healer of earlier drafts stay out (synthesis call 10). |
| B7. The children | Deliverance 14, courier; Waitstill 12, lookout; Mindwell 10, listener; Remember 8, memorizer. **Birth order is the order she calls them.** | Gives the invocation order a reason in the fiction (she calls the eldest first). |
| B8. The last message | Mercy, held at the courthouse, wrote her children one line: **"Go to the river tonight, all of you. Wait for no one."** Deliverance carried it home. By the mother's own drill, Remember learned it by heart at the kitchen table and the paper went into the fire. Waitstill, at the window, saw the soldiers at the gate before Remember had it whole. | The children died obeying her drill instead of her order. The message is the fourth sign (section 7). It contains nothing the handoff does not already imply. |
| B9. How each child died (darkness: **CAPTAIN CALL**) | All four inside the house when it was fired. Deliverance at the front door, which she had barred. Waitstill at the upper window, her post. Mindwell in the chimney cupboard where she listened. Remember in the cellar, the hiding place. Nothing graphic is shown or said; each keepsake's finder's tag gives only the place. | Four places inside the house is the conclusion the players assemble (section 5); the deaths are stated by position, never described. |
| B10. The husband's truth | Josiah's **unsent letter** to Mercy, written the night he confirmed her: *"I have said what they asked of me. They promise me the children for it. God forgive me, I believe them. Go to the river when the children are safe. J. H."* Found in the magistrate's papers, kept by the Goodales with the children's things. **Told, not played:** the medium reads it at the walk-out (section 8). | Keeps this game distinct from the sibling Rage game, where the truth gates the win. Alternative in section 12. |

**The folklore the medium knows** (what she says at the opening): Mercy Hale spied for the Continentals from a Tory judge's house. A neighbor told. Her husband sat in judgment on her. The night before the soldiers came she hid her four children away and would not say where, and she was hanged for it on All Souls'. The house burned; the children were never found. She walks the house, calling them.

**The truth the rooms prove:** the children were never hidden away. They were at their posts in the network, inside the house, doing the drill she taught them, when Thatcher's report brought the soldiers. All four died in the house. Mercy was already in custody; she never knew. Josiah confirmed her believing the garrison's promise that the children would be spared; the soldiers had already been sent.

**Why she can be resisted** (the sentence the whole finale rests on, said by the medium at the turn): *"She taught them to answer the network's signs before any voice, even hers. That is how they lived through a war. She calls them by name and they come; give each one its sign and it goes home, and she cannot hold what she taught to let go."*

**The signs**, one per child, each learned by doing in that child's room (section 5) and each needing that child's faculty:

| Child | Faculty | The sign | Where it is planted |
|---|---|---|---|
| Deliverance | Hands | The courier's hitch released: lift the load, untuck the tail, pull the tail | The satchel is tied to the hall post with it |
| Waitstill | Eyes | The lookout's relief: the lantern shown **green, once, long** | The lantern box opens only to the relief sign |
| Mindwell | Ears | The listener's answer: she knocks **three and one** ("they are here"); the house answers **two and two** ("heard; come out") | The chimney cupboard opens only to the answer |
| Remember | Voice | The last message said whole, in the walk order of the house: door, hall, hearth, stair, chamber, cellar | The memory house opens only when walked in order |

---

## 3. The opening, scripted

Time budget 3:30 (0:45 outside, 2:45 at the table). Lines in quotation marks are Tamari's and may be reworded; the beats and the rule are fixed.

### 3.1 Arrival, out of character (0:45, on the porch or in the doorway)

Tamari meets the four at the door, as herself, before anything is in character. The group sits only when this minute is done.

1. "Four of you, one evening, about half an hour. You stay together the whole time; I stay with you."
2. "Later each of you will be asked to put on one thing: thick gloves, a scarf over the eyes, ear muffs, or a kerchief over the mouth that means you don't speak. You put it on yourself, you take it off yourself, any time, for any reason, no questions. Who is happy to be the gloves? The scarf? The muffs? The kerchief?" She assigns by consent here, as herself, and remembers the four names. The scarf goes to someone who will sit at the table from the turn onward (it is a seat, not a task). **CAPTAIN CALL 14:** the medium assigns, by consent, not chance.
3. "If anyone says 'cut' or 'stop', everything stops and the lights come up. Not a game word. The way out is that door, always open."
4. "Nothing in here will touch you. Nothing is real fire. If you smell smoke, say so."

### 3.2 The sitting opens (1:00)

The dining room: one round or square table, candles (LED), the board under a black cloth tied down at four corners, a lantern (the signal lantern, section 5.2) at the medium's elbow, a framed slate (the spirit slate) propped against it with chalk, a deck of cards. Low light, no haze yet.

Tamari, in character, seats them and tells the folklore (section 2) in under a minute, ending: "The Goodales, who built this house on her cellar, kept what they found of the children. I have asked her, three nights running, where she hid them. She will not tell me. I think she does not know. Tonight she has four of you, and I think she will ask you to find them."

### 3.3 The binding (1:00)

Tamari draws four cards from the deck face up, one per child: a printed card with the child's name, age, the word for their work, and a small picture of their object (a cord, a scarf, muffs, a kerchief). "Deliverance. Fourteen. She ran the messages. Who carries her?" The guest who agreed to the gloves says yes. Tamari ties the **courier's cord** around that guest's wrist with the courier's hitch, tail tucked, and hangs the **gloves** from it by their cord. "Her hands." The guest tries the gloves on and off once, with Tamari, and leaves them hanging.

Waitstill: Tamari lays the **lookout's scarf** around the guest's neck (a wide dark scarf with an opaque panel stitched in). "Her eyes." The guest pulls it up over the eyes and down again, once.

Mindwell: Tamari hangs the **listener's muffs** (passive ear defenders on a cord) around the guest's neck. "Her ears." On and off once.

Remember: Tamari ties the **mourner's kerchief** loosely at the guest's throat (a black kerchief that will be pulled up over the mouth, loose, never tight). "Her voice." Up and down once.

Each of the four is now wearing or carrying the object that will become their curse (handoff section 8), and has practised the on-and-off, so the turn asks nothing new.

She deals four more cards face down into the lid of the deck's box, one per child, and leaves them there: the **child's cards** (the hint channel, section 4). "If you lose the way in a child's room, you may turn that child's card. Nobody minds."

Then the one rule, plainly, and the slate:

> "Tonight she may call your child by name and say what she wants of you. When she does, you do that one thing with what you were given, and nothing else, and you keep helping with everything else you have. If it hurts, or you want it off, it comes off. That is the whole rule."

> "And this is her slate. Anyone who cannot say a thing can write it or point to it here. We will all use it."

### 3.4 The tutorial gate (0:45): the sitting cloth

The board is covered by a black cloth tied down at the four corners. Each corner's cord runs through a brass ring screwed to the table edge and is finished with a knot. Three of the four knots are tied fast (an overhand on a bight, sewn); the fourth, at Deliverance's corner, is the courier's hitch with the tail tucked, and only that one releases. Each corner is embroidered with one child's object: a cord, an eye, an ear, a mouth.

Tamari: "She keeps the house covered. One of the knots is hers to open. Which?" The group looks; all four look alike. Fifteen seconds. If anyone begins pulling at random, Tamari, lightly: "Don't guess. Ask her." (If nobody does, she asks for them.)

Someone asks. The captain plays **one rap** from the table knocker. Tamari: "One. The first. Deliverance." She looks at the Deliverance guest. The mother's recorded voice, quiet, the first time the guests hear it: "**Deliverance. Your hands.**"

Tamari, if the guest hesitates: "She called your child. The thing you were given is your hands. Her corner." The guest finds the cord at the corner embroidered with a cord, pulls the tucked tail; the hitch falls open; the cloth slides off. This is the first use of the rule (she names a child, that guest acts with the faculty) and the first use of the hint channel (ask, and a word or a rap comes). If the guest cannot find the tail, Tamari points to it, no penalty (immersive principle 7, no penalty for the demonstrated alternative).

What is under the cloth: **the board**, the plan of the Hale house drawn on a 60 by 45 cm panel: the front door at the bottom, the hall, the hearth, the stair, the chamber above, the cellar below, and along the top edge the river with the ferry. Six small brass sockets at six places, each with a hidden light. Four sockets are dark; the river socket is dark. Nothing is on it.

The mother's voice: "**Find my children. I sent them to the river. Find where they went.**" The **Deliverance light** at the front door comes up, amber, alone. Tamari: "She shows us the door. Deliverance came home by it. Her things are in the hall. We go together; I come with you." (This is the sending-with-a-reason: the board names the door; the medium reads it. Every return repeats it with the next light, synthesis rule 5.)

Opening ends at about 3:30. The group walks to the front hall.

---

## 4. The hint channel

Defined once here; every room's section lists only its in-character lines.

**Who hints and how.** Tamari knows every puzzle cold; her character does not know the history. She hints in her own perception, never the answer (escape report 4.5). Three channels plus the bypass, in a ladder by time since the group last made visible progress on the room's gate. The captain, watching, keeps the time and prompts Tamari through her earpiece with the level ("nudge", "push", "bypass"); she chooses the words.

| Tier | When | Channel | Form |
|---|---|---|---|
| Nudge | about 1:30 of no visible progress | 1. The medium's craft | She reads the room, not the puzzle: where to look. "The candle leans toward the coat." "The pendulum pulls to the window." Never what to do. |
| Push | about 2:30 | 2. The spirit's word, or 3. the child's card | Raps from the room's knocker count a child (1 to 4) if the question is "who"; otherwise Tamari takes one word from the spirit: "She says: tail." Or the group turns the child's face-down card, which carries one sentence in a child's hand saying what to do with the thing, not the answer itself. Turning a card costs nothing (**CAPTAIN CALL 19**, default no cost). |
| Bypass | 3:30 (room 1: 4:00) | 4. The obey command | The mother's voice, or Tamari relaying it, names the child and the act: "Deliverance. Your hands: lift the bag, pull the tail." The bearer does it; no penalty, the relic counts fully. No room exceeds its slot. |

**What never happens:** a hint cap, a hint penalty, a hint offered while the group is visibly mid-breakthrough (the captain waits thirty seconds after any new object is picked up before calling a tier), a hint that answers a question nobody has.

**Hints in the finale** compress to the window: nudge at 0:20 of a window with no act begun, push at 0:40, bypass at 1:00. The bypass in the finale is the mother's own voice giving the sign's words; the act still has to be done by a guest with the faculty.

**How a hint reaches a cursed player.** Blind: everything is spoken anyway. Muffled: Tamari writes the one word on the spirit slate and holds it in front of them, or points at the board; the child's card can be turned and shown. Silenced: they receive like anyone. Gloved: no change. Nothing in the hint channel is audio-only after the turn.

**The non-verbal channel**, taught at the opening and used by everyone: the spirit slate (write and show) and pointing at the board. Writing needs hands and the reader needs eyes; the silenced player writes, the gloved player cannot, the blind player cannot read it. The audit of who can carry each necessary fact through those restrictions is in section 7.3.

---

## 5. Four rooms, one per child

Shared facts for every room, so each room's section can stand alone for its builder:

- **The group goes out together and comes back together**, with Tamari. One gate per room. The room's child's guest does that child's act with that child's faculty ("her hands; yours"); the other three carry the information and the second pair of hands. That is how the finale knowledge is earned: the bearer did the sign once already.
- **The relic** in every room is that child's **token**: a turned wooden peg, 40 mm tall, 18 mm at the foot, brass-capped, the cap stamped with the child's emblem (hand, eye, ear, mouth). Each has a paper finder's tag on a thread in the hand of S. Goodale, 1791, naming where it was found. The tokens fit the six brass sockets on the board at the table. In the fiction the board was Mercy's muster board and the tokens her children's recognition tokens; the Goodales found the board in the cellar and a token by each child.
- **Placing a token** at the table: the guest who carried it sets it in the socket named on its tag. The socket's light goes from amber (she wants this child found) to steady white (found). The mother's recorded line plays (the captain cues it on the placement; the socket has a reed switch under it and the token a magnet in its foot, so the captain also sees it on his panel). Her line narrows her belief and names the next child; the next child's socket comes up amber; Tamari reads it and sends the group. Nobody leaves the table before the light.
- **Hints** follow section 4; each room lists its nudge, push, card and bypass lines.
- **Nothing is destroyable.** Every gate accepts any number of wrong tries without changing state; every latch opens by a hidden release for the bypass and the reset.
- **Times** are estimates for a typical group; the sim's measurements sit beside them in section 9.

### 5.1 Deliverance: the front hall. Hands. The teaching room.

**House room.** The front hall by the door (**CAPTAIN CALL 12**). It needs one wall for the sampler, one peg for the coat, and a post or coat stand that can take 2 kg hanging on a ring. Dim: one lantern on a hook by the door, lit.

**What the players see on entering.** A coat post with a brass ring at shoulder height. A courier's satchel hangs from the ring by its own strap, tied with a knot; the flap is shut. Across the hall, a framed sampler. Beside it, a girl's wool coat on a peg. The lantern.

**Figure 5.1a (describe, do not render).** Side view of the post: the ring at 150 cm; the strap comes up from the satchel, passes through the ring, and is tied in a highwayman's hitch; the tail (15 cm) is tucked back under a leather keeper loop sewn on the strap just below the knot, so that from the front only a neat knot shows. The satchel's flap is held down by the strap: the strap passes through a D-ring on the flap, so while the satchel hangs by the strap, the flap cannot lift.

**The puzzle, as props.**

- *The sampler* (30 by 40 cm, printed on linen or stitched, framed, hung at eye height across the hall from the post):

  ```
  A COURIER'S HANDS
  The load holds.
  The tail frees.
  Tuck the tail from idle eyes;
  Pull it only when thou art home.
                       M. H.  1776
  ```

- *The scrap* in the coat's right pocket (pencil, a child's hand, folded twice): a drawing of the hitch on a ring. The hanging strap is labelled **load**. The short end is labelled **tail (under the keeper)**. One line beneath: *"Lift first, Mother says, or it binds."*
- *The satchel*: canvas or leather, 30 by 25 cm, weighted with 2 kg of sand in a sewn bag. Inside the flap: the token in a square of cloth, the finder's tag on it.
- *The knot*: a highwayman's hitch (a real quick-release hitch; any knot book has it). Loading the standing part, which is what happens when anyone tugs the satchel or the flap, tightens it. Pulling the tail spills it in one motion. With 2 kg hanging on it the tail is stiff to pull; lifting the satchel slackens it.

**Exact solution logic.** (1) The satchel is held by its strap, which is tied to the ring. (2) Pulling the satchel does nothing but bind the knot. (3) The sampler says the tail frees and the load must be lifted. (4) The scrap says where the tail is: tucked under the keeper. (5) One guest lifts the satchel; the Deliverance guest untucks the tail from the keeper and pulls it. (6) The hitch spills, the strap runs free of the ring, the satchel is in the lifter's arms, and the flap lifts. Any order of discovery works; the act needs two people at the post.

**Why it is in the story.** Deliverance came home by this door with her mother's message in the satchel and hung it here, as the drill said, before the paper went to Remember. She barred the door when Waitstill showed red. The hitch is the courier's own knot: fast to tie on a horse or a ring, freed with one pull by the one who knows which end. "Pull it only when thou art home" is the sign: the run ends when the bag comes off at home.

**How all four are busy.** The hall is dim. One guest takes the lantern down and carries it to the sampler and reads it aloud. One searches the coat and finds the scrap. One lifts the satchel. The Deliverance guest works the knot. Tamari assigns the last two in character: "Her hands were yours at the table. The post. Someone take the weight for her." Nobody stands idle for more than twenty seconds: the sampler is read by minute one, the scrap found by one and a half, the knot worked by two and a half.

**What physically happens on solve.** The strap runs through the ring with a hiss; the satchel drops into the lifter's arms; the flap opens. No electronics. The group sees the token and reads the tag: *"Hale child's token, the hand. Found 1791 in the ash inside the front door, under the bar. S. Goodale."*

**The relic.** The hand token.

**The reveal, and its pacing.** Role in the room: the sampler and the satchel say courier. Fate in the room: the tag says the door, under the bar (she barred it; she was found at it). Nothing says "died"; the place says it. At the table, on placement, the door socket goes white and the mother speaks: *"She came home. She had my words in that bag. She barred the door, the brave fool... Then they went together, all four, and Waitstill watched the road for them from her window. Find Waitstill."* The window socket comes up amber. Tamari: "The window. The parlour." (**CAPTAIN CALL 6**, partial fate per spoke, is taken: each return gives a place, and her belief that they left together survives until the fourth.)

**What it plants in its bearer.** The Deliverance guest has lifted-untucked-pulled with their own fingers. At the table in the finale, gloved, they will say: "Lift the weight. Untuck the tail from the keeper. Pull the tail, not the load." Section 7.2 has the matching fixture on the board.

**In-character hint lines.**

| Tier | Line |
|---|---|
| Nudge (1:30) | "The candle keeps leaning toward that coat." / "She is looking at the wall, not the bag." |
| Push (2:30) | Raps: none (the question is what, not who). Tamari takes a word: "She says: tail." The child's card, if turned: *"Lift me first. The tail is under the keeper. D."* |
| Bypass (4:00) | The mother's voice: "Deliverance. Your hands. Lift the bag and pull the tail." The guest does it with Tamari pointing to the keeper. |

**Reset.** Retie the hitch on the ring with the strap through the flap's D-ring, tuck the tail under the keeper, fold the token in its cloth inside, refold the scrap into the coat pocket, rehang the lantern. 60 seconds. One bin: the token, the scrap.

**Build list and rough cost.** Satchel (thrift or canvas, 10 to 25); 2 m of 10 mm cotton strap or rope with a leather keeper sewn on (8); brass ring and a post or a coat stand that takes weight (0 to 30); sampler printed on fabric and framed (15); child's coat (thrift, 5); lantern, LED, hook (15); token: turned peg, brass cap or a stamped brass disc glued on, tag (6). **About 60 to 100.** No electronics.

**Time budget.** Walk 0:10, take in 0:30, puzzle 2:20, token and walk back 0:20, placement and the mother 0:40: **4:00**. Hard cap 4:30 with the bypass at 4:00 of effort.

### 5.2 Waitstill: the window. Eyes.

**House room.** The parlour or living room, the window bay (**CAPTAIN CALL 12**). Curtains drawn; one lantern on the sill. A chair at the window.

**What the players see on entering.** On the sill, a black wooden box with a lantern built into its top. In the chair, a child's slate, faint chalk writing. On the wall by the window, a small framed card. On the sill beside the box, four square panes of colored glass in a wooden rack, loose: red, green, blue, clear-amber.

**Figure 5.2a (describe).** The lookout's box: 25 by 25 cm, 35 cm tall, black. The top 15 cm is a lantern: glass front, an LED inside that is lit whenever a pane is in the slot. A slot in the top takes one pane at a time. A lever on the right side raises a blind in front of the glass; the blind is spring-loaded and drops when the lever is released, so a "show" is only as long as the lever is held. The lower 20 cm is a lidded compartment, latched; the latch is a small solenoid or a servo.

**The puzzle, as props.**

- *The lookout's rule*, the mother's hand, framed by the window:

  ```
  THE WINDOW
  To the road, by night:
    Clear:   all quiet.
    Green:   a friend on the road.
    Red:     they come.
  Once and long:   hold.
  Thrice and short: hide.
  To the window, from the house:
    Green, once, long:  the watch is over. Come down.
  ```

- *The slate*, Waitstill's hand, chalk, a child's letters:

  ```
  14 Octr. My watch.
  Dusk.            Clear, once.
  Candle-light.    D. on the road, running. Green, once.
  Later.           Riders at Thatcher's. Red, once.
  Riders at the gate.   Red, thrice.
  I wait for the house.
  ```

- *The panes*: 8 by 8 cm acrylic or glass in red, green, blue, amber, each in a wooden frame with a tab. Each tab has a different notch pattern (one notch, two, three, four) that presses a different microswitch in the slot, so the box knows which pane is in. The notches are not referred to anywhere; they are only for the box.
- *The box's rule* (in the Arduino): open the latch when the green pane is in and the lever is held for at least two seconds continuously, then released. Any other pane, or short shows, do nothing. Nothing is counted against the group.

**Exact solution logic.** (1) The rule card gives the code. (2) The slate gives what she showed that night, and ends "I wait for the house." (3) The sign she waited for is the house's sign to the window: green, once, long. (4) The box is her lantern; it opens to the sign she waited for (Tamari, if asked why: "It was the last thing she was looking for. Show it to her."). (5) The Waitstill guest picks the green pane by its color and drops it in the slot; another holds the lever up for a slow count of three and lets go. (6) The latch clicks; the lid lifts. The thinking step is reading two documents against each other to find the one sign that is on the card and not on the slate; the doing step needs eyes to choose the pane and a hand for the lever.

**Why it is in the story.** Waitstill was the lookout. She signalled the road from the upper window with the lantern and waited for the house to call her down. The house never did; nobody was left to do it. The last line of the slate is the whole room.

**How all four are busy.** One reads the rule card. One reads the slate, which is faint, holding the sill lantern close. The Waitstill guest handles the panes and the slot ("her eyes; yours"). The fourth works the lever. The two readers must talk to each other to find the missing sign, which is the exchange that fills the middle minute.

**What physically happens on solve.** The lantern on the box shows green for the long show (the LED is behind the pane), the latch clicks audibly, and the lid can be lifted. Inside, on black cloth: the eye token and its tag: *"Hale child's token, the eye. Found 1791 at the upper window, east. S. Goodale."*

**The relic.** The eye token.

**The reveal.** Role in the room: lookout, from the rule and the slate. Fate: the upper window, east; she showed red three times and was still waiting. At the table, the window socket goes white and the mother speaks: *"She saw them at Thatcher's. She saw them at the gate. She showed red three times, and she waited for me to call her down... I was at the courthouse. Nobody called her down. Then she took the others and went. Mindwell would have been at the wall, listening; she would have knocked. Find Mindwell."* The hearth socket comes up amber. Tamari: "The hearth. The kitchen wall."

**What it plants in its bearer.** The Waitstill guest chose green by sight and watched the long show. In the finale, blind, they say: "Green. Once. Long. Hold it while you count three." The sighted doer finds green among four panes on the table lantern by color.

**In-character hint lines.**

| Tier | Line |
|---|---|
| Nudge (1:30) | "She wrote something at the bottom of that slate." / "The card has two halves. Read the second." |
| Push (2:30) | Tamari takes a word: "She says: house." The child's card: *"I showed everything on the slate. Show me the one thing nobody showed me. W."* |
| Bypass (3:30) | The mother's voice: "Waitstill. Your eyes. Green, once, and long." Tamari points at the lever. |

**Reset.** Lift the pane out and return it to the rack, close and relatch the lid with the token and tag inside, lay the slate on the chair, set the sill lantern. 45 seconds. One bin: the token.

**Build list and rough cost.** Plywood box with a glass or acrylic front (20); four colored acrylic squares and wooden frames (15); spring-loaded blind on a lever (hardware, 10); LED, four microswitches, a servo or 12 V solenoid latch, a Beetle or Nano, a USB power bank (25 to 35); rule card framed (8); slate and chalk (8); token (6). **About 90 to 110.** Software: one sketch, three inputs (pane switches as a 4-bit code, lever switch, timing), one output (latch). Test the two-second threshold with the real spring; a weak hold must fail cleanly.

**Time budget.** Walk 0:10, take in 0:20, puzzle 1:45, token and walk back 0:20, placement and the mother 0:40: **3:15**. Hard cap 3:45 with the bypass at 3:30 of effort.

### 5.3 Mindwell: the wall. Ears.

**House room.** The kitchen, the chimney breast or any wall the group can stand in front of together (**CAPTAIN CALL 12**). Normal low light.

**What the players see on entering.** A wooden panel on the wall at child height with a small door in it, shut. Beside the door, a brass funnel on a short hose ending in a forked tube with two earpieces: the listening tube. On the panel, a small framed card. A hand-sized wooden knocker block on the panel beside the door.

**Figure 5.3a (describe).** The panel: 60 by 70 cm plywood, painted as brick or plaster, screwed to the wall or standing on a frame. A door 25 by 35 cm in the lower middle, hinged, held shut by a servo latch. Behind it, a shallow box with the token. A piezo disc on the back of the door senses knocks. Upper right, a brass funnel (a gramophone horn or a plumbing funnel) fixed to the panel; from its narrow end a 60 cm hose to a Y and two rubber earpieces. Behind the funnel, inside the panel, a small speaker playing the loop at low volume, so the knocks are only clear with an ear in the tube.

**The puzzle, as props.**

- *The knock rule*, the mother's hand, framed on the panel:

  ```
  THE WALL
  She knocks what she hears. The house answers.
    One:             quiet.
    Two:             someone at the door.
    Three, and one:  they are here.
  The house answers:
    One:             stay.
    Two, and two:    heard. Come out.
  ```

- *The loop* (40 seconds, recorded): ten seconds of a kitchen at night, a kettle, wind; then from inside the wall a child's knuckles: three knocks, a pause, one knock; four seconds of quiet; the three-and-one again; then the kitchen sounds until the loop repeats. Nothing spoken.
- *The door's rule* (in the Arduino): open the latch on two knocks, a pause of 0.4 to 1.5 seconds, two knocks, with each knock pair inside 0.6 seconds. Anything else is ignored. The threshold is set with the real knocker block so a normal knock registers and the loop's own speaker does not.

**Exact solution logic.** (1) Someone puts the earpieces in and hears knocks from the wall; counting gives three, then one. (2) The card says three-and-one is "they are here" and the house's answer to be heard is two-and-two. (3) Someone knocks two, pause, two on the door. (4) The latch opens. The listening is the only way to learn which question she asked, so the answer cannot be read off the card alone; the card has two answers and only the right one opens the door.

**Why it is in the story.** Mindwell listened at the wall, in the cupboard beside the chimney, and knocked what she heard to the others. On the night she knocked "they are here", and the house never answered, because the house was Deliverance at the door, Waitstill at the window, and Remember at the table with the paper. The sign the finale needs is the answer she never got.

**How all four are busy.** The tube has two earpieces: two guests listen and must agree on the count, one of them the Mindwell guest ("her ears; yours"). One reads the card. One knocks. The listeners need two passes of the loop to be sure, which is the room's middle minute; the knocker tries two-and-two as soon as the count is agreed.

**What physically happens on solve.** The latch clicks; the door swings open on its own weight (the hinge is slightly canted). Inside: the ear token on cloth and the tag: *"Hale child's token, the ear. Found 1791 in the chimney cupboard. S. Goodale."*

**The relic.** The ear token.

**The reveal.** Role in the room: listener. Fate: the chimney cupboard. At the table, the hearth socket goes white and the mother speaks: *"She was in the wall. She knocked that they were here, and no one knocked back... So she would have taken the little one down. The cellar door opens toward the river; I showed them all, a hundred times. Remember is eight. Find Remember."* The cellar socket comes up amber. Tamari: "The cellar door. The stair."

**What it plants in its bearer.** The Mindwell guest heard three-and-one and gave or watched two-and-two. In the finale, muffled, they can still speak: "Listen for her: three and one. Answer two and two on the hearth, right after." The doer with ears waits for her knock in the fire and answers inside the window.

**In-character hint lines.**

| Tier | Line |
|---|---|
| Nudge (1:30) | "There are two ends on that tube. Two of you." / "She is knocking. Count." |
| Push (2:30) | Raps from the room's knocker: three, then one (the spirit repeats the question slowly). Tamari: "That was her. The card tells you what to say back." The child's card: *"I knock three and one. Knock me the answer on the door. M."* |
| Bypass (3:30) | The mother's voice: "Mindwell. Your ears. She says they are here. Answer her: two, and two." Tamari counts the knocks with her hand. |

**Reset.** Close and relatch the door with the token and tag inside, hang the earpieces on their hook, restart the loop (it runs all evening). 30 seconds. One bin: the token.

**Build list and rough cost.** Plywood panel and door, hinges (25); servo latch, piezo disc, a Beetle or Nano, power bank (20); funnel or horn, hose, Y, two earpieces (a cheap stethoscope supplies the Y and earpieces, 12); a small speaker and player for the loop (an MP3 module or a phone on repeat, 15); knocker block (0); card framed (8); token (6). **About 85 to 100.** Software: the knock-lock pattern with generous timing; log every knock to serial for tuning on the night.

**Time budget.** Walk 0:10, take in 0:20, puzzle 1:45, token and walk back 0:20, placement and the mother 0:40: **3:15**. Hard cap 3:45 with the bypass at 3:30 of effort.

### 5.4 Remember: the cellar door. Voice.

**House room.** The cellar door or the under-stair closet door, worked from the hall or the top of the stair; nobody goes down (**CAPTAIN CALL 12**). Low light, one lantern.

**What the players see on entering.** Fixed to the door at child height, a wooden panel painted as the house in section, with six small doors in it, all shut. On the wall beside it, a framed card. A lantern on a hook.

**Figure 5.4a (describe).** The memory house: 60 by 45 cm plywood, painted as a cutaway of a house. Five small hinged doors, 8 by 10 cm, each painted with one room's furnishing and no words: bottom centre a door with a bar and a boot scraper (the door); bottom left a row of pegs with a coat (the hall); bottom right a fire in a hearth (the hearth); middle a flight of steps (the stair); top a bed (the chamber). At the very bottom, a wider door 15 by 10 cm painted with barrels (the cellar), held by a servo latch. Behind each small door, painted inside, a word or two. A microswitch behind each small door. Inside the cellar door, the token on cloth, the tag, and painted on the back wall the last words of the drill.

**The puzzle, as props.**

- *The memorizer's rule*, the mother's hand, framed:

  ```
  THE WALK
  Hear it once. Walk it through the house
  as you walk it coming home:
  in at the door, along the hall, to the hearth,
  up the stair, into the chamber, down to the cellar.
  Leave one piece in each room.
  Say it back by walking.
  Then the paper goes into the fire.
  ```

- *Inside the five doors*, in walk order: door **HEAR IT**; hall **ONCE.**; hearth **HOLD IT**; stair **WHOLE.**; chamber **SAY IT**. Inside the cellar: **TO NONE BUT HER.**
- *The panel's rule* (in the Arduino): when all five doors are shut, the next five first-openings must be door, hall, hearth, stair, chamber in that order; then the cellar latch opens. A wrong door in the sequence makes a soft click and the panel waits until all five are shut again. Opening the doors in reading order (left to right, top to bottom) is wrong; only the walk order counts.

**Exact solution logic.** (1) The card gives the walk: door, hall, hearth, stair, chamber, cellar. (2) The doors show rooms by furnishing only; the group must match picture to room name. (3) Open them in walk order; each shows a piece of the drill. (4) After the chamber, the cellar opens. (5) Tamari asks the Remember guest to "say it back by walking": *"Hear it once. Hold it whole. Say it to none but her."* That saying is not gated by the panel; Tamari asks for it in character and waits for it, because the finale needs the group to have heard a message said back in walk order once.

**Why it is in the story.** Remember, eight, carried every message in her head, placed room by room through the house the way her mother taught her, and the paper was burned. On the night, she was at the kitchen table learning her mother's last line when Waitstill showed red. Mindwell took her to the cellar. The bulkhead to the river was barred from outside.

**How all four are busy.** One reads the card aloud and keeps the order. One holds the lantern close and names what each small door's picture is. One opens doors (the Remember guest, so that their hands have walked it). One keeps count on the spirit slate, which comes with the group from the table from this room on (Tamari carries it: "she will want her slate"), writing the pieces in order as they are read; this is the first time the slate is used for real, one room before it matters.

**What physically happens on solve.** The cellar latch clicks and the barrel door swings down. Inside: the mouth token, the tag, and the painted last line. The tag: *"Hale child's token, the mouth. Found 1791 in the cellar, by the bulkhead door, which was barred. S. Goodale."* (**CAPTAIN CALL B9** on how dark the tags are; this is the darkest line in the game.)

**The relic.** The mouth token.

**The reveal, and the fourth return.** Role in the room: memorizer. Fate: the cellar, by the barred way out. At the table, before anyone places the token, Tamari stops the group: "Before she speaks. Look at the house." The three white lights: door, window, hearth. The amber cellar. The dark river. The Remember guest places the token; the cellar goes white. Tamari: "Where were they?" She waits for the group to answer; a group that does not, she asks one at a time: "Deliverance?" "The door." "Waitstill?" "The window." "Mindwell?" "The wall." "Remember?" "The cellar." "And the river?" "Nobody." That is the conclusion the fourth relic completes, stated by the players, not announced. Then the mother speaks (section 6).

**What it plants in its bearer.** The Remember guest walked the house in order and said a message back by walking. In the finale, silenced, they order the six pieces of the last message on the slate in walk order, and point at the slate; another voice says it.

**In-character hint lines.**

| Tier | Line |
|---|---|
| Nudge (1:30) | "Coming home. Which door do you come in by?" / "That picture is a bed. Where is the bed in a house?" |
| Push (2:30) | Tamari takes a word: "She says: walk." The child's card: *"Shut them all. Then in at the door, as you come home. R."* |
| Bypass (3:30) | The mother's voice: "Remember. Your voice. Door, hall, hearth, stair, chamber. Say it." Tamari opens the doors with the guest in that order. |

**Reset.** Shut the five doors, relatch the cellar with the token and tag inside, wipe the slate, rehang the lantern. 40 seconds. One bin: the token.

**Build list and rough cost.** Plywood panel, six small doors with hinges (30); five microswitches, a servo latch, a Beetle or Nano, power bank (22); paint (10); card framed (8); token (6). **About 75 to 90.** Software: a five-step sequence lock with an all-shut reset.

**Time budget.** Walk 0:10, take in 0:20, puzzle 1:45, token and walk back 0:20, placement, the question and the mother 0:40: **3:15**. Hard cap 3:45.

### 5.5 Four rooms together

| | Deliverance | Waitstill | Mindwell | Remember |
|---|---|---|---|---|
| Faculty the act needs | Hands | Eyes (and a hand) | Ears (and a hand) | Hands, then voice |
| Information is | Sampler and scrap | Card and slate | Card and the tube | Card and pictures |
| The thing is | The knot on the post | The pane slot and lever | The door | The six doors |
| Guests needed at once | 4 | 4 | 4 | 4 |
| The sign learned | Lift, untuck, pull | Green, once, long | Three-and-one; answer two-and-two | Walk order; say it back |
| Place on the tag | The door, under the bar | The upper window | The chimney cupboard | The cellar, bulkhead barred |
| Electronics | None | Latch, 5 switches | Latch, piezo, speaker | Latch, 5 switches |
| Cost | 60 to 100 | 90 to 110 | 85 to 100 | 75 to 90 |
| Time | 4:00 | 3:15 | 3:15 | 3:15 |

The dependency graph is a chain of four with no cycle; every clue is used once; nothing can be skipped because each socket's light sends the group to the next room and the mother's line names it. No red herrings: every object in a room is read or used.

---

## 6. The turn

The exact cue sequence from the fourth placement, on the immersive report's table. Nothing the players must understand fires at the same time as anything loud. The clock starts at the last row (**CAPTAIN CALL 4**, default after the fourth curse and the objective; the argument is at the end of this section).

| # | Beat | What the players perceive | What Tamari does | What the captain fires |
|---|---|---|---|---|
| 0 | Fourth token placed | Cellar socket white. Four white, river dark. | "Where were they?" Gets the four places and "nobody" at the river from the group (section 5.4). | Nothing. The placement arms the turn on his panel; it cannot fire the turn. A token lifted and replaced does nothing. |
| 1 | Readiness | Nothing yet. | Checks: all four seated, the Waitstill guest in the chair they will keep, slate and chalk on the table, the lantern at the window position, the hearth plate clear, nobody holding anything. Lays her hand flat on the table: the signal. | Waits for the hand. |
| 2 | She understands | The mother, quiet, over silence: *"The door. The window. The wall. The cellar. None of them reached the river. They were all in the house. They were all in the house when it burned."* Three seconds of nothing. Then a low fire bed begins, the room light goes to ember-amber and flickers, shadows move on the walls, haze drifts for twenty seconds and stops. The four white sockets begin a slow pulse. | Still. | TURN, one group cue: her line; then the bed at low level, the light change, the flicker and shadow projector, the haze machine on for twenty seconds. |
| 3 | Her intent | Over the bed, dipped for the line: *"Then I will have them back. One into each of you who carries their mark. Eldest first."* | "Hold still. Everyone hold still." | Ducks the bed under her line. |
| 4 | The four calls | Her voice, one at a time, each waiting for the last: *"Deliverance. Your hands are mine."* The Deliverance guest puts on the gloves. *"Waitstill. Your eyes are mine."* The scarf comes up. *"Mindwell. Your ears are mine."* The muffs go on. *"Remember. Your voice is mine."* The kerchief comes up over the mouth, loose. | Watches each guest do the thing they practised. A hesitation: "She called your child. Gloves." A refusal or a fumble: "Then keep them off and help as you can"; no penalty, no second ask. Once the scarf is up she puts the Waitstill guest's hands on the table edge and says who their guide is (section 10). | Each call on Tamari's nod, never on a timer. About fifteen seconds per call. |
| 5 | The objective | Bed stays low. Tamari stands with the slate. She speaks the delivery below. She writes **SEND THEM HOME, D W M R** on the slate and holds it in front of the Mindwell guest, then points at the four pulsing lights and the dark river. | Delivers; checks the Mindwell guest nods. | Holds the bed low until her second hand signal. |
| 6 | The clock starts | The bed rises. A child's scream, far off, enters the fire. The door light's pulse quickens. | "Deliverance first. The cord. Who has hands?" Hand flat on the table again. | Starts the MASTER timeline. This is time zero of the finale. |

**The full delivery** (danger, action, deadline, who, confirmation, first move):

> "She means to put her children into you, one into each of you who carries a mark, eldest first. But she taught them to answer the network's signs before any voice, even hers; that is how they lived through a war. Each of you learned your child's sign in its room. Give each child its sign and it goes home, and she cannot hold what she taught to let go. Each child's scream is coming up through the fire. When it reaches the one who wears its mark, she has that one. The one who wears the mark knows the sign and cannot give it. Tell it; someone else gives it. You will know a child is home when its voice leaves the fire and its light goes to the river. Then carry its token to the river. Deliverance first. The cord."

If a guest asks "what sign?", Tamari answers for the child in question with where it was learned, not the sign: "What you did in the hall."

**The self-applied curses and their safe forms** (the immersive report's safe-boundary table, applied):

| Child | The object, worn since the opening | The curse | Safe form | What remains |
|---|---|---|---|---|
| Deliverance | Gloves hanging from the wrist cord | Gloves on | Loose, bulky; off at any time; no binding. If kept off: the rule "no fine pieces" applies instead | Can speak, hear, see, lift, carry, point, hold a lever |
| Waitstill | The scarf at the neck | Scarf over the eyes | Seated at the table from the turn to the end; a named guide; the scarf comes off at any word. If kept off: the rule "eyes shut when you work at the board" | Can speak, hear, feel; can do hands work by feel |
| Mindwell | Muffs at the neck | Muffs on | Passive ear defenders, not blocking speech at close range; the rule carries the curse: nothing heard from the fire or the medium counts for this guest; everything reaches them by the slate, the lights, and pointing (**CAPTAIN CALL 20**: muffs plus the rule, not real deafening) | Can speak, see, use hands |
| Remember | The kerchief at the throat | Kerchief up over the mouth, loose | Never tight, never a gag; safety speech always allowed; the rule carries the curse: no game speech | Can see, hear, write, point, arrange, open and close |

**Why the clock starts after the fourth curse** (**CAPTAIN CALL 4**). The playtest measured a 15-second margin on the first child when the soundtrack started at the fourth relic, and one twenty-second confer lost that child. The objective is a six-sentence delivery that must be received under low sound (immersive principle 6) and reach a deaf player by slate. In the fiction, the fire begins at the revelation (beat 2, which keeps handoff principle 5), and her ritual begins when she has all four marks (beat 6): she cannot put a child into a guest she has not claimed. So the fire and the clock are separate things and the fiction loses nothing.

**Time.** Beats 0 to 6: 0:15, 0:05, 0:20, 0:10, 1:00, 0:30, 0:05: **2:25** from the fourth placement to time zero.

---

## 7. The finale

### 7.1 Her progress, on sound and light

The master timeline runs **6:30** from time zero (**CAPTAIN CALL 3**, the soundtrack length). She takes the next child not yet home at fixed moments, eldest first:

| Child | Warning begins | Taken at | Window for the group |
|---|---|---|---|
| Deliverance | 1:00 | **1:30** | 1:30 |
| Waitstill | 2:30 | **3:00** | 1:30 more |
| Mindwell | 4:00 | **4:30** | 1:30 more |
| Remember | 6:00 | **6:30** | 2:00 more |

The moments are fixed, not relative to progress: a group that sends Deliverance home at 0:40 may start Waitstill at once and bank the time. Every beat has a heard form and a seen form, so the muffled guest and the blind guest each get all of it:

| Beat | Heard | Seen | Tamari says |
|---|---|---|---|
| She is calling a child (30 s before the taking) | The child's scream rises close; her voice: *"Deliverance. Come."* | That child's socket pulses fast, red and white | "She's calling Deliverance." |
| A child is taken | The scream stops. The child's voice from the board: *"Here, Mother."* | The socket goes steady red | "She has Deliverance. Keep going. The others can still go home." |
| A child goes home | The child's scream leaves the fire (its stem fades over two seconds) and one soft bell | The socket goes dark; one river light comes up white | "Deliverance is home. Take her to the river." A sighted guest carries the token to the river socket. |
| Time warnings | Her voice at 3:00 and 5:00: *"Half my children."* *"One more."* (fixed lines on the master) | The river lights and the sockets are the state at any moment | Repeats the count plainly if asked |

The river socket row has four small white lights, one per child home, so the count is readable from across the room.

### 7.2 Each severing: the fixture, the telling, the doing

The board at the finale carries four fixtures at the four positions. All were on the table from the opening (the cord, the lantern) or are part of the board (the hearth plate, the slate beside it), so nothing is handed out at the turn.

**Deliverance: the cord (hands).**
*Fixture.* The hand token stands in the door socket with a cord loop in the groove of its neck. The two ends of the cord pass through a brass ring on the table edge nearest the door and are tied there with the courier's hitch, tail tucked under a leather keeper; the standing end goes on through the ring to a 1 kg weight hanging under the table lip. The weight keeps the loop tight; the token cannot be lifted out.
*Figure 7.2a (describe).* Top view: the board's door position, the token, the loop in its neck groove, the cord running to the edge ring; side view: the hitch at the ring, the keeper, the tail, the weight below the table edge.
*The telling.* The gloved Deliverance guest: "Lift the weight. Untuck the tail from the keeper. Pull the tail, not the load."
*The doing.* Two people: one lifts the weight (gloved hands can do this; the bearer usually does), one with fingers untucks and pulls. The hitch spills, the loop slackens, the token lifts.
*Confirmation.* The reed switch under the socket sees the token leave; the captain cuts the Deliverance stem, the door light goes dark, river light one comes up. About 30 seconds of doing.
*Path through restrictions.* Bearer tells by voice (has voice and hearing). Doer needs fingers: the Remember guest or the Mindwell guest; the Waitstill guest by feel if nobody else can.

**Waitstill: the lantern (eyes).**
*Fixture.* The signal lantern at the window position: the same lantern as the parlour box's top, no compartment, its switches wired to the board controller. The four panes in their rack beside it.
*The telling.* The blind Waitstill guest: "Green. Once. Long. Hold the lever while you count three."
*The doing.* One person: pick the green pane by color, drop it in the slot, hold the lever for a slow three, let go.
*Confirmation.* The controller sees green plus a held show of two seconds or more; the captain cuts the Waitstill stem, the window light goes dark, river light two. The token lifts freely. About 20 seconds of doing.
*Path.* Bearer tells by voice. Doer needs eyes and a hand that can take a 2 cm tab: the Mindwell guest or the Remember guest. The gloved guest can hold the lever while another chooses the pane.

**Mindwell: the hearth (ears).**
*Fixture.* A 15 by 15 cm wooden plate set into the board at the hearth, a piezo under it and a small speaker under that. Every 25 seconds from time zero the plate itself knocks three-and-one (the controller plays it; she is "in the wall" of her mother's board). It is only clear with an ear near the board.
*The telling.* The muffled Mindwell guest, who can speak: "Put your ear to the hearth. She knocks three and one. Right after, knock two and two." If the group doubts, they write it on the slate and show it.
*The doing.* One person listens at the plate, waits for her knock, then knocks two, pause, two on the plate within eight seconds of her last knock.
*Confirmation.* The controller accepts two-and-two only inside the eight-second window after its own knock; the captain cuts the Mindwell stem, the hearth light goes dark, river light three. About 40 seconds of doing including the wait.
*Path.* Bearer tells by voice. Doer needs ears: the Deliverance guest (gloved hands can knock), the Waitstill guest by ear, or the Remember guest. The deaf guest cannot do it and is not asked to.

**Remember: the slate (voice).** The last act, and the one everything converges on.
*Fixture.* The spirit slate and chalk at the cellar position. The Remember stem, from time zero, is Remember's voice in the fire reciting her mother's last line the way she learned it, one piece every twelve seconds in a fixed scrambled order, each piece named for its room: *"In the hall: to the river." "In the cellar: for no one." "At the door: go." "In the chamber: wait." "At the hearth: tonight." "On the stair: all of you."* A full cycle is 72 seconds.
*The gathering.* From time zero, whoever is not telling or doing listens and writes each piece on the slate with its room, or tells it to the writer. By the third window every piece has been heard twice.
*Remember's own act.* The silenced Remember guest orders the six pieces in walk order on the slate (door, hall, hearth, stair, chamber, cellar), which they learned by walking the memory house, and points at the slate when it is whole. This is judgment, not custody: a wrong order is a wrong message. If the Remember guest cannot write (they can; they have hands and eyes), they point the order out piece by piece.
*The telling and the doing.* A guest with a voice reads the slate aloud to the board: *"Go to the river tonight, all of you. Wait for no one."*
*Confirmation.* Tamari is the sensor: she hears it whole and in order and says "She hears you"; the captain fires WIN. If it is said wrong or incomplete she says "Not whole. Again." and nothing is lost. About 30 seconds of doing once the slate is ready.
*Path.* Pieces are heard by anyone with ears, including the blind guest, and written by anyone with eyes and fingers; ordered by the Remember guest; spoken by the Deliverance, Waitstill or Mindwell guest. The deaf guest can write what is pointed to and can speak the finished slate.

### 7.3 Who can carry each necessary fact

The immersive report's audit (who can receive, interpret, transmit, act), run on every fact the finale needs:

| Fact | Receive | Interpret | Transmit | Act |
|---|---|---|---|---|
| The objective | Hearing guests by ear; Mindwell guest by the slate and pointing | All | Tamari | — |
| Who she is calling now | By ear (scream, her voice); by eye (the pulsing socket) | All | Tamari says it; the lights show it | — |
| Deliverance's sign | Deliverance guest, from the hall | Same | By voice | Remember or Mindwell guest's fingers; Waitstill by feel |
| Waitstill's sign | Waitstill guest, from the window | Same | By voice | Mindwell or Remember guest's eyes |
| Mindwell's sign | Mindwell guest, from the wall | Same | By voice, or the slate | Deliverance, Waitstill or Remember guest's ears |
| The six pieces | Any hearing guest, from the fire | Remember guest orders them | By chalk, or by telling the writer | Any voice but Remember's |
| A child is home | By ear (stem out, bell); by eye (socket dark, river light) | All | Tamari | A sighted guest moves the token |
| A child is taken | By ear ("Here, Mother"); by eye (red) | All | Tamari | — |
| A hint | By ear; or Tamari's slate | All | Tamari | — |
| The stop | Any guest by voice, including Remember's | — | — | Everything stops |

No fact has a single channel, and no restriction removes a guest's last useful action. The Deliverance guest, who the playtest feared would direct everything, cannot untuck, cannot choose a pane and cannot order the slate; what they can do is lift the weight, hold the lever, knock, and read the slate aloud.

### 7.4 Four busy at once

Window one: Deliverance guest tells and lifts; Remember guest untucks and pulls; Waitstill guest and Mindwell guest start the slate (the blind guest hears the pieces and tells them; the deaf guest writes them). Window two: Waitstill guest tells; Mindwell guest chooses the pane; Deliverance guest holds the lever; Remember guest keeps writing. Window three: Mindwell guest tells; Deliverance guest listens at the hearth and knocks; Remember guest orders the slate; Waitstill guest confirms pieces by ear. Window four: Remember guest points; Waitstill guest or Deliverance guest reads it aloud; everyone watches the board. The rehearsal count the immersive report asks for (who receives, decides, sends something useful per minute) is at least one of each per guest per window on paper; the real count is a rehearsal item.

### 7.5 Hints in the finale

Per window: nudge at 0:20 of no act begun ("The one who did it in the hall. Tell them."), push at 0:40 (Tamari names the doer: "You have hands. Go to the cord."), bypass at 1:00 (the mother's own voice gives the sign's words: *"Lift it. The tail."*; *"Green. Once."*; *"Two and two."*; the sixth piece in order). The act is still done by a guest with the faculty; a bypassed child still counts as home (**CAPTAIN CALL 8**: a stall costs nothing but time).

### 7.6 The one last act everyone watches, and the win

The fourth act is linear by construction: nothing else is left, the three other stems are gone, the fire is one child's voice and the bed, and one guest reads the slate aloud while the other three watch the board. On "She hears you" the captain fires **WIN**: the Remember stem fades, the bed falls to embers over five seconds, the fourth river light comes up, the four sockets are dark, and the mother speaks her last line (win): *"Go to the river tonight, all of you. Wait for no one... They heard me. They heard me, and they stayed."* Four seconds. *"Let them go, then. Let me go."* The ember light holds. Tamari: "She's let go." Then section 8.

**Win confirmation in one sentence**, for the players and the debrief: *You won because you sent all four home by their own signs before any scream reached its bearer.*

### 7.7 The failure set piece, and the tiers

At 6:30, if any child is not home, the master timeline runs the **roll**: the bed cuts to a close crackle; her voice calls each name in order, with four seconds after each. For a taken child the child's voice answers from the board, *"Here, Mother,"* and the bearer, taught at the opening what to do if she has them at the end, sits still with their hands on the table; the socket stays red. For a child who went home, silence, and the river light. After the fourth name the fire cuts to nothing and the light drops to embers. Her line: *"Then I keep what I have."*

Tamari closes the circle, which is the humane return the immersive report asks for: *"Mercy Hale. I close this sitting. What you took is not yours to keep."* She goes to each taken guest, puts her hand flat on the table before them, says their real name, and the red goes out (the captain, on her hand). Then the count, by tier (**CAPTAIN CALL 5**, default a tiered ending with the count named, staged as its own beat, not a win):

| Children home | Tamari's line after the circle is closed |
|---|---|
| 4 | (The win; no roll.) |
| 3 | "Three of them went home. She kept one: [child]. I made her give [guest's name] back; the child she keeps is still in the fire. You did almost all of it. The sign you needed was [the sign]." |
| 2 | "Two went home: [names]. She kept [names]. They are hers again, and [guests' names] are yours again. The signs you needed were [signs]." |
| 1 | "One went home: [name]. She kept the other three. You found the way for one; the rest were [signs]." |
| 0 | "She kept them all. The signs were in the rooms: the cord, the lantern, the wall, the walk. She taught them to let go; nobody gave the word." |

If the last child still in the fire goes home while another is already taken, the roll is called at once rather than at 6:30: she has nothing left to take, and the ending is the tier. Every tier names what was missed (escape principle 29), and nobody pretends to be possessed at the party. A taken guest is a guest again the moment Tamari says their name.

**What a taken guest does until then** (**CAPTAIN CALL 9**, default: nobody leaves, a taken guest keeps every faculty they still had and keeps helping; the taking is a beat and a tier, not a removal). In the fiction she has their mark; in the room they are still at the table, and their later acts count.

### 7.8 Audio architecture

**Default (CAPTAIN CALL 17 on equipment): a master timeline plus four stems.**

- *Master timeline* (one file, 6:30 plus the roll): the fire bed rising in three steps at 0:00, 2:00, 4:30; her calls at 1:00, 2:30, 4:00, 6:00 ("[Name]. Come."); her time lines at 3:00 and 5:00; the takings' "Here, Mother" at 1:30, 3:00, 4:30, 6:30 as separate short cues the captain fires only if that child is not home; the roll at 6:30.
- *Four stems*, each looping from time zero, each cut by the captain on confirmation (sensor or Tamari's hand): Deliverance's scream; Waitstill's scream; Mindwell's scream (her knock is played by the board itself); Remember's voice reciting the pieces, under a scream that is faint until the third child is home and then clears.
- *Confirmation cues*: one soft bell and the river light, on each cut.
- *WIN*: cancels every scheduled taking and the roll; runs the win line.
- *The real stop*: a separate button: all audio off, haze off, room lights full.

The captain runs this from one laptop with a cue list (QLab-style grouped cues, or the captain's own Python with four audio channels and a serial link to the board controller); no new show-control platform is required. The board controller (one Beetle) owns the sockets' reeds and lights, the lantern switches, the hearth piezo and speaker, and reports to the laptop over serial; the laptop can also drive every light directly if the reeds fail.

**Fallback if stems cannot be mixed live:** one fixed bed with the four screams pre-mixed and no cuts; the sockets' lights and the river lights carry all progress; Tamari confirms each child home aloud and on the slate. The design loses the "scream leaves the fire" beat but nothing the players need.

**Levels.** The bed at the table peaks below the level at which four people can still be understood at one metre; the immersive report's rehearsal item is to test this with the real muffs, scarf and kerchief on and the real room. Her lines are always ducked under.

### 7.9 The real stop

"Cut" or "stop", from anyone including the silenced guest, or Tamari's own call: the captain hits the stop button; everything is silent; haze off; room lights full; Tamari: "Everything's off. Take your things off. We're done for now." Resume only if the person who stopped it wants to, and then from the start of the current window with the clock reset to that window's start.

---

## 8. The ending and exit

**The walk-out beat, win (1:30).** The ember light holds; the four tokens stand at the river. Tamari sits. "There was one more thing the Goodales kept." She takes the fifth paper from the deck box, a folded letter, and reads Josiah's unsent letter (B10): *"I have said what they asked of me. They promise me the children for it. God forgive me, I believe them. Go to the river when the children are safe. J. H."* The mother's last recorded word, soft, once: *"Josiah."* Nothing more; the design does not say whether she forgives him (**CAPTAIN CALL B10**: the truth is told here, by the medium, after the win, as the handoff's "mother may die believing" is left where the handoff left it). Five seconds. Tamari: "The circle is closed. Take off what you were given." The guests take off their own gloves, scarf, muffs, kerchief. Room lights come up to warm. "You sent them home. All four." She tells them the one sentence they won by (section 7.6). The door is open.

**The walk-out, loss.** The circle is closed and the count given (section 7.7); the letter is still read, because the truth is the evening's, not the win's; "Take off what you were given"; lights; the door.

**What the players walk out with.** Each keeps their child's binding card (the face-up card from section 3.3). Tamari signs the back with the sign that child needed, in the mother's phrasing ("Green, once, long"), as she sees them out. Nothing else leaves the table.

**What the first group may tell the fifth** (**CAPTAIN CALL 18**, default): Tamari asks them at the door for three things and no more: stay together, ask her when you are stuck, and the thing you were given is the thing you will need. Not the signs, not the rooms, not the ending. The later groups are told that the earlier groups were asked this.

**Reset for the next group** (target 10 minutes, two people):

| Where | What | Time |
|---|---|---|
| Table | Tokens back to their rooms' bins; the cord loop retied with the hitch, weight hung; green pane back in the rack; slate wiped; cloth retied over the board with the four corner knots (three fast, Deliverance's the hitch); child's cards reshuffled into the box lid; the letter refolded under them; lights and audio reset to standby | 4:00 |
| Front hall | Section 5.1 reset | 1:00 |
| Parlour | Section 5.2 reset | 0:45 |
| Kitchen | Section 5.3 reset | 0:30 |
| Cellar door | Section 5.4 reset | 0:40 |
| Curse objects | Gloves, scarf, muffs, kerchief wiped or swapped for the second set and laid at the medium's place | 1:00 |
| Check | The captain walks all four gates with the hidden releases; haze fluid; alarms untouched | 2:00 |

Two sets of the four curse objects, used alternately, keep the swap at a minute.

---

## 9. Timing table

Estimates are the design's (sections 3 to 8). The sim's numbers are from `sim/` (section 13): the scripted bot on ten seeds with the engine's per-step jitter (0.7 to 1.6 times the estimate), the deterministic baseline (jitter 1.0), a slow group (1.6 everywhere) and a group that hits every room's bypass (3.0 everywhere), plus four hand-scripted finales on seed 1.

| Segment | Estimate | Cap | Sim, deterministic | Sim, bot seeds 0 to 9 | Sim, slow 1.6 | Sim, every bypass |
|---|---|---|---|---|---|---|
| Arrival and opening, with the tutorial gate | 3:30 | 3:30 | 3:30 | 3:30 | 3:30 | 3:30 |
| Deliverance room, walk, placement and the mother's line | 4:00 | 4:30 | 3:45 | 3:19 to 4:35 | 4:40 | 5:39 |
| Waitstill, with return | 3:15 | 3:45 | 3:24 | 2:49 to 4:02 | 4:01 | 5:07 |
| Mindwell, with return | 3:15 | 3:45 | 3:24 | 2:49 to 4:02 | 4:01 | 5:07 |
| Remember, with return (no mother's line: the turn follows) | 3:15 | 3:45 | 2:54 | 2:19 to 3:32 | 3:31 | 4:37 |
| The turn, fourth placement to time zero | 2:25 | 2:25 | 2:25 | 2:25 | 2:25 | 2:25 |
| **Fourth curse and objective done at** | **19:40** | **21:40** | **19:22** | **17:46 to 20:32** | **22:10** | **26:26** |
| Finale, time zero to the fourth child home | 4:30 | 6:30 | 3:05 | 3:05 | 3:05 | 3:05 |
| Walk-out | 1:30 | 1:30 | not modelled | not modelled | not modelled | not modelled |
| **Run to a win** | **25:40** | **29:40** | **22:27** + 1:30 | **21:26 to 24:12** + 1:30 | **25:15** + 1:30 | **29:31** + 1:30 |

Reading it: a typical group lands between 23 and 26 minutes including the walk-out; the thirty-minute cap holds even for a group that needs the bypass in every room (31:01 with the walk-out, which is the one case over the cap by a minute; the fix if it ever happens is Tamari's call to shorten the walk-out, not a rule). The sim's room times run a little under the estimates because the bot never fumbles a prop; the "every bypass" column is the real worst case because the bypass is a hard cap on effort. Hand-scripted finales on seed 1 (time zero at 19:56):

| Finale script | First child home at | All four | Result | Soundtrack left |
|---|---|---|---|---|
| Win, as taught | +0:45 | +2:55 | won, 22:51 | 3:35 |
| One hesitation (the playtest's loss): gloved bearer tries it, a confer, the blind one does it by feel | +1:05 | +3:25 | won, 23:21 | 3:05 |
| A minute of nothing, then told at +1:25 | taken at +1:30 | +3:50 | lost, tier 3 of 4, 23:46 | roll called early |
| Nobody moves | taken at +1:30, +3:00, +4:30, +6:30 | | lost, tier 0, 26:26 | 0:00 |

The margin on the first child is 45 seconds for a group that does it as taught and 25 seconds for the playtest's hesitant group that lost under the old clock. The pressure is still at the front, by design: the first act is the easiest, and the windows widen as the acts get harder.

---

## 10. Safety

- **The blind player is seated** from the moment the scarf goes up until Tamari says "take off what you were given", at the table, in the chair they chose at the arrival minute. Their **named guide** is the Deliverance guest, who can see, hear and speak (gloved hands can still take an elbow); Tamari is the second guide. The route from that chair to the door is walked once at the arrival minute with the scarf down. The scarf comes off at any time for any reason; nothing is lost by it. Nothing is handed to the blind player without a word first; nothing touches them unannounced.
- **Haze, not fog.** A water-based hazer for twenty seconds at the turn, aimed up, never at the floor, never within half a metre of a person, visibility never under two metres. Smoke alarms stay armed; if the haze trips one, the haze is cut from the show, not the alarm from the house. Haze is **CAPTAIN CALL 17**, default in for the twenty seconds and otherwise out; the fire is light, shadow and sound.
- **The stop word** is "cut", and "stop" or any plain distress works too, from anyone, including the silenced guest (safety speech is never under the kerchief's rule) and Tamari. The captain's stop button kills audio and haze and brings room light to full in one press. Tested with the effects running before the first group.
- **Hearing: the rule, not real muffling.** The muffs are passive ear defenders that still pass close speech; the curse is the rule that nothing heard counts, and every instruction, progress beat and hint has a seen form (slate, lights, pointing). The muffled guest can always hear "cut".
- **Voice.** The kerchief is loose and never over the nose; it is a sign, not a gag; the guest ties it themselves.
- **Hands.** Loose gloves, nothing bound; off at any time.
- **Exits.** The door to the porch stays unlocked and unobstructed; nothing in the hall (Deliverance's room) is left on the floor; the cellar door is never opened. The exit does not depend on winning.
- **Touch.** None by design. Tamari's hand goes on the table in front of a guest, not on the guest. The binding (cord, scarf, muffs, kerchief) is put on with the guest's hands, Tamari guiding by word.
- **Tamari's exposure** to haze and sound repeats five times; the hazer is twenty seconds per sitting and the bed level is set so she can speak over it without strain.

---

## 11. Principle checklist

Every numbered rule in the synthesis's section 0. Pass, fail or not applicable, one line each.

### 11a. Escape-room craft

| # | Rule | Verdict | Reason |
|---|---|---|---|
| 1 | Structure by team size and story | Pass | Sequential hub-and-spoke for four who stay together; a linear finish. |
| 2 | Linear stretches short and easy, nothing workable by one alone | Pass | One gate per room, under four minutes, each needing a reader and a doer; the finale acts need a teller and a doer. |
| 3 | Branching for hands, chokepoints for story, linear finish | Partial | Within each room four jobs run at once; the route itself never branches, which is the settled structure. The finish is linear. |
| 4 | Finale is a meta-puzzle of physical pieces | Pass | Four tokens on the board, four fixtures, four signs learned in four rooms. |
| 5 | Separate information from use; each player necessary | Pass | Every room splits card from thing; every finale act needs the bearer's sign and another's faculty. |
| 6 | Acyclic, each clue used once, nothing missable | Pass | Rooms in a fixed order sent by the lights; every clue used once; the turn arms only on the fourth token. |
| 7 | Ask why of every object | Pass | Every object is a child's tool or the mother's rule; no lock exists without a reason. |
| 8 | Actions discernable, puzzles self-validate | Pass | Every gate clicks open; every placement lights a socket; every sign cuts a stem and lights the river. Remember's act is validated by Tamari, which is the one human-confirmed gate. |
| 9 | Players can tell which gates are open | Pass | One gate per room; the board shows which child is wanted next and, in the finale, which is being called. |
| 10 | Rules stated once, in the fiction, never violated | Pass | One rule at the opening, demonstrated at the cloth, used at the turn; the game never asks anything else of the objects. |
| 11 | A legible diegetic clock | Pass | Her calls thirty seconds before each taking, on sound and light; two spoken time lines. |
| 12 | Plan where attention goes under the clock | Pass | The board is the only place anything happens in the finale; the called child's light is the focus. |
| 13 | Hint system is part of the design | Pass | Section 4, with per-room lines and a finale ladder. |
| 14 | Gamemaster intervenes on judgment | Pass | The captain times, Tamari reads the room; hints are offered, not only requested. |
| 15 | No hint caps | Pass | None; the child's cards cost nothing. |
| 16 | Never take the breakthrough away | Pass | Thirty-second wait after any new object is picked up; the nudge names where, not what. |
| 17 | Hints sized from one word up, two channels | Pass | The medium's craft, the spirit's word, the card, the command. |
| 18 | Hints in character | Pass | All four tiers are in the fiction. |
| 19 | In-room actor: trust, read the quiet ones, short | Pass on paper | The opening is under a minute of speech; the rest is rehearsal. |
| 20 | Release content on a regular beat | Pass | A room every three to four minutes; a child every ninety seconds in the finale. |
| 21 | No puzzle over five minutes; no tedium | Pass | Bypass at 3:30 and 4:00; no counting, no searching beyond one coat pocket. |
| 22 | Every puzzle memorable, varied types | Pass | A knot, a lantern code, a knock code, a memory walk; nothing repeated. |
| 23 | Bottleneck before a reveal, cue with sound and light | Pass | Every reveal is at the table; the fourth has Tamari's question before the mother speaks. |
| 24 | Story reveals change play | Pass | Each room's reveal is the sign the finale needs; the fourth changes the objective. |
| 25 | Start shallow and deepen | Pass | The cloth, then the hall; the finale is the same shape with the faculties swapped. |
| 26 | After the climax, show the changed world, leave space | Pass | The tokens at the river, the letter, the ember light, then the circle closed. |
| 27 | Failure as a set piece | Pass | The roll call. |
| 28 | Tiered win, no instant fail with time left | Pass | Four tiers; a taken child never ends play. |
| 29 | Walk a failed team through what they missed | Pass | Each tier's line names the signs. |
| 30 | Escape rate near 40 percent, tuned live | Unknown | The sim wins every seed because the bot never fumbles; the rate is a rehearsal number. Tamari tunes it with the ladder. |
| 31 | No prop whose failure ends the game; bypass per prop | Pass | Every latch has a hidden release; every gate has the obey bypass; the finale has the fixed-bed fallback. |
| 32 | Check the set each group; no destroyable states | Pass | Section 8's reset check; no gate changes state on a wrong try. |
| 33 | Short resets, props in bins | Partial | Ten minutes, not thirty seconds; the knot and the cloth are the slow items. Under the fifteen the captain accepted. |
| 34 | Fog rules; a way out | Pass | Haze only, twenty seconds, two-metre rule, alarms armed, door open. |
| 35 | Blindfold: a guide, a walked route, off any time | Pass | Section 10. |
| 36 | One actor plus one on effects, actor knows every puzzle | Pass | Tamari and the captain; the captain's cue list carries the timing so Tamari carries the room. |

**The named mistakes:** puzzles too hard (not tested with newcomers: **a rehearsal item**, fail until then); tedium (none); red herrings (none: every object is used); clue-to-gate ambiguity (one gate per room); escape-room logic (every lock has a reason in the mother's rules); flimsy builds and repeated lock types (four different mechanisms; build quality is the captain's); long monologues (the longest speech is the objective, nine sentences); "time's up" endings (the roll); partly available puzzles (none; one gate at a time); hidden caps and penalties (none).

### 11b. Immersive theatre, larp and asymmetric cooperation

| # | Rule | Verdict | Reason |
|---|---|---|---|
| 1 | Specify the audience's job | Pass | "Find where they went" with a lit socket at every step; "send them home" with a first move named. |
| 2 | Teach participation before raising its cost | Pass | The on-and-off at the binding, the cloth, the slate used in Remember's room before the finale needs it. |
| 3 | Give revelations an audience | Pass | Every reveal is at the table with the group seated. |
| 4 | Balance exchanges, not word counts | Pass on paper | Each finale window has a tell, a do, and a gather; the count is a rehearsal item. |
| 5 | A path through each restriction | Pass | Section 7.3's audit; no single-channel fact. |
| 6 | Separate fear peaks from interpretation | Pass | The objective is delivered under a low bed before the clock; the roll is after play ends. |
| 7 | Fiction enforceable by players | Pass | "When she calls your child by name and says what she wants, do that one thing with what you were given." |
| 8 | Give the performer controllable work | Pass | The captain's cue list automates the timeline; Tamari keeps readiness, hints, and the stop. |
| 9 | Progress and deadline independently readable | Pass | River lights and red sockets persist; her calls are the deadline. |
| 10 | Design defeat as an ending | Pass | The roll, the circle closed, the count, the letter still read. |
| 11 | Safety overrides the fiction in every role | Pass | Section 10; the silenced guest may always speak to stop. |

---

## 12. Captain calls, collected

Each with the default the design runs on. Numbers follow the synthesis's section 5 where the call is the same question; B-numbers are the story bible.

| # | Call | Default (the design runs on this) | Alternatives |
|---|---|---|---|
| 1 | Which direction | Resurrection, answered by the captain | — |
| 2 | Does the husband's reason unlock the win | **Told**, by the medium at the walk-out, from Josiah's unsent letter (B10) | A2: the message Remember carries is his note, so the truth is the content of the fourth act (this moves the game toward the sibling Rage design's win) |
| 3 | Run length and soundtrack | About 25:40 typical, caps at 29:40; soundtrack 6:30 from time zero | 7:00 with the last window at 2:30 if rehearsal shows the slate act needs it |
| 4 | Clock start | After the fourth curse and the objective; the fire's light and sound begin at the revelation | At the fourth token: every window would then need to be 2:25 longer |
| 5 | Three of four | A tiered ending with the count and the missed signs named, staged as the roll; not a win | A full win only; or three of four as a win |
| 6 | Reveal pacing | A place per room; the fourth completes "all in the house, nobody at the river", stated by the players | Roles only until the fourth |
| 7 | How each child died and how dark | By place only (B9); the darkest line is "the bulkhead door, which was barred"; screams in the fire are wordless, children's voices say only "Here, Mother" and the six pieces | Softer: drop "barred"; harder: the captain's taste |
| 8 | Cost of stalling in a room | Nothing but time; the bypass at 3:30 (4:00 in the hall) is the cost | — |
| 9 | Does anyone leave; what a taken guest does | Nobody leaves; a taken guest keeps every faculty they had and keeps helping; the taking is a beat and a tier | Removal |
| 10 | Informer and healer | Out | — |
| 11 | The mother: performer or voice; the captain's role | Recorded voice; the captain on cues and effects from a booth with sight of the table | A second performer as the mother (needs a third person) |
| 12 | Hub and spokes | Dining room; front hall, parlour window, kitchen wall, cellar door from the top of the stair | The house walk decides |
| 13 | First curse at the turn | Yes; the cloth is the tutorial instead | — |
| 14 | Assignment | By the medium, by consent, at the arrival minute | Chance |
| 15 | Names and year | Mercy Hale, Josiah Hale, 1778 (B1 to B4) | Thorne; 1777 |
| 16 | Betrayer | Enoch Thatcher, the neighbor (B6) | One of her own ring (would change the Waitstill slate's "riders at Thatcher's") |
| 17 | Séance effects, Ouija, fog | Raps (the knocker), the spirit slate, the board's lights, the mother's voice; no Ouija; haze for twenty seconds, no fog | More effects at cost; no haze |
| 18 | What the first group may tell the fifth; the walk-out length | Three things (stay together, ask her, the thing you were given is the thing you will need); walk-out 1:30 | — |
| 19 | Cost of turning a child's card | Nothing | Tied to a curse economy (not recommended; none exists) |
| 20 | Hearing: rule or real muffling | Passive muffs plus the rule; nothing audio-only | Real muffling (needs a proven emergency channel) |
| B1 to B10 | The story bible | Section 2's defaults | Section 2's alternatives |

Everything above is carried by the existing held task `halloween-2026-review` (section 15).

---

## 13. Simulation

**Where.** `sim/` beside this report is a copy of `data/hw-sim-engine/` with this design encoded; the original is untouched. `sim/engine.diff` is the full diff against the original (`config.py`, `engine.py`, `sim.py`, `test_engine.py`). `sim/finale_drive.py` plays the investigation with the bot and then drives the finale from a script; `sim/transcripts/*.finale` are the four scripts and `*.finale.txt` their transcripts.

**What was encoded** (every number is the design's, from sections 3 to 7; `config.py`'s last block lists them with the section each comes from):

- Opening 3:30; travel 10 s; rooms in a fixed order (the lights); one gate per room with the design's effort (140 s in the hall, 105 s elsewhere) and clue modality (the tube is heard, the rest read); the finder's tag 10 s in the room; the mother's line 30 s at each placement.
- The hint ladder: nudge at 1:30 of effort removing 40 percent of what is left, push at 2:30 removing half, bypass at 3:30 (4:00 in the hall) completing the gate; in the finale 0:20, 0:40, 1:00. Every hint has a seen form.
- The spirit slate: a relay from a silenced guest, or to a muffled one, succeeds when the sender has hands or voice (the medium scribes) and the receiver has eyes, at 20 s. The two "undefined" relay questions of the original engine are therefore answered by the design, not raised.
- The turn: 50 s of beats 0 to 3, four calls at 15 s each, the objective at 35 s under low sound, then time zero. The clock is 6:30 with takings at 1:30, 3:00, 4:30, 6:30 and a warning 30 s before each on both channels.
- The four acts: the cord (hands, 30 s, the gloved bearer tells), the lantern (eyes, 20 s, the blind bearer tells), the hearth (ears, 40 s, the muffled bearer tells), the slate (hands plus eyes plus voice, 30 s, worked by the Remember guest with another's voice, not before one 72-second cycle of the pieces). A taken child's act is gone; the run ends at the fourth child home (won if none taken, else lost with the tier) or at the fourth taking.

**Commands run and results** (from `sim/`):

```
python3 -m unittest test_engine            # Ran 17 tests ... OK
python3 sim.py bot --finale resurrection --seed 1
   == WON == ... at 23:01 with 3:25 of the soundtrack left; hints 4; undefined rules hit: none
python3 sim.py bot --finale resurrection --seed N --quiet   # N = 0..9
   won 21:26 to 24:12; fourth curse 17:46 to 20:32; hints 2 to 5; no undefined rule on any seed
python3 sim.py bot --finale resurrection --seed 0 --quiet --set "STEP_TIME_JITTER=(1.0,1.0)"   # won 22:27
python3 sim.py bot --finale resurrection --seed 0 --quiet --set "STEP_TIME_JITTER=(1.6,1.6)"   # won 25:15
python3 sim.py bot --finale resurrection --seed 0 --quiet --set "STEP_TIME_JITTER=(3.0,3.0)"   # won 29:31, 8 hints: every room to the bypass
python3 finale_drive.py transcripts/win.finale --seed 1        # won 22:51
python3 finale_drive.py transcripts/hesitant.finale --seed 1   # won 23:21
python3 finale_drive.py transcripts/loss3.finale --seed 1      # lost, tier 3 of 4, 23:46
python3 finale_drive.py transcripts/frozen.finale --seed 1     # lost, tier 0, 26:26
```

**The win, trimmed** (`transcripts/win.finale.txt`; clocks are the acting player's, `+` is time from time zero; what other players heard or saw is in the file):

```
# finale from time zero 19:56 (fourth curse at 19:56)
20:11 +0:15 deliverance relay remember   | deliverance tells remember what they know.
20:41 +0:45 remember    work             | Deliverance's scream leaves the fire. A bell.; sever_deliverance is solved.; The deliverance socket goes dark; a river light comes up. Deliverance is home.
20:46 +0:50 waitstill   relay mindwell     (the medium writes it on the slate for the muffled guest)
21:06 +1:10 mindwell    work             | sever_waitstill is solved.; The waitstill socket goes dark; a river light comes up. Waitstill is home.
21:21 +1:25 mindwell    relay deliverance
22:01 +2:05 deliverance work             | Mindwell's scream leaves the fire. A bell.; ... Mindwell is home.
22:21 +2:25 remember    relay deliverance | remember writes on the slate and shows it to deliverance.
22:51 +2:55 remember    work             | Remember's scream leaves the fire. A bell.; ... Remember is home.
== WON == You won because you sent all four home by their own signs before any scream reached its bearer, at 22:51 with 3:35 of the soundtrack left.
```

The muffled Mindwell guest got every beat in the `->` lines by sight (the sockets, the river lights, the slate); the blind Waitstill guest got every beat by ear (the screams, the bell, her calls) and never moved.

**The three-of-four loss, trimmed** (`transcripts/loss3.finale.txt`):

```
19:56 +0:00 deliverance work             !! nobody here who knows sever_deliverance can supply hands
20:16 +0:20 deliverance confer           | The players confer.
20:56 +1:00 remember    wait             | Deliverance's scream comes close. Her voice: 'Deliverance. Come.'; The deliverance socket pulses fast, red and white.
21:21 +1:25 deliverance relay remember   | deliverance tells remember what they know.
21:36 +1:40 remember    work             | Deliverance's scream stops. From the board: 'Here, Mother.'; The deliverance socket goes steady red. Deliverance is taken; the bearer sits still.; Too late: deliverance was taken while you worked.
22:01 +2:05 mindwell    work             | sever_waitstill is solved.; ... Waitstill is home.
22:56 +3:00 deliverance work             | Mindwell's scream leaves the fire. A bell.; ... Mindwell is home.
22:56 +3:00 deliverance work             !! sever_remember must be worked by remember (the slate: the silenced bearer orders the six pieces and points; another voice says it)
23:16 +3:20 remember    relay deliverance | remember writes on the slate and shows it to deliverance.
23:46 +3:50 remember    work             | Remember's scream leaves the fire. A bell.; ... Remember is home.
== LOST == You lost because nothing was left to send home at 23:46: the roll is called: 3 of four went home (waitstill, mindwell, remember); she keeps deliverance. Tier 3 of 4.
```

The refused `work` at 22:56 is the engine enforcing Remember's own act: the gloved guest, who did the first three doings in the playtest's bot, cannot do the fourth.

**The frozen loss** (`transcripts/frozen.finale.txt`): four takings at +1:30, +3:00, +4:30, +6:30, each with its heard and seen beat, then "the roll is called: 0 of four went home; she keeps deliverance, waitstill, mindwell, remember. Tier 0 of 4" at 26:26.

**What the engine refused, and what the design answered.** Nothing ended a run as undefined. Three refusals shaped the design rather than the engine:

- The original engine ended any relay from a silenced guest or to a muffled one as undefined. The design's slate (section 4) is the rule; it was encoded as the hands-or-voice-to-eyes path, and the one pair it cannot serve, the silenced guest telling the blind one, is a pair section 7.3 never needs. The engine's test for that pair is now a refusal, not an undefined.
- The original bot could not play an act that needs one named actor plus another's faculty (Remember's). The bot's finale planner was given the design's crew rule: the actor works it, a knower with the missing faculty is shown the slate first. That is the engine learning the design, not the design bending.
- The pieces gate: the last act cannot be said before one full cycle of the six pieces (72 s). The engine refuses it before then; no script hit it, since the fourth act never comes before the third child is home.

**What the engine still cannot see:** fumbling (a wrong pane, a mis-timed knock) costs no time in the model; the real margins are smaller than the table's by whatever a rehearsal measures. The finale's four-busy claim (section 7.4) is asserted, not simulated: the engine has one actor per act. Audio intelligibility, the hazer, and the human count of who receives, decides and sends are rehearsal items.

---

## 14. Ledger cross-check

Every open item in `hw-unknowns-ledger/report.md`, as designed here or marked as a captain call. Decided items are omitted.

| Ledger item | Status in this design |
|---|---|
| W3b, W4 captain's role, mother's embodiment | Call 11: recorded voice, captain on cues |
| W5 run length | Answered by the captain (30 cap); section 9 |
| W8 rooms | Call 12 |
| W9, W10 names, dates | B1 to B4 |
| W11, W12, W13 betrayer, Informer, healer | B6; calls 10, 16 |
| W14, W15 removal, spoke failure cost | Calls 9, 8 |
| W18, W19 Ouija, effects | Call 17 |
| W20 safety implementation | Section 10 |
| W21 darkness | Call 7, B9 |
| W22 costumes | Not addressed (captain's taste, blocks nothing here) |
| W23 Luma sign-up | Not addressed (captain's) |
| W26 what she knows | B8 and section 5's return lines: she believes they went together to the river until the fourth token |
| S2b folklore content | Section 2 |
| S3, S4 her ask and belief | Section 3.4 ("Find my children. I sent them to the river.") |
| S5b assignment | Call 14 |
| S6b curse objects | Section 3.3 and 6 |
| S7 the rule | Section 3.3, bounded form |
| S8 how she first manifests | One rap, then her voice (section 3.4) |
| S9 hub apparatus | The board (section 3.4, 7.2) |
| S10 opening test | The cloth (section 3.4) |
| S11 early blinding | Call 13: no |
| S12, S13 opening budget and script | Section 3 |
| A2b reveal pacing | Call 6 |
| A3b relics | The tokens (section 5) |
| A4 order | Birth order, B7 |
| A5 to A10 stall, hint, medium's place, budget, reset, pairs | Sections 4, 5; the medium walks with the group |
| A12b her lines per return | Section 5 |
| A13 deaths | B9, call 7 |
| The four spokes' standard nine | Section 5, each |
| T1b trigger mechanism | Reed switches under the sockets plus Tamari's hand (section 6) |
| T2, T4b, T6b, T7, T8, T9, T10 | Section 6 (sequence, effects, invocation wording and order, enforcement, fallback, minute mark 17:46 to 20:32, the medium as the guests' guide) |
| T11 what she believes at the turn | She learns they were all in the house; she does not yet blame Josiah (B10 is told later) |
| F1, F2, F3 the three sentences | Section 1 |
| F4, F5 soundtrack | Call 3; section 7.8 |
| F6b, F7 cooperation mechanism and props | Section 7.2 |
| F8a, F8b husband's truth | Call 2 |
| F9b the sentence | Section 1 |
| F11 losing members | Call 9: nobody leaves; the count varies by play, not chance |
| F12, F13 where; the mother's presence | The table; voice only |
| F15 Informer, healer | Out |
| F16 earlier endings | Superseded |
| F18 soundscape content | Call 7 |
| E1 to E10 | Section 8 (the card; two endings; the walk-out; her final state is "let me go" after the fourth child and "I keep what I have" otherwise, Josiah's spirit does not appear; the taken guest stays; reset; what to tell; the circle closed before anything comes off; the route from the chair) |

Not addressed: W22 costumes and W23 the sign-up, both the captain's and neither blocking a build.

---

## 15. Completion record

All captain calls in section 12 are carried by the existing held task `halloween-2026-review`; no new held task was created. The gate command and its output are below.

Run from the firstmate home on 2026-10-09; empty `diverged` output means no record divergence. The hold reason was extended with a pointer to section 12, keeping the previous reason unchanged.

```
$ bin/fm-captain-hold.sh hold halloween-2026-review --reason "<previous reason, unchanged> 2026-10-09 resurrection design data/hw-design-resurrection/report.md section 12 collects its 20 calls plus the story bible B1 to B10, each with the default it runs on; the design runs on the defaults and he can overrule any."
halloween-2026-review
exit=0
$ bin/fm-captain-hold.sh complete hw-design-resurrection halloween-2026-review
complete: hw-design-resurrection captain-call inventory reviewed (halloween-2026-review)
exit=0
$ bin/fm-captain-hold.sh verify hw-design-resurrection
verified: hw-design-resurrection captain-call inventory
exit=0
$ bin/fm-captain-hold.sh diverged
exit=0
```
