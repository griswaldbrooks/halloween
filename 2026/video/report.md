# Halloween 2026 narrated walkthrough

A **5 minute 23 second** illustrated, narrated walkthrough of one four-person group's experience, based on the captain's notes and **storyboard revision 06**. The sample reaches the finale with **two guests, including one who remains blind**. It depicts **ending A: ambiguous “hers.” The ending is still undecided.** All invented dialogue, exact outcomes, death wording and staging are labeled proposals.

## Watch

All files are preserved together in `/media/griswald/wd-black-2tb/personal/firstmate/data/halloween-video/`.

- **`index.html`** — self-contained offline viewing page, with the entire movie embedded, phone presentation mode, large live captions, nine chapter jumps, and the complete script. Open it in a browser; press Play. Phone presentation uses the same movie's audio and changing illustrated scenes. No server or internet connection is necessary. About 14 MB.
- **`walkthrough.mp4`** — standalone 1280×720 H.264 film, 12 frames/second, AAC stereo 48 kHz; 322.677 seconds; about 10 MB. Burned-in captions, animated drifting fog, candlelight and fades. Play it in a browser or normal video player.
- **`script.md`** — full scene-by-scene narrator, medium and ghost dialogue, stage directions, provenance, sample payment logic, and ending alternatives.
- **`captions.vtt`** — companion timed captions. These use proportional timing within each synthesized utterance, not word-level forced alignment.
- **`assets/mobile-review.png`** — phone QA capture. Original scene illustrations and film sample frames are also in `assets/`.
- **`PROGRESS.md`** — durable production checkpoints.

The temporary Lavish review URL was `http://127.0.0.1:4387/session/0e13b521c2d68aa5`. It is an overnight production check, not an unattended feedback promise; the session is ended by the agent after the completion gate. For morning review, open the standalone HTML or run `lavish-axi /media/griswald/wd-black-2tb/personal/firstmate/data/halloween-video/index.html` to start review again. Nothing has been uploaded or publicly shared.

## The depicted run

| Beat | Event and chosen payment | Guests remaining |
|---|---|---|
| Arrival | Ada, Ben, Cora, Dax; Cora receives healer, Dax secret Tory-spy overlay | 4 |
| Tutorial and honest ESP | Ada draws Veiled by chance. The symbol guess fails; Ben accepts deafening | 4 |
| Study | Dax gives one misleading suggestion. Wrong answer; Cora accepts silence and cures Ben's hearing | 4 |
| Hearth | The group submits the wrong number order; Ben chooses no hands | 4 |
| Touch | Startled wrong-shape submission; Dax volunteers as person-payment and is escorted out | 3 |
| Speech | Wrong phrase order; Ben volunteers as payment and receives his own exit ending | 2 |
| Direct contact | Innocent medium realizes the name register has been tracking them | 2 |
| False choice | Ada and Cora choose to open the inheritance; both choices complete the fictional bargain | 2 |
| Ending A | Ada hears and feels the entire reveal while blind. Play clearly ends before blindfold removal | 2 reached finale; all 4 claimed in fiction |

Every challenge still allows genuine success. Every cost menu still offers an offering, an eligible curse or a person. The illustrated group retains all four offerings because it mistakenly attaches them to the promised prize. That is sample guest behavior, not a rule or a way for the operator to force two removals. The count is contingent on honest chance, play and voluntary choices; no additional random death table was invented. Ada is not protected against sacrifice.

All four child deaths are learned and tied to sight, hearing, hands and speech. Specific incidents come from storyboard draft fiction, not a historical account or a final intensity decision. Mediums are innocent. The Ouija board is absent and explicitly deferred. Removed guests return to the party; they do not become antagonists. The film's two-survivor outcome is separate from its final fictional claim of everyone.

## How it was made

Entirely local: original Pillow procedural illustrations, moving fog and candlelight, Python/numpy/scipy synthesis of low wind, room resonance, glass-like tones and knocks, local Kokoro HTTP speech, and `/usr/bin/ffmpeg` encoding. No image-generation API, paid API, uploads, accounts or downloaded music/assets were used.

Voices: narrator `bm_george`, mother `af_nicole`, medium `bf_emma`, with `af_sky` for four processed “Mother” echoes. Light local echo processing is applied to ghost lines. Speech remains centered in the stereo mix.

Design source: the user-requested atmospheric period New England/spiritualist parlor, supported by the sibling storyboard's charcoal/dark-wood palette, warm paper/gold and serif typography. This is stylized procedural illustration, not photoreal animation or a proposed costume/floor-plan decision.

Reproduction files, all preserved here:

1. `python3 story.py` writes `scenes.json` and `script.md`.
2. `python3 build_audio.py` calls `http://127.0.0.1:8880/v1/audio/speech`, caching utterances in `audio/`, then writes `audio/mix.wav` and `timeline.json`. Requires the local Kokoro service for uncached speech only.
3. `python3 render.py` draws all stills, writes caption data/VTT, renders and encodes the movie.
4. `python3 build_page.py` embeds the movie, art, script and captions into the offline HTML.

The original authoring WAVs and mix are intentionally retained for future edits. Rendering needs Python3 with Pillow, numpy and scipy plus FFmpeg; viewing needs none of those tools.

## Evidence and verification

- Read authoritative decisions in `/media/griswald/wd-black-2tb/personal/firstmate/data/halloween-2026-notes.md:114` onward, especially variable survivors at 116–117, opening blindness at 119–120, required roles/curses at 121, honest test at 122, death mapping at 123, spy at 124, innocent mediums at 125 and deferrals at 126–127.
- Read live sibling `/home/griswald/.treehouse/halloween-ff9827/1/halloween/.lavish/halloween-2026/storyboard.html` and `/media/griswald/wd-black-2tb/personal/firstmate/data/halloween-storyboard/report.md`. Both had advanced to revision 06. Re-read/check before rendering and verified source hashes remained unchanged after render. `source-check.json` records the paths and SHA-256 hashes; storyboard hash: `ab2b2277db1a5c8e24a422ebce4bfca1223aa014f00509381f1840f8cf5f1973`.
- `script.md:3` labels the ending as undecided. `script.md:7` explains survivor terminology; `:9` explains optional payments and the sample's preserved offerings; `:11` records all curses/healer/spy constraints; `:13` specifies replacement/reshuffling and the correct 1-in-3,125 probability; `:16` preserves deferrals.
- `curl -s http://127.0.0.1:8880/v1/audio/voices` confirmed local availability of the selected voices; all 40 utterances were synthesized successfully and cached.
- `ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,channels -of json walkthrough.mp4` confirmed H.264, 1280×720, 12 fps, AAC stereo at 48 kHz, duration 322.677 seconds.
- `ffmpeg -v error -i walkthrough.mp4 -f null -` completed a full audio/video decode without errors.
- `ffmpeg -hide_banner -i walkthrough.mp4 -af volumedetect -vn -sn -dn -f null -` measured mean -23.2 dB and peak -3.8 dB; no clipping.
- Chrome via `chrome-devtools-axi`: opened the standalone `file:///.../index.html`, resized to 390×844, started embedded video, sought to 156 seconds and checked scene/caption updates. Returned `paused:false`, duration 322.677, `mediaError:null`, readyState 4, dimensions 1280×720, nine chapter buttons, no external `src` assets, and document width 390 at viewport width 390. Captured phone screenshot; inspected film stills with captions.
- Chrome logged one file-origin security warning while tooling the offline page. Actual embedded-media play/seek succeeded with no media error. No network dependency is required by the page.
- `git status --short` in the Halloween worktree was empty. No Halloween repository or sibling source changes; no commits, push or PR.

## Findings, recommendations and known gaps

The trap is understandable when the medium explains that seals bought passage into the family rather than freedom. Spoken names and the tactile token let a blind survivor receive the payoff. The two departures work narratively without prescribing who must survive.

**Payment economy needs a tabletop playtest.** With four offerings available, guests may prefer tokens over any curse or sacrifice. This film is a possible dramatic run, not proof that two departures are likely. Do not tune by secretly forcing failures or protecting Ada. Test fresh groups at 4, 2 and 1 survivors and preserve real successful outcomes.

Exact curse eligibility/expiry, healer tuning and person-payment incentives remain draft. The film shows voluntary person-payment even with offerings remaining. The captain still owns ending A/B/C, lure and séance-effect selection. Room/exit mapping, audience intensity and costumes remain deferred. The specific death descriptions may be too intense for some eventual audiences; the film does not decide that audience.

This 5:23 overview compresses a proposed 15–30 minute live experience. It is not a rehearsal, hardware validation, survival simulation or historical research. Detailed actor handoffs and private exit epilogues are in stage directions rather than fully played in real time. The video uses restrained atmospheric motion over illustrated stills, not full character animation. Caption timing is approximate within each spoken utterance. Phone layout was checked in desktop Chrome emulation, not a physical iPhone/Android device; full subjective listening by a human remains a morning review step.

## Shared completion inventory

Applied `/media/griswald/wd-black-2tb/personal/firstmate/.agents/skills/captain-hold-lifecycle/SKILL.md`. One consolidated captain-owned task, **`halloween-2026-review`**, carries ending, lure, costs/healer/death-wording tuning and effect selection, with references to this report and the sibling storyboard report. No answer or approval was fabricated; no deferred choice was turned into an overnight blocker. This task is the single review inventory for this deliverable.

Completion commands and final outcome are recorded below after final checks.

Final gate: `FM_HOME=/media/griswald/wd-black-2tb/personal/firstmate bin/fm-captain-hold.sh complete halloween-video halloween-2026-review` returned `complete: halloween-video captain-call inventory reviewed`. `verify halloween-video` returned `verified: halloween-video captain-call inventory`. Final MP4 decode and offline phone playback passed again after the final illustration crop and scene-outcome labeling. Lavish session ended by the agent; no unanswered feedback was received. Source revision 06 remained unchanged.

**done** — requested script, film, standalone viewing page and evidence report are complete; creative decisions remain explicitly unapproved in the shared captain review task.
