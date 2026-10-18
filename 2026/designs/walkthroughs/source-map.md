# Source and verification record

The handoff is authoritative. The two design reports provide the guest actions and dialogue. Only those three story sources were consulted; the separate synthesis, playtest, and research reports were not opened. Design appendices were checked for additional guest beats, rather than used as narrative material.

| Walkthrough material | Source |
|---|---|
| Family, spy network, betrayal, execution, mother's ignorance | [Handoff](/media/griswald/wd-black-2tb/personal/firstmate/data/halloween_escape_room_design_handoff.md:29) |
| Discovery, fire, curses | [Handoff](/media/griswald/wd-black-2tb/personal/firstmate/data/halloween_escape_room_design_handoff.md:107) |
| Rage cover, names, folklore and true history | [Rage design](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:9) |
| Rage arrival and sitting | [Opening](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:84) |
| Rage Deliverance | [Kitchen](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:175) |
| Rage Waitstill | [Window](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:231) |
| Rage Mindwell | [Listening place](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:303) |
| Rage Remember | [Nursery](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:367) |
| Rage returns | [Mother's return lines](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:431) |
| Rage turn and finale | [Turn](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:465), [four-part report](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:523) |
| Rage endings and departure | [Win](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:566), [loss](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:570), [exit](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-rage/report.md:613) |
| Resurrection cover, names, folklore and true history | [Resurrection design](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:11) |
| Resurrection arrival and sitting | [Opening](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:85) |
| Resurrection Deliverance, including return | [Front hall](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:175) |
| Resurrection Waitstill, including return | [Window](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:228) |
| Resurrection Mindwell, including return | [Kitchen wall](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:294) |
| Resurrection Remember, including return | [Cellar door](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:348) |
| Resurrection turn and finale | [Turn](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:420), [signs and message](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:479) |
| Resurrection endings and departure | [Win](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:540), [loss](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:546), [exit and letter](/media/griswald/wd-black-2tb/personal/firstmate/data/hw-design-resurrection/report.md:586) |

The failure vignettes use the explicit three-heard / three-home outcomes in the designs. They are alternative final scenes, not events following a victory. No guest names, new dialogue, new objects, or new story facts were added. The Resurrection gathering uses the design's general permission for any hearing guest to relay pieces to a hearing writer; Remember writes when free, and shows Mindwell the slate. This keeps the written hearing restriction intact.

The Gaps lists record source omissions and disagreements, without proposing new scenes or requiring a new choice. Names, room assignments, effects and endpoints follow the defaults already in the designs. No new captain call is introduced. Read the stories together before returning to the build reports.

The static pages copy the styling and three navigation links from the first forty lines of `.lavish/hw-rage/index.html`, and append two story links in the new pages only. Existing pages were not edited. The generator is `render.py` beside this record.

Commands used:

```text
uv venv .venv
uv pip install --python .venv/bin/python markdown
.venv/bin/python /media/griswald/wd-black-2tb/personal/firstmate/data/hw-story-walkthroughs/render.py
chrome-devtools-axi open file:///media/griswald/wd-black-2tb/personal/firstmate/.lavish/hw-walkthrough-rage/index.html
chrome-devtools-axi open file:///media/griswald/wd-black-2tb/personal/firstmate/.lavish/hw-walkthrough-resurrection/index.html
chrome-devtools-axi eval <DOM and style checks>
chrome-devtools-axi screenshot <saved render image>
chrome-devtools-axi closepage <verification tab id>
```

Both pages loaded completely, with twelve matching scene/Gaps headings, five navigation links, Georgia text, the reference background, and no horizontal overflow. Screenshots were saved beside this record. The print styles specify five page groups. At the configured Letter width and print styles, the rendered group heights were Rage: 651, 797, 774, 780, 812 pixels; Resurrection: 794, 764, 780, 920, 924 pixels. Each fits the available 950-pixel page area. These are browser layout checks, not a count from a generated PDF. The print styles use local fonts and no network assets. Verification tabs were closed; no Lavish session URL was opened.

Completion checks:

```text
FM_HOME=/media/griswald/wd-black-2tb/personal/firstmate bin/fm-captain-hold.sh complete hw-story-walkthroughs --none
complete: hw-story-walkthroughs captain-call inventory reviewed
FM_HOME=/media/griswald/wd-black-2tb/personal/firstmate bin/fm-captain-hold.sh verify hw-story-walkthroughs
verified: hw-story-walkthroughs captain-call inventory
git status --short
(no output)
```

Both walkthroughs have the same twelve scene/Gaps headings, both endings, and no build measurements, timing notation, prices, design-call markers, heavy bolding, or em dashes. The combined report reproduces the separate files with heading levels adjusted. No tracked worktree file changed.
