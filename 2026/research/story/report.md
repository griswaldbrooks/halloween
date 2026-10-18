# Halloween 2026: storytelling research

Research date: 10 October 2026. Craft research for four guests, one live medium and a run of up to thirty minutes. The two endings remain options.

## Short answer: ten principles for this game

1. **Tell two connected stories.** The rooms reconstruct what happened to the family. The séance tells what happens when the mother and four living helpers discover it now. Each return must change her belief or intention, rather than deliver another historical paragraph. [S2](#s2), [S5](#s5)
2. **Give the guests a job before a genealogy.** Establish who they are, who needs help, and what they can do. Deliver the history as evidence they need for that job. Keep dates, surnames and the neighbor's identity outside the minimum story unless they change its interpretation. [S1](#s1), [S8](#s8)
3. **Make the hub accumulate meaning.** The same table first promises contact, then gathers evidence, then becomes the place of danger and resolution. The four excursions should make that familiar place feel different on every return. [S3](#s3)
4. **Protect essential story from competing work.** Place crucial speech where the group has a reason to attend. Leave texture in the rooms. A sound playing successfully does not prove that a busy guest heard its meaning. This applies synthesis §0a rules 12 and 23, and §0b rule 3. [S6](#s6), [S7](#s7)
5. **Use objects as evidence of people.** Each child's name, work, voice and existing object should point to a particular person. Let guests perform something that person did before asking them to mourn the death. Text works when its writer's purpose and personality survive the extraction of a clue. [S4](#s4), [S5](#s5), [S28](#s28)
6. **Script knowledge, then respond through the medium.** Fix the facts, reveal conditions and emotional direction. Let Tamari acknowledge what these guests actually say and do, then return to that spine. The designs' recorded mother needs compatible cues. Hope and denial can survive an early correct guess; false factual assurances cannot. [S10](#s10), [S11](#s11), [S13](#s13)
7. **Let a reveal answer an earned question.** Guests can infer the deaths; the mother can make their meaning immediate. Seed the fire, binding and supernatural limits before their payoff. A twist should reorganize existing evidence and remain intelligible afterwards. [S1](#s1), [S4](#s4)
8. **Make threat grow from the same attachment as sympathy.** The mother's desire for her children or justice should explain her turn. Show what she wants and what that want makes her do. Explanation need not mean approval, forgiveness or a demand for the guests' grief. [S5](#s5), [S24](#s24), [S27](#s27)
9. **Resolve a relationship and a condition.** The last action should visibly affect the children and mother. Then give the group a short release beat and a clear exit from the fiction. Put any fact that changes the meaning of their action before the action, rather than in a final explanatory letter. Synthesis §0a rules 26–29 already cover outcome mechanics. [S9](#s9), [S26](#s26)
10. **Test the story separately from completion.** Ask each fresh guest to explain what happened, why the mother changed, and what their final act accomplished. Record misunderstandings before explaining. A solved game with four different causal accounts needs a story revision. [S6](#s6)

## What I did

Read both baseline mechanics reports fully once: [escape-room research](../escape-design/report.md), 21 sources, and [immersive research](../immersive/report.md), 26 sources. Read [the authoritative story handoff](../../notes/halloween_escape_room_design_handoff.md), [synthesis §0](../synthesis/report.md), and sections 1–8 of [Rage](../../designs/rage/report.md) and [Resurrection](../../designs/resurrection/report.md). Story authority is handoff §§2–9, beginning at lines 29–229, and §§12 and 14, beginning at lines 322 and 381. Mechanics cross-references come from synthesis §0a, line 9, and §0b, line 80. Design observations below include section and line locations. The current brief leaves the ending choice open, regardless of either design's claims about earlier decisions.

Used native web search and opened actual articles, interviews, transcripts and publisher pages. Downloaded Nicholson's full paper and Worch and Smith's presentation notes, then extracted their PDFs with `pdftotext -layout`. Read the relevant narrative sections of Jenkins's essay and long interviews; read the main text of the shorter craft articles. The source entries identify the scope and limits. I did not read either requested book, watch the complete Brown broadcast, attend these productions, or conduct a guest test.

The catalogue contains 28 source texts, including several essays by the same practitioner. It does not represent 28 independent studies. Most evidence is named designers describing their own practice; the historical witness and scholarly essays supply different kinds of evidence. Production publicity is identified as such. Proposed timings and recommendations for this house are design judgments, not measured attention spans or guaranteed emotional effects.

This extends the baseline's Nicholson, Burns and Cooper material into inference, character, live response and resolution. It does not repeat hint systems, puzzle structure, asymmetric roles, safety or fail-state design. References such as “synthesis §0a rule 23” refer to the existing rule numbers in [hw-synthesis/report.md](../synthesis/report.md).

The worktree holds scratch research only. Existing reports, pages, storyboards, notes and game code remain unchanged. The static page uses the existing Rage page's cream background, Georgia body type, system headings and navigation. This project design source matches the pages the captain already reads. The new page adds its own navigation entry without editing the others and opens from disk without Lavish.

Reproducible preparation used `python3 .scout-story/fetch.py askwhy https://scottnicholson.com/pubs/askwhy.pdf` and the same downloader for Worch and Smith's linked PDF. Successful downloads produced readable extracted text; the scratch fetch log also records the failed guessed Short URL and Hall's direct-download 403. Native page access supplied the verified articles, as identified below. Rendering uses `uv venv .venv`, `uv pip install --python .venv/bin/python markdown` and `.venv/bin/python .scout-story/render.py`. These installed CPython 3.14.3's local environment and Markdown; no pandoc or Lavish command is used.

Validation: the report has 28 S-numbered source entries, all eight principle groups, both design analyses and nine captain calls. Local report links resolve and source anchors are unique. `chrome-devtools-axi open file:///media/griswald/wd-black-2tb/personal/firstmate/.lavish/hw-story-research/index.html` loaded the page. Browser inspection found no broken internal anchors or page-wide overflow; computed styling was the expected cream background and Georgia type. A screenshot confirmed the readable layout. The initial new-tab command returned a selection error after creating a blank tab; opening the report created its own tab successfully. Both task-created tabs were closed and the original Rage tab was restored. `git diff --stat` remained empty; only task scratch files were untracked. This verifies the artifact, not guest comprehension or emotional response.

Completion gate: ran `FM_HOME=/media/griswald/wd-black-2tb/personal/firstmate /media/griswald/wd-black-2tb/personal/firstmate/bin/fm-captain-hold.sh complete hw-story-research halloween-2026-review`. It returned `complete: hw-story-research captain-call inventory reviewed (halloween-2026-review)`. All nine calls remain with that existing review; none was answered or added as a new task.

## Sources

Each entry records authorship, credibility and concrete lessons. Links lead to the source text, not search results. Statements about this game's application appear later; a source's example is not proposed new lore.

<a id="s1"></a>
### S1. Scott Nicholson: Ask Why (2016)

[Full paper](https://scottnicholson.com/pubs/askwhy.pdf). Nicholson is a game-design professor and early escape-room researcher. Read the paper's main text, including the narrative sections beyond those summarized in the baseline.

- Story delivered as a prize after an unrelated puzzle differs from story expressed through the action itself.
- Initiation lets guests acquire the fictional world gradually.
- Nicholson, citing Evan Skolnick, says a surprise needs prior setup, plausibility and sense in hindsight.

<a id="s2"></a>
### S2. Henry Jenkins: Game Design as Narrative Architecture (2004)

[Essay, author's MIT archive](https://web.mit.edu/~21fms/People/henry3/games%26narrative.html). Jenkins is a media scholar; this is his foundational spatial-narrative argument. Read the environmental, enacted and embedded narrative passages, not the entire bibliography.

- An investigation has its own present chronology while reconstructing a different past chronology.
- Essential information needs redundant encounters because exploration can miss individual artifacts.
- Returning to a transformed space can make earlier events newly legible.

<a id="s3"></a>
### S3. Matthias Worch and Harvey Smith: What Happened Here? (GDC 2010)

[Presentation with speaker notes](https://www.worch.com/files/gdc/What_Happened_Here_Web_Notes.pdf). Two practicing game developers explain environmental storytelling through authored examples. Read the definition, interpretation, authored-event techniques and revisiting-space passages; this is not a transcript of the live Q&A.

- Arrange traces into a discernible chain of causes and effects.
- An ordinary object becomes significant through its relation to other objects.
- Interpreting a scene makes the player an active participant.
- Local incidents should echo the work's larger premise.
- Revisiting spaces and seeing lasting consequences makes the player's contribution visible.

<a id="s4"></a>
### S4. Emily Short: Mailbag: Environmental Storytelling (2019)

[Article](https://emshort.blog/2019/07/09/mailbag-environmental-storytelling/). Short is an interactive-fiction author and narrative designer, answering a concrete design question. Read the complete main answer.

- Start with the few events the player must understand, then identify their physical traces.
- Put important traces on the route or in required interactions.
- Show the event before its motive so the player has a reason to ask why.
- Documents can convey character through what the writer cares about, rather than transparently addressing the player's question.

<a id="s5"></a>
### S5. Richard Burns: Simple Plot, Complex Characters (2021)

[Room Escape Artist article](https://roomescapeartist.com/2021/09/02/escape-room-narrative-design-simple-plot-complex-characters/). Burns writes as a player and critic, explicitly not as a narrative designer; he develops Manda Whitney's RECON idea. Read the complete article.

- Arrival excitement competes with unfamiliar names and introductory detail.
- Repeating a character's activity can create sympathy.
- Bringing news to a character can be an emotional event in its own right.

<a id="s6"></a>
### S6. Matthew Stein: Playtest Your Story (2025)

[Room Escape Artist article](https://roomescapeartist.com/2025/06/22/playtest-your-story/). Stein is a puzzle designer and Enigmida creator writing explicit narrative-testing advice. Read the complete article.

- Players may scan for puzzle information and miss meaning; simultaneous audio also competes with solving.
- Test whether each guest can describe the main story in one or two sentences.
- Record repeated interpretations before repairing them through explanation.
- Emotional ambiguity is different from an unintelligible factual plot.

<a id="s7"></a>
### S7. HER Cooper: Bookends & Bottlenecks (2021)

[Immersology article](https://www.immersology.com/bookends-bottlenecks/). Cooper co-created and performs Strange Bird Immersive's séance escape room. Read the main escape-room discussion. This is practitioner advice, not an attention study.

- Essential story belongs where guests are available to receive it.
- A newly opened room attracts exploration before speech.
- Giving the next key too early competes with the current scene.
- Cooper recommends an on-clock narrative bottleneck of no more than two minutes.
- Off-clock bookends still occupy the audience's real time.

<a id="s8"></a>
### S8. HER Cooper: Bookends: Inciting Incidents in Escape Rooms (2022)

[Immersology article](https://www.immersology.com/bookends-inciting-incidents-in-escape-rooms/). A séance-room creator explains how an opening becomes an event. Read the complete main article.

- Let the inciting event happen to the guests rather than exist only in briefing history.
- Establish an initial situation before interrupting it.
- Give action an in-world reason beyond beating a score.
- Guests can remain themselves while an NPC carries an extensive past.
- Her examples span different production lengths; her own long opening is not a thirty-minute-game template.

<a id="s9"></a>
### S9. HER Cooper: Bookends: Fulfilling Finales (2022)

[Immersology article](https://www.immersology.com/bookends-fulfilling-finales/). The creator addresses emotional closure beyond the mechanical win already covered by the baseline. Read the main article.

- Pay off the experience's opening promise.
- Let a character the guests helped demonstrate the result.
- A final action can enact the reward instead of merely announce it.
- Allow emotional descent after the climax.
- A horror defeat can finish a story without repairing its world.

<a id="s10"></a>
### S10. HER Cooper: Superpower, Part 2: Improv and not Improv (2017)

[Immersology article](https://www.immersology.com/immersive-theatres-superpower-part-2/). First-person acting and directing account. Read the complete main article.

- Immersive acting combines a stable scenario with unpredictable audience behavior.
- Respond from the character's situation rather than try to invent a funny scene.
- Move naturally from script to response and back.
- Acknowledging a real occurrence makes guests feel that this performance includes them.

<a id="s11"></a>
### S11. HER Cooper: Superpower, Part 3: The Primacy of Text (2017)

[Immersology article](https://www.immersology.com/immersive-theatres-superpower-part-3/). A practicing immersive actor argues for verbal response. Read the main article; its separate casting controversy is not used as design authority here.

- Gesture can leave an important interaction ambiguous.
- Spoken acknowledgment can reconcile what actually happened with the fictional world.
- Clear language can redirect an audience quickly.
- A responsive script may need lines skipped or replaced before returning to its planned course.

<a id="s12"></a>
### S12. HER Cooper: Superpower, Part 4: Tales from The Man From Beyond (2017)

[Immersology article](https://www.immersology.com/immersive-theatres-superpower-part-4/). Concrete examples from her own séance production. Read the complete main article.

- An audience comment can return later as a character theme.
- Established metaphysical logic can bring wandering guests back into a scene.
- Character background is useful when it supplies a present response.
- Acknowledging unrelated real-world noise can prevent guests from treating it as a clue.
- The stable scene structure survives changes in wording.

<a id="s13"></a>
### S13. Alberto Denis, interviewed by Kent Bye: Responsive Interactive Narratives (2019)

[Voices of VR interview and transcript](https://voicesofvr.com/730-immersive-theater-acting-tips-for-responsive-interactive-narratives/). Denis was an original Then She Fell collaborator and describes hundreds of performances. Read the acting passages around 2:20–15:45. The transcript spells his surname “Dennis”; his professional credit is Denis.

- The production shapes the audience's perspective deliberately.
- Give meaningful contact across the audience rather than depend on a lottery of lucky encounters.
- Answer an unexpected reply through the character, then find the route back to the scene.
- Incorporating an error can sustain the world better than ignoring it.

<a id="s14"></a>
### S14. Felix Barrett, interviewed by Charlie Melcher: Behind the Mask with Punchdrunk

[Future of StoryTelling transcript](https://futureofstorytelling.org/case-study/felix-barrett-behind-the-mask-with-punchdrunk/). Punchdrunk's founder describes his own audience design. Read the environment, entry and audience-choice passages. Melcher discloses a company connection; this is not independent evaluation.

- Arrival gradually changes the audience's pace and sensory attention.
- Music, architecture and ordinary material can convey a world before explanation.
- Different visitors follow plot, peripheral detail or atmosphere.
- Retelling combines experiences no single visitor could see fully.
- His large promenade form tolerates incompleteness differently from a cooperative mission game.

<a id="s15"></a>
### S15. Tom Pearson: Then She Fell

[Creator's production account](https://tompearsonnyc.com/then-she-fell). Pearson co-directed the production. Read his main design statement, rather than relying on an operator listing.

- Choreographed routes can support intimate, individually framed encounters.
- Handling drawers, keys and simple service tasks puts guests inside the world.
- Gesture, objects, taste and architecture carry narrative together.
- Dream logic can privilege emotional association over a complete chronological explanation.

<a id="s16"></a>
### S16. Glen Neath and David Rosenberg, interviewed by Greg Stewart: DARKFIELD (2020)

[Theatre Weekly interview](https://theatreweekly.com/interview-glen-neath-and-david-rosenberg-on-darkfield-seance-flight-coma/). The writer and co-director explain their own audio work. Read the main interview.

- Begin with the audience's physical arrangement; SÉANCE begins with a circle.
- Imagined acoustic space must agree with the room the listener believes they occupy.
- Editing and listening can require narrative rewrites.
- Darkness affects individual audience members differently.
- The listener completes much of the event in imagination; binaural headphone results do not establish what room speakers can achieve.

<a id="s17"></a>
### S17. Glen Neath, interviewed by Constance Drugeot: Immersive Audio Experiences (2020)

[BroadwayWorld interview](https://www.broadwayworld.com/westend/article/BWW-Interview-Glen-Neath-Talks-Darkfields-Immersive-Audio-Experiences-20201020). First-person account from DARKFIELD's writer and co-founder. Read the form, duration and audience-observation passages.

- Touring acoustics can make an imagined event feel absent from the actual room.
- Fifty minutes in darkness frightened some audiences even when fear was not the original goal.
- Shorter container shows deliberately concentrate intensity.
- Writing around the guest's actual house changes the narrative form.
- Without seeing listeners, the maker loses direct evidence of their response.

<a id="s18"></a>
### S18. Leonard Pickel, interviewed by Jackie Sonnenberg (2018)

[Hauntrepreneur interview](https://medium.com/@sonnenbooks/q-a-with-hauntrepreneur-leonard-pickel-2460cb6b712d). Pickel founded HAuNTcon and designs haunted attractions professionally. Read the story, actor and audience-movement answers.

- Think of a haunt as scenes visitors walk through.
- Establish the place's history, the threatening force and a reason to enter.
- Derive rooms and inhabitants from that premise.
- Plan actor interactions around actual staffing.
- Guests can move very differently from the pace the designer imagines.

<a id="s19"></a>
### S19. Leonard Pickel, interviewed by Melissa Block for NPR (2017)

[Interview highlights, NHPR syndication](https://www.nhpr.org/2017-10-28/we-dont-want-to-mess-you-up-for-life-how-a-pro-makes-haunted-houses). Primary designer answers; Isabel Dobrin produced the web story. Read the complete short text.

- Pickel frames fear as startle and entertainment rather than lasting disturbance.
- A familiar domestic action can establish an audience expectation.
- His refrigerator example redirects attention from the expected hiding place to an unexpected appearance.
- A recognizable mundane detail briefly holds the guest before the scare.

<a id="s20"></a>
### S20. Charles Maurice Davies: An Indescribable Phenomenon (1875)

[Mystic London, chapter XXXII](https://www.victorianlondon.org/publications7/mystic-32.htm). A contemporary eyewitness describes Annie Eva Fay's public performance. Read the complete chapter. Davies is a skeptical, prejudiced Victorian observer; his proposed explanation is not proof of a method.

- A brief introduction, inspected objects and audience volunteers framed apparent manifestations.
- Repeated concealment and revelation established an observable rhythm.
- Sitters inside the dark circle had experiences the larger audience could only hear reported.
- Exclusion, disputed access and uncontrolled chatter damaged the second part.
- Darkness alone did not produce attention or belief.

<a id="s21"></a>
### S21. Alexandra Haley: Séance: A View Through the Veil (2021)

[National Science and Media Museum production account](https://blog.scienceandmediamuseum.org.uk/seance-a-view-through-the-veil/). Museum participant reports on Nik Taylor and Ashton Carter's AHRC-associated reconstruction. Read the main behind-the-scenes account. The planned live event became a film; it is not live-audience outcome evidence.

- The Victorian home séance combined domestic staging, objects and sensory cues.
- A medium led successive forms of contact involving the sitters.
- Sight, sound and technologies helped negotiate perception and trust.
- Flexible live wording became a difficulty when matching repeated film takes.
- Ambient gallery sound required attention during production.

<a id="s22"></a>
### S22. Derren Brown: Séance, official production record (2004 broadcast)

[Creator's show page](https://derrenbrown.co.uk/shows/seance/). Primary production description, limited publicity rather than a craft essay. Read the complete page; did not watch the broadcast. Its purported hospital history is part of the described framing, not verified local history.

- Historical framing and a specific location precede the contact ritual.
- The described experiment uses participating students, not merely spectators.
- Brown presents Victorian spiritualist techniques as methods for an entertainment experiment.

<a id="s23"></a>
### S23. Ian Thomas: Moment-based Story Design (2017)

[Nordic Larp / Knutepunkt essay](https://www.nordiclarp.org/2017/02/15/moment-based-story-design/). A larp and computer-game writer explains productions he helped make. Read the moment-planning, ghost-scene, player-created moment and conclusion passages.

- Select the experiences guests should later have a story about.
- Connect authored moments to evidence distributed through the world.
- A rule can seed an opportunity for guests to create a memorable incident.
- Combine fixed moments with participant-generated ones.
- His claims about memory are practitioner observation, not a measured retention rate.

<a id="s24"></a>
### S24. Anneli Friedner: The Emotional Core (2025)

[Nordic Larp essay](https://www.nordiclarp.org/2025/02/13/the-emotional-core/). A designer and player develops a framing tool from specific larp experiences. Read the main argument and conclusion.

- Activity alone does not supply something to care about.
- Content's heaviness and performance's emotional realism are different choices.
- Small relationships and everyday actions can carry strong feeling.
- Mismatched expectations about register can produce dissonance or discomfort.
- Design invites an emotion; it cannot prescribe what every player feels.

<a id="s25"></a>
### S25. Johan Dahlberg: High Resolution Larp Revisited (2019)

[Nordic Larp essay](https://www.nordiclarp.org/2019/08/28/high-resolution-larp-revisited/). A practitioner revisits Andie Nordgren's framework and the larp literature. Read the interaction, trust, steering and bleed discussion; this is interpretive theory rather than a controlled study.

- Shared interaction conventions reduce uncertainty about what an action means.
- Small gestures require common preparation to remain legible.
- Narrative steering can help players recognize an emotional stage.
- Trust supports intense fictional behavior.
- Character and player feelings can cross the fiction boundary, the phenomenon called bleed.

<a id="s26"></a>
### S26. Alfred Hitchcock: My Own Methods (1937)

[BFI / Sight and Sound archive](https://www.bfi.org.uk/sight-and-sound/features/alfred-hitchcock-my-own-methods). Primary director's craft essay. Read the complete main text. Translating camera techniques into a live performer's focus is this report's inference.

- Build contrast and preparation before a climax.
- Focus on a charged object to express a character's psychological state.
- A character's reaction directs the audience's interpretation.
- Returning to earlier images after a tragedy changes their significance.
- Subtle details can pass unnoticed; economy matters.

<a id="s27"></a>
### S27. Cindy Skawinski with Universal's haunt designers: Eternal Bloodlines (2024)

[Universal behind-the-scenes account](https://blog.discoveruniversal.com/behind-the-scenes/behind-the-screams-universal-monsters-eternal-bloodlines-at-halloween-horror-nights-2024/). Direct quotations from John Murdy, Lora Sauls and Kelly Malik on their own house. Read the main account. Employer publicity supplies design intent, not proof guests understood the story.

- An injury witnessed in the house motivates a new alliance.
- Shared revenge can explain cooperation without making characters friends.
- Each character's distinct agency guides the portrayal.
- Familiar material receives a new causal connection, rather than only a new costume.
- Music is designed to support the emotional journey.

<a id="s28"></a>
### S28. Laura E. Hall: Ephemera-Based Storytelling at Now Play This (2017)

[Creator's account](https://lauraehall.medium.com/ephemera-based-storytelling-at-now-play-this-games-exhibition-in-london-db174c3af697). Hall designed The Silence in Room 1258 and co-founded an escape-room company. Read the complete main article through native web access; direct download returned 403. This is accessible primary work, not a substitute claim to have read her 2021 book.

- Material treatment and provenance of paper can suggest a character's attitudes.
- Everyday objects acquire significance through narrative context.
- Interpretation can be the play in a self-paced work without a fixed winning answer.
- Puzzle expectations must agree with what the work actually permits.
- Too much material can imply agency or resolution the experience does not provide.

## Principles

These rules translate the sources into this house's format. They are recommendations for telling the existing story. They do not add history, characters, puzzles or supernatural powers.

### 1. Structure a story that people walk through

Map changes in understanding onto the route. A room is a location; a beat is a change. Pickel's scene-based haunt model informs this translation. [S18](#s18) Our sequence is invitation and first contact; accumulating evidence; confirmation of the deaths; the mother's changed intention and fire; the guests' consequential response; release. Four rooms need not mean four independent plots. Keep one family history and one present crisis comprehensible throughout.

Treat each threshold as a change of purpose. Going out means investigating a particular child's unfinished work. Coming back means reporting to someone who cares about the answer. The return should resolve a local question and disturb the mother's remaining explanation. Progress can be emotional even when the group already suspects the factual answer. Distinct voices and evidence make the repeated route cumulative. [S5](#s5), [S23](#s23)

Keep two timelines legible: the family's past and the guests' encounter now. Separate the execution from the children's fire, then show how discovery causes present action. The familiar hub can carry rising action through changed interpretation. [S2](#s2), [S3](#s3)

No source establishes a universal number of seconds that a task-free beat will hold four party guests. Cooper's two-minute ceiling for an on-clock bottleneck is practitioner advice, not permission to insert two minutes after every room. A scene containing ritual action, response and silence also differs from two minutes of continuous exposition. Read the actual words aloud and include guest replies and transitions in the run budget. [S7](#s7)

For scale, our arithmetic could reserve 3 minutes for entry, 15 for investigation and returns, 2 for the turn, 7 for the finale, 2 for release and 1 for slack: 30 total. This is an illustration, not a new timing plan. Both designs already model worst cases near 29:30. Additional speeches must replace other speech, fit existing pauses or be omitted. Thirty minutes can plausibly carry four distinct children within one causal chain; it is a poor place to require a genealogy, political history, several secret identities and an independent explanation for every prop. That capacity judgment needs a fresh-group test.

### 2. Deliver story while guests are active

Give each medium a job. This comparison applies the sources to the existing material; it is not a ranking of art forms. [S3](#s3), [S4](#s4), [S15](#s15), [S16](#s16), [S28](#s28)

| Delivery | Best use here | What to verify |
|---|---|---|
| Environment and objects | Show where a child worked, hid or left something; establish relationships between traces. | A guest can distinguish evidence from decoration and infer something specific. |
| Live medium | Frame the current question, acknowledge a discovery, connect it to the mother's changing state. | Her account respects what she knows and includes the group that is actually present. |
| Found text | Supply a precise fact, a person's priorities or words the finale needs. | Guests understand the meaning beyond extracting marked words or a code. |
| Recorded voice or audio | Give a child presence; make the mother or fire feel immediate. | The important words remain intelligible in the actual room during the actual activity. |

Use a minimum story and optional detail. Every guest needs the family's predicament, the mother's mistaken belief, the change at the fire and the meaning of the final action. Proposed surnames, dates and the neighbor's name can enrich the world without becoming a comprehension requirement. Essential information should survive one missed artifact; evidence followed by an understandable reaction is one option for reinforcement. This applies Jenkins's redundancy principle, not a measured requirement for exactly two repetitions. [S2](#s2), [S6](#s6)

Show a trace, let guests investigate or repeat the associated act, then clarify its consequence where needed. Do not turn “show, don't tell” into a ban on speech or letters. A report can be dramatic when delivering it changes a person. A letter can reveal its writer through what they avoid saying. Its physical treatment can suggest how it was kept or valued. [S4](#s4), [S5](#s5), [S28](#s28)

Attention management is already synthesis §0a rules 12 and 23 and §0b rule 3. The story question is whether the meaning arrived, not whether a cue fired. Room entry, excited cross-talk and urgent handling of evidence are poor assumptions for guaranteed listening. DARKFIELD's controlled headphone space demonstrates why the acoustic fiction must fit the listening arrangement; it does not validate simultaneous speech over this house's speakers. [S7](#s7), [S16](#s16), [S17](#s17)

Adapt Stein's method with fresh guests: ask each for a short account, what changed the mother's mind and what their final act did. Record the evidence they recall before explaining. Compare roles and outcomes. This research produced no retention percentage or playtest result. [S6](#s6)

### 3. Give the live medium a narrative spine

Prepare a knowledge ledger beside the script: what the medium believes from folklore; what the mother believes; what each return establishes; what remains unknown; what intention changes at the turn. Ritual knowledge and family-history knowledge are different. The medium can know how the circle works while needing the guests to discover what happened. This is our application of responsive performance to the handoff's two incomplete witnesses. [S10](#s10), [S12](#s12), [S13](#s13)

Fix each scene's entry condition, necessary fact, emotional direction and exit cue. Allow short acknowledgment of a guest's real answer before returning to those requirements. Prepare responses for an early correct inference, disagreement, joking and a late return. An early death theory need not cancel the fourth-room confirmation: the medium can recognize the evidence while the mother struggles with its implications. Never require Tamari to pretend nobody said it. [S10](#s10), [S11](#s11), [S13](#s13)

Both designs separate Tamari's live medium from a recorded mother. Live-response advice belongs first to Tamari. Audit the recordings for factual contradictions and allow her framing to make the intended progression clear; do not assume a fixed recording can improvise. When the group is slow, a shorter acknowledgment can preserve the essential change. When it is out of order, identify the evidence actually established rather than invent a missing discovery. Actor workload and hint delivery remain synthesis §0a rule 19 and §0b rule 8.

The séance tradition contributes a grammar: a framed gathering, shared objects, successive forms of contact, concealment, manifestation and witness response. Davies's public performance account also shows how unequal access and chatter can undo the dark circle. The museum reconstruction supplies domestic ritual detail; Brown's page establishes modern entertainment framing, but cannot substantiate the broadcast's complete pacing. These sources concern performance, not proof about spirits or an account of every Spiritualist practice. [S20](#s20), [S21](#s21), [S22](#s22)

Translate that grammar into clear vocal contrast and shared attention. Establish the medium's ordinary register before the contact; distinguish living guidance from the recorded mother's address; leave room for a manifestation to be noticed before interpreting it. Darkness should heighten a comprehensible event rather than replace one. Do not copy historical volunteer humiliation or use guests' actual bereavements as fictional evidence. The party register remains a captain call. [S16](#s16), [S20](#s20), [S21](#s21), [S25](#s25)

### 4. Design fair reveals and the fire turn

Separate three questions. Who are the guests now? What happened to the family? What must the guests do after the mother changes? Answer the first early enough for participation. Let the second develop from evidence. State the third clearly when its purpose becomes necessary. Withholding the guests' basic role creates confusion before it creates mystery. The handoff supplies living helpers bound to the children; no further identity twist is needed. [S1](#s1), [S8](#s8)

An inferred reveal gives guests the connection to make. A performed reveal gives that connection immediate consequence through a character's response. Use both: the group can work out the deaths; the mother's recognition can trigger the fire. Four objects found inside do not alone prove four deaths if an escape remains possible. The existing locations, ash, testimony and failed report must support the conclusion the production asks them to draw. [S3](#s3), [S4](#s4)

Audit twists backwards: identify supporting traces and any earlier statement made false. Distinguish folklore, hope and authoritative instruction. Seed supernatural limits before success depends on them. This extends Nicholson's surprise discussion and synthesis §0a rule 7. [S1](#s1)

Stage the fire as a change in the meaning of a known place. The table and relics that gathered hope now confront the group with danger. Preparation, a perceptible change and the mother's reaction can connect spectacle to cause. Film's control of focus is not available here, but the medium's attention to a known object can perform a related function. This is a live adaptation of Hitchcock's craft account, alongside the environmental sources. [S3](#s3), [S26](#s26)

The reversal from contact or rescue to threat fits these horror forms; sources offer craft examples, not a law requiring a fire or a late twist. Here the fire is settled. Its job is to expose the mother's changed intention, not simply announce a harder round. Synthesis §0a rule 24 already requires revelation to change play. The story must make that change understandable, including why this threat follows this discovery.

### 5. Give the children and mother distinct character

Use the existing four names, work roles, faculties, objects and voices consistently. Deliverance carried, Waitstill watched, Mindwell listened and Remember remembered and spoke. Let those differences show competence and responsibility before they become evidence of death. Repeating a child's useful act offers a relationship through action; four interchangeable accounts of suffering offer much less to distinguish. This translates character-through-activity and object interpretation to the handoff, without adding keepsakes or biographies. [S5](#s5), [S15](#s15), [S28](#s28)

Give the mother a continuous want. Hope, anger, menace and release should be different expressions or revisions of that want. Guests should recognize the person who asked for help inside the figure who now threatens harm. Universal's designers describe alliances motivated by witnessed injury and distinct character agency; the useful lesson here is a visible cause for changed behavior, not their particular monsters. [S27](#s27)

The father's coercion can explain his act without settling its morality. Distinguish what he intended, what he did and what resulted. A discovery that his bargain failed can change the mother's understanding without requiring guests to forgive him. This is an interpretation of the handoff's facts, not a research finding that reconciliation is the correct ending. The degree of forgiveness belongs in Captain's story calls.

Invite care through an understandable relationship and a useful task. Do not measure success by visible sadness. A participant can care about protecting the group, finishing the children's work or stopping further harm while feeling little grief. Larp writing supports distinguishing heavy subject matter from emotionally realistic enactment; it does not show that a neighborhood party will welcome prolonged child-death scenes. The default register and intensity are captain calls. [S24](#s24), [S25](#s25)

### 6. Write endings as consequences and release

For each outcome, write what changed for the children, the mother and the guests, then identify how the group perceives it. Existing outcome tiers belong to synthesis §0a rules 27–29 and §0b rule 10. Their story should express which bond was released or which intention prevailed, rather than announce only a total. The relationship begun at contact should receive an answer in the final scene. [S8](#s8), [S9](#s9)

After the last action, allow one clear response and a brief descent. Return to a previously meaningful voice or object under its changed circumstances. Relief, silence or continuing menace can each finish a horror story; none requires a new history lecture. This connects Cooper's closure to Hitchcock's use of earlier images with changed significance. The scale must fit the existing exit allocation. [S9](#s9), [S26](#s26)

The walk-out line has three functions: state the consequence in this outcome, close the circle and restore the guests' ordinary relationship with the host. It need not explain every artifact. A losing ending can leave fictional trouble unresolved while making the real exit legible. A new fact that would have changed the guests' judgment belongs before their consequential act. Handoff §12 makes that requirement explicit for the father's motive; this is a story obligation, not an optional epilogue flourish.

Plan what guests can retell: what they discovered, what the mother did and what they did in response. Thomas's memorable-moment approach is useful for that design target, not a promise of recall. A souvenir can recall the encounter; printing the protected answer while asking guests to keep it secret sends mixed instructions. Optional explanation and research questions can follow the fictional closure. A public debrief should invite an account rather than correct every personal interpretation. [S23](#s23), [S6](#s6)

### 7. Set the house-party register at the door

The arrival is part of the story. Let an ordinary welcome become a deliberate invitation to the séance, then let the first contact establish its seriousness. Punchdrunk's extended threshold shows the value of changing attention gradually, but its fifteen-minute arrival cannot be imported into this run. Pickel's entertainment framing also differs from an ambition to disturb guests indefinitely. [S14](#s14), [S19](#s19)

Communicate the intended register and the presence of fictional child deaths and family betrayal before entry, without supplying the solution or every plot detail. Synthesis §0b rule 11 and §0a rule 10 already cover consent and the participation contract. The additional story question is whether guests expect theatrical ghost horror, playful spookiness or realistic grief. A mismatch can make an intended moving scene feel absurd or unwelcome. [S24](#s24), [S25](#s25)

Offer the role of living helpers without demanding a personal grief disclosure or an invented family identification. Friends and strangers need a shared convention; they do not arrive with a rehearsed ensemble's trust. Clear, readable performance is a better default than making tiny gestures carry the only evidence of a major turn. The actor's fictional anger must remain recognizable as part of the encounter. [S13](#s13), [S25](#s25)

These sources do not determine how dark this party should be. Choices about warmth, laughter, menace, child voices and the final emotional color appear only under Captain's story calls below. Guests laughing, concentrating silently or treating the story as a rescue problem are responses to design around, not proof that they failed to feel correctly.

### 8. Avoid the storytelling failures practitioners name

| Failure | Why it fails | Revision to consider |
|---|---|---|
| Genealogy before a purpose | Arrival anticipation competes with unfamiliar detail. | Keep the opening's job legible; distribute optional history. [S5](#s5), [S8](#s8) |
| A letter that exists only to hide a code | Solving can bypass its meaning entirely. | Give its writer an intelligible concern and its fact a present consequence. [S4](#s4), [S28](#s28) |
| Audio counted as delivered because it played | Active solving can mask the scene. | Check comprehension in the real activity; apply synthesis §0a rules 12 and 23. [S6](#s6), [S17](#s17) |
| Four returns with no change | Movement repeats while the relationship stays still. | Record what belief each return removes or changes. [S23](#s23) |
| History awarded after unrelated action | Story becomes a detachable reward. | Apply synthesis §0a rule 24; make the discovered meaning matter. [S1](#s1) |
| A supernatural law introduced only to enable the ending | Guests cannot reinterpret earlier evidence fairly. | Seed the law in existing preparation; apply synthesis §0a rules 7 and 10. [S1](#s1), [S12](#s12) |
| A script that ignores an early correct answer | The character appears absent from the actual encounter. | Acknowledge it and preserve the scene's necessary consequence. [S10](#s10), [S11](#s11) |
| A menace whose actions contradict its goal | Guests cannot tell which intention explains the scene. | Establish the character's reason or limit rather than cover it with atmosphere. [S18](#s18), [S27](#s27) |
| A finale that explains a missing causal fact | The experience depends on its commentary to make sense. | Put necessary understanding inside the experience before the final judgment. [S6](#s6), [S9](#s9) |
| More suffering used as a substitute for character | Heavy content does not guarantee care. | Give each person a recognizable activity, relationship and intention. [S15](#s15), [S24](#s24) |
| Elaborate paper history suggesting unavailable choices | Guests pursue agency the work cannot honor. | Keep the material's invitation consistent with the experience. [S28](#s28) |

These are distinct from the mechanics review. Contradictory rules, performer workload, attention at reveals and lose-state handling should use the synthesis rules already cited, not another competing specification here.

## What this means for our game

The [handoff](../../notes/halloween_escape_room_design_handoff.md) controls the history: four children with distinct work, the father's coerced condemnation, the failed bargain, the children's fire, the mother's execution, incomplete folklore and the mother discovering the truth with the guests. Its §§5–9 settle the repeated returns, fourth revelation, fire, curses and accumulated relics. Its §12, beginning at line 322, rejects revealing the father's motive only in a post-game speech. Proposed proper names and dates in either design remain proposals. The current brief leaves Rage versus Resurrection open.

The observations below cover each design's §§1–8. Options change emphasis, placement, framing or wording within the settled structure. They do not change puzzle answers, hint tiers, room order, curses, timers or outcome mechanics.

### Rage: strong testimony structure, but the opening and late recognition fight it

1. **The premise gives the evidence a present use.** [§1, line 9](../../designs/rage/report.md) and [§7, line 505](../../designs/rage/report.md) make the children's undelivered report the means of addressing the mother's judgment. This connects investigation to consequence. The evidence is strongest when guests understand why saying it changes her view, not merely which four lines earn credit. Option: keep the explanation of that purpose in the turn and let her final response confirm the difference their testimony made. [S1](#s1), [S11](#s11)

2. **The opening discloses the fact the fourth room is meant to reveal.** [§2, line 48](../../designs/rage/report.md) and [§3, line 84](../../designs/rage/report.md) call the wife and children lost in the fire. [§5.6, line 450](../../designs/rage/report.md) then treats the children's deaths as the inference that breaks the mother. Guests told that fact at entry may experience confirmation for her, but no discovery for themselves. Option: use the handoff's incomplete folklore and keep the children's fate open; alternatively acknowledge that the reveal belongs to the mother and frame the guests as confirming a suspicion. The latter changes emphasis and needs captain review if it changes the intended mystery. Label hearsay so the different cause of the mother's death remains fair. [S4](#s4), [S8](#s8)

3. **The child scenes provide useful individuality.** [§5.1–5.4, lines 175, 231, 303 and 367](../../designs/rage/report.md) connect work, evidence and voice: courier, lookout, listener and memorizer. Their final contributions also differ. That gives four people within one family rather than four equivalent victims. Option: retain those specific acts and make each return identify whose act the group just encountered and what it means to the mother. Do not make an essential character fact depend solely on hearing a room recording while solving. [S15](#s15), [S17](#s17)

4. **The return progression is a strong emotional spine.** [§5.5, line 431](../../designs/rage/report.md) reduces the mother's hopeful explanations with each relic. Its recorded lines need to tolerate guests who infer death early. [§4, line 133](../../designs/rage/report.md), the hint channel, also needs a knowledge audit against that progression. Option: have Tamari acknowledge the evidence without requiring the recording to deny an already established fact. Preserve the stated distinction between what the mother can receive through the circle and what she cannot; the finale's spoken report must read as a valid continuation of that convention. This is a story-consistency check, not a replacement hint design. [S10](#s10), [S12](#s12)

5. **The father's seal creates a timing question.** The paper is present from [§5.1](../../designs/rage/report.md), but recognition of its significance arrives at [§6, line 465](../../designs/rage/report.md). Why can it provoke the mother only now? A script that simply delays an obvious connection can feel managed. Option: distinguish seeing the seal from understanding its relationship to the deaths, using the evidence already accumulated. Audit the guests' ability to explain why the discovery produces this turn at this time. [S3](#s3), [S23](#s23)

6. **The fire has a new target that needs a clear causal bridge.** [§6](../../designs/rage/report.md) turns maternal grief into vengeance against the father. The guests must understand how the current haunting threatens him and why the report can stop it. Option: use the existing turn speech to connect recognition, intention and remedy, cutting recap that does not serve those three facts. The production should not rely on the designer's objective paragraph being available to guests. No extra supernatural power is proposed here. [S18](#s18), [S27](#s27)

7. **The win may settle a moral question more completely than intended.** [§7.5, line 566](../../designs/rage/report.md) pairs the parents' acknowledgments of ignorance; [§8, line 613](../../designs/rage/report.md) declares their rest. This can communicate discovery and release, but may also read as immediate forgiveness of the father's condemnation. Option: distinguish cessation of vengeance from moral absolution in the confirmation. How explicitly to reconcile them is a captain call. Also check §7.7's row describing four lines on the slate with the speaker cut off: its account of what was heard must agree with the other outcomes. This flags a narrative contradiction rather than selecting a scoring fix. [S9](#s9), [S11](#s11)

8. **The exit has closure, but the explanation can overtake it.** [§8](../../designs/rage/report.md) returns to the children's names and candles, which can make the outcome perceptible. The missing-line explanation after loss and the sealed report risk turning release into an answer review. Option: keep the in-world consequence and circle closure first; make detailed explanation optional afterwards. Check the takeaway against the request to keep finale words private. The design already allocates an exit beat; extra explanation has no free time in the near-30-minute model. [S26](#s26), [S6](#s6)

### Resurrection: strong action and spatial memory, but necessary truth arrives too late

1. **The opening preserves an honest investigation.** [§§2–3, lines 51 and 85](../../designs/resurrection/report.md) leave the children hidden or unaccounted for while the medium knows the mother's execution. This better matches the handoff's incomplete folklore. Its long opening also rehearses participation rather than supplying only history. Option: keep the guests' job prominent and measure the whole spoken opening with actual responses, including its ritual action. [§1, line 11](../../designs/resurrection/report.md) already has little worst-case slack. Cooper's much longer premium opening is not evidence that this one can expand. [S7](#s7), [S8](#s8)

2. **Previously performed acts return with new significance.** [§5, line 164](../../designs/resurrection/report.md) establishes the children's work; [§7, line 455](../../designs/resurrection/report.md) makes the learned acts signs of release. That is a strong way to connect past and present. Option: make the returns consistently connect the action to its child and the mother's attachment, so the finale recalls a person as well as a procedure. Keep the hint voice in [§4, line 142](../../designs/resurrection/report.md) within the same knowledge and motive boundaries. [S15](#s15), [S23](#s23)

3. **The fourth return offers an inference, but its evidence needs precision.** [§5.4, line 348](../../designs/resurrection/report.md) collects locations at door, window, wall and cellar; finder tags place tokens in ash. That is stronger than simply saying four objects mean four deaths. The inference still depends on guests understanding why the traces rule out escape. Option: let Tamari draw attention to the existing location and provenance evidence before the mother's reaction, without replacing the guests' connection with a full explanatory speech. Preserve her denial as hope rather than a reliable counterfact. [S3](#s3), [S4](#s4)

4. **A decisive law first appears at the turn.** [§2, line 72](../../designs/resurrection/report.md) and [§6, line 420](../../designs/resurrection/report.md) specify that the signs outrank even the mother's voice; the guest-facing explanation first comes at that turn. This is a fairness problem when the final solution depends on distinguishing command from sign. Option: establish that convention during the existing participation rehearsal, then use the turn to reveal its significance. Clarify whether language about living through the war describes the family's method or actual survival, since all four children died. Apply synthesis §0a rules 7 and 10. [S1](#s1), [S12](#s12)

5. **The threat is personal and motivated, but helping behavior can contradict it.** [§6](../../designs/resurrection/report.md) makes the mother seek living vessels. [§7.5, line 536](../../designs/resurrection/report.md) then gives her hints that help free a child she is trying to possess. Option: audit each hint's attributed speaker, knowledge and immediate intention. The explanation must follow existing character logic; do not quietly introduce another spirit or a new power to excuse it. A menace can be conflicted, but the performance must make that conflict legible. [S18](#s18), [S27](#s27)

6. **The final act changes a relationship, but its interpretation is fragile.** [§7.6, line 540](../../designs/resurrection/report.md) makes the mother's letting go follow what the guests demonstrate. Her statement that the children heard her and stayed may sound like blame unless their inability to escape is clear. “Home” and the river imagery also need to mean release of the dead rather than literal survival or physical escape. Option: clarify those meanings through the existing confirmation, without adding a destination or changing the final act. Whether her last response is relieved, sorrowful or threatening is a captain call. [S11](#s11), [S24](#s24)

7. **The father's motive is withheld beyond the consequential action.** [§2 B10, line 66](../../designs/resurrection/report.md) explicitly marks the letter as told after play; [§8, line 588](../../designs/resurrection/report.md) places it at the walk-out. This directly breaks handoff §12, even if the possession plot can otherwise be followed. Option: convey the already-authorized motive through existing evidence and return or turn framing before the final act, using available speech time. Leave only supplementary detail for the exit. That is a placement option, not a new letter puzzle. [S4](#s4), [S9](#s9)

8. **The exit respects outcomes but carries too much essential explanation.** [§7.7, line 546](../../designs/resurrection/report.md) names who remains taken and provides release; [§8, line 586](../../designs/resurrection/report.md) adds sign explanations and the father letter. Guests may still have restricted hearing or sight during that account. Option: finish the fictional consequence and established release before optional explanation. Check whether the signed takeaway discloses signs that the secrecy request protects. The six audio pieces in §7's urgent final work also need a comprehension check, not merely a playback check. [S17](#s17), [S21](#s21), [S6](#s6)

Across both designs, the most useful next story test is a fresh group's account before any explanatory debrief. Compare the account to the causal spine, including the father's bargain. A compelling performance with an unclear causal account needs clearer delivery; it does not automatically need more lore or a redesigned puzzle.

## Captain's story calls

These are unresolved taste, darkness and tone choices, plus the existing ending choice. Recommended defaults are proposals. The existing captain review task `halloween-2026-review` carries this complete set; this report creates no new decision task and records no captain answer.

| Call | Options | Recommended default |
|---|---|---|
| Ending emphasis | Rage: testimony interrupts vengeance and changes judgment. Resurrection: guests perform release while resisting possession. | Prefer Resurrection's direct guest involvement for the party, provided the father's motive moves before the finale and the sign convention is established early. Research does not select the ending; Rage's testimony structure is also strong. |
| Who experiences the death revelation | Guests and mother discover it together, or guests arrive knowing and confirm it for her. | Follow the handoff: both learn through evidence. Keep the opening's folklore incomplete. The alternative changes the intended mystery and needs an explicit captain choice. |
| Overall register and welcome | Playful ghost adventure, theatrical gothic horror, or realistic tragic horror. | Theatrical gothic horror with a warm host welcome and sincere character stakes. Allow laughter without requiring comedy inside the scenes. |
| Child-death depiction | Implied death with work voices and aftermath, brief stylized distress, or sustained realistic suffering. | Imply deaths through the existing evidence and voices; avoid prolonged realistic child suffering. The story can remain tragic without asking the crowd to enact grief. |
| Mother's menace | Continuous hostility, alternating attachment and threat, or mostly sorrow. | Let attachment remain visible through the threatening turn. Preserve a recognizable reason for anger or possession and a clear change at release. |
| Father and reconciliation | Explicit forgiveness, acknowledged motive with unresolved judgment, or continued condemnation. | Acknowledge the coercion and failed bargain without requiring forgiveness. Stopping further harm and reaching rest need not declare his act right. |
| Guests' identification | Living helpers bound to the children, or a deeper identity identification. | Keep the handoff's living-helper role. No additional secret identity or personal bereavement participation. |
| Final emotional color | Hopeful rest, sorrowful release, or an unsettling residue. | A clear release after the climax, with the existing loss outcome still receiving a complete fictional ending. Use a short return to the party rather than an extended grief scene. |
| Proper names and historical detail | Adopt either design's proposed mother/father names, surnames, neighbor and date, or settle another minimal set. | Retain the four established child names. Keep the other proposals provisional and outside the minimum guest account until the captain chooses. Do not invent further history. |

The opening-spoiler conflict, late father revelation, unseeded sign law and contradictory character knowledge are craft findings, not taste votes. They should be resolved in writing against the authoritative handoff whichever ending the captain chooses.

## Sources I could not reach

- Laura E. Hall, *Planning Your Escape* (2021): [publisher catalogue](https://www.simonandschuster.biz/books/Planning-Your-Escape/L-E-Hall/9781982140342) reached; full book or a usable narrative chapter not obtained. S28 is separately read primary work. No claim here comes from the unread book.
- Scott Nicholson and Liz Cable, *Unlocking the Potential of Puzzle-based Learning* (2021): [SAGE catalogue](https://in.sagepub.com/en-in/ind/node/1572358) reached, including the listing for chapter 4 on narrative; chapter text not obtained. S1 is Nicholson's actual paper, not that chapter.
- Alfred Hitchcock's 1972 AFI seminar: [transcript location](https://www.hitchcockwiki.com/wiki/Interview%3A_Alfred_Hitchcock_at_the_AFI_Seminar_roundtable_%2818/Aug/1972%29) returned an internal access error. S26 uses a different, actually read 1937 essay. This report does not attribute the famous suspense example to an unread transcript.
- Theatre Macabre: searches did not establish a suitable primary séance-design account. A same-name college production review was not treated as evidence about the Bousman/Sears immersive work.
- *Haunted Attraction* magazine and HAuNTcon: no unrestricted substantive story-design article or talk transcript located in this pass. Presentation listings are not viewed talks. S18, S19 and S27 provide actual designer accounts instead.

Some direct downloads failed while native access worked. Hall's S28 returned 403 through the scratch downloader, but its article was read through native web access. A local Immersology index request returned 406; native access supplied the needed articles. Incorrect guessed URLs for Short and a Cooper installment were replaced with verified links. These were retrieval problems, not missing source texts.
