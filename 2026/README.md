# Halloween 2026 (shelved)

The 2026 plan was a séance game for the annual Halloween party: four guests at a time, Tamari as the live medium, and the ghost of a colonial mother looking for her four lost children. It started as voice notes, a storyboard and a narrated walkthrough video at the end of September. Over October it became a research-backed design with a text simulation and four playtested finales. Two of those were developed into complete designs, Rage and Resurrection, and Rage was picked and revised. On 2026-10-16 the captain and Tamari reworked the story into the Ashby family escape room, played at and around the séance table and out in the back yard. Its design record, the captain's rulings and two puzzle designs (Waitstill's lantern signal and Deliverance's backyard drop) are the last state of the work.

None of it was built. On 2026-10-18 the project was shelved for a possible later year, and this folder stores everything as it stood that day. If you are picking it up, start with the Ashby design record and the rulings. The rest shows how the design got there. The listening cup prop from the Ashby design continues as its own project and is not stored here.

The files are copied as they were written. The only changes are relative links fixed for the new folder names. Reports often name their original locations (`data/hw-...`); the table below maps those names to folders here.

## Contents

### Ashby escape room (final design, 2026-10-16 to 10-17)

| Folder | What it is | Original name |
| --- | --- | --- |
| [ashby/design-record/design-record.md](ashby/design-record/design-record.md) | **Design record of record.** The whole design as of 2026-10-17. Start here. | ashby-design-record |
| [ashby/design-record/decisions.md](ashby/design-record/decisions.md) | **Captain's rulings** on the record's open questions | ashby-design-record |
| [ashby/design-record/report.md](ashby/design-record/report.md) | Consolidation report the record was built from, with provenance | ashby-design-record |
| [ashby/backyard-puzzle/](ashby/backyard-puzzle/report.md) | Scene 4: Deliverance's drop in the back yard, map draft, cache, hint ladder | ashby-backyard-puzzle |
| [ashby/lantern-puzzle/](ashby/lantern-puzzle/report.md) | Scenes 2 to 3: Waitstill's lantern signal and the chest, plus the captain's revision | ashby-lantern-puzzle |
| [ashby/checkpoints/](ashby/checkpoints/) | ChatGPT design checkpoints 02 to 06 and the captain's 2026-10-16 dictation that started the Ashby rework. `halloween-2026-ashby-checkpoint-02.md` is an identical earlier copy of checkpoint 02. | (loose files) |

### The Rage and Resurrection designs (2026-10-09 to 10-10)

| Folder | What it is | Original name |
| --- | --- | --- |
| [designs/rage/](designs/rage/report.md) | Complete Rage design, with its simulation copy in `sim/` | hw-design-rage |
| [designs/resurrection/](designs/resurrection/report.md) | Complete Resurrection design, with its simulation copy in `sim/` | hw-design-resurrection |
| [designs/walkthroughs/](designs/walkthroughs/report.md) | Both designs told as a guest's evening | hw-story-walkthroughs |
| [designs/rage-rooms/](designs/rage-rooms/report.md) | Rage chosen; revised rooms and first-half walkthrough | hw-rage-rooms |
| [designs/rage-stakes/](designs/rage-stakes/report.md) | Rage finale stakes: why the guests act at the fire | hw-rage-stakes |

### Research and simulation (2026-10-01 to 10-10)

| Folder | What it is | Original name |
| --- | --- | --- |
| [research/escape-design/](research/escape-design/report.md) | How escape rooms and short puzzle games are designed | hw-research-escape-design |
| [research/immersive/](research/immersive/report.md) | Immersive theatre, horror, larp and co-op design | hw-research-immersive |
| [research/story/](research/story/report.md) | Storytelling research for four guests and a live medium | hw-story-research |
| [research/finale/](research/finale/report.md) | Finale and win/lose patterns | halloween-finale-research |
| [research/unknowns-ledger/](research/unknowns-ledger/report.md) | What was decided, proposed and open on 2026-10-08 | hw-unknowns-ledger |
| [research/synthesis/](research/synthesis/report.md) | Synthesis of the research and playtests for the captain | hw-synthesis |
| [sim/engine/](sim/engine/README.md) | Text simulation of the game (Python, stdlib only, with tests) | hw-sim-engine |
| [sim/playtests/](sim/playtests/) | Four played finales: loop, rescue, rage, resurrection | hw-play-* |
| [sim/game-sim/](sim/game-sim/report.md) | Playable browser simulation; the HTML is embedded at the end of the report | halloween-game-sim |

### Early notes and storyboard (2026-09-29 to 10-08)

| Folder | What it is | Original name |
| --- | --- | --- |
| [notes/halloween_escape_room_design_handoff.md](notes/halloween_escape_room_design_handoff.md) | Tamari and Griz's design handoff for the séance game | (loose file) |
| [notes/halloween-review-2026-10-06-log.md](notes/halloween-review-2026-10-06-log.md) | Storyboard review log, 2026-10-06 | (loose file) |
| [notes/board/](notes/board/index.html) | Working board page | halloween-board |
| [storyboard/](storyboard/report.md) | Storyboard (revision 07); the page and its build scripts are in `lavish/` | halloween-storyboard |
| [video/](video/report.md) | 5:23 narrated walkthrough (`walkthrough.mp4`), script, captions, audio and build scripts | halloween-video |
| [invite/](invite/) | Invitation artwork (cover and card backgrounds) | halloween-invite-print |

## Left out

The repository is public, so files that contain the home street address were not stored:

- `halloween-2026-notes.md`, the planning notes from the 2026-09-29 voice conversation onward
- `invite.html`, `invite-bw.html`, `invite.pdf` and `invite-bw.pdf`, the printable invitations

Also not stored: the firstmate worker briefs (`brief.md`), HTML renders of the reports (`report.html`) and Python bytecode caches. Large binaries (images, audio, video, and the 14 MB self-contained video page) are stored with Git LFS.
