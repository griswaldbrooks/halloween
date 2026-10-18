from pathlib import Path
import re
p=Path(__file__).parent/'storyboard.html';s=p.read_text();s=s.replace('STORYBOARD 03','STORYBOARD 04')
# Replace the nine scene texts as complete frames; preserve existing original SVG art.
scenes=[
('01','Four invitations. Four names.','PARLOR · ARRIVAL · 2 MIN','Everyone begins together. No one has been chosen to survive.',
'“Her inheritance has waited for four living witnesses. Tonight, it can be yours.”',
'The medium tells the true tragedy plainly: a secret patriot, her Tory husband, four children murdered, a burned New England home. The colonial mother is the ghost, not the fortune teller. A later spiritualist circle promises access to her inheritance.',
'Give the map: <b>four seals → return to the table → open the inheritance.</b> Deal four transferable roles and one small name token per guest. Ask each player to speak the name written on their token; use that chosen name in the finale. Mark all four tokens on a four-place family register. Put four spendable offering tokens in the group purse. Required seals/keepsakes are a separate inventory.',
'Captain: four guests, card reading, colonial mother and later medium. Firstmate: inheritance/war-chest lure and keepsakes. New draft: chosen name tokens, four-place register and shared offering purse.',
'Captain is the medium, Tamari the attendant. Show the closed chest. Optional baquet chain + glass tone replaces 30 seconds of exposition. Optional Menace overlay goes to one guest, independent of public roles: one wrong suggestion or brief delay, never obstruction.',
'4 players · 4 offering tokens · 0 seals','Roles, name tokens, map and purse: 1–2 min'),
('02','The house names its price','PARLOR · VEILED CURSE + RIGGED TEST · 3 MIN','The first contact costs sight. The first test offers a worse bargain.',
'“One must close their eyes to see her. If the test fails, choose what the house takes.”',
'Current draft assigns the opening Veiled curse to a willing participant as the price of contact. They remain blind until their own game ends. They can be sacrificed like anyone else; no protected witness, no predetermined final player. This entry curse is the proposed way to preserve the captain’s blindness requirement while later payments remain flexible.',
'Then guess a face-down card rank. The card is a blank mourning card: this <b>proposed rig is guaranteed to fail</b>. On failure choose one cost: <b>an offering token; an eligible curse; or one player.</b> The collectors physically remove a sacrificed player and they leave the game. Everyone else advances. Subsequent genuine puzzle success avoids a cost; failed or rigged challenges use this same menu.',
'Captain: at least one blind player, sacrifices during play, no guaranteed survivor count. “Feels closer” direction: costs can be curses, offerings or people. New draft: entry Veiled curse plus a separately paid rigged test; exact arrangement still for review.',
'The blindness persists if that guest survives. If they are removed, give their personal ending aloud while still blind, declare their game over, then help them remove the blindfold and return to the party. Others can later receive Veiled too, subject to solvability. Never require the blind guest to be the one sacrificed.',
'3–4 players after this cost · survival undecided','Blindfold exchange/cleaning, curse ledger and rig: 1–2 min'),
('03','Her secret household','STUDY · SIGHT / LISTENING ALTERNATE · 3 MIN','A letter conceals a message. A family conceals a bargain.',
'“He read every letter. He never learned how to see.”',
'Guests discover the mother’s secret support for the revolution. Her suffering is real; what she wants from them is concealed. Do not imply that her husband ordered the murders—the captain has not chosen that.',
'Align a large grille with a well-lit letter: its windows reveal <b>B E L L</b>. Open the labeled BELL drawer for seal 1 and a keepsake. If the remaining guest is blind, the medium reads the four revealed letters as they align a raised corner guide; the player assembles the word. If a different curse blocks reading, another player or the same audio route works. <b>Win: seal, no toll. Failure: choose a cost, then receive the seal and explicit clue.</b>',
'Captain: sight challenge, originally scene photographs. Firstmate: spycraft and period documents. New draft: grille/BELL, accessible alternate and variable payment.',
'Only collect a person when the group actually chooses that cost. Pause for each escort; no fixed sacrifice at this station. All ritual inventory stays in a shared basket. Optional slate-writing supplies a hint or reveal.',
'1–4 may remain over the full run · no scripted removal','Grille, drawer, keepsake and seal: ~30 sec'),
('04','A voice in the cold hearth','HEARTH · HEARING · 3 MIN','The medium no longer has to translate. The house addresses them itself.',
'“Three. One. Four. Listen again, if you must.”',
'The mother’s whisper becomes intimate. The guests retrieve a child’s drum; the lullaby stops as it leaves the box. A blind guest can now be the strongest member of the team.',
'Listen to <b>3–1–4</b>, reinforced by grouped knocks. Enter it on a box or speak it for the attendant’s manual release. Gain seal 2 and keepsake. If no one can hear, use the slate/printed version; for a lone blind listener, spoken code plus tactile markers/manual release is sufficient. Success avoids payment. On failure, <b>offering / eligible curse / person</b> buys progress.',
'Captain: whisper puzzle. Firstmate: hearth, drum, rapping and slate. New draft: code and alternate delivery routes.',
'Quiet the background for the clue. Replay on request. Live knocks need no new mechanism; solenoids are an optional build. After any person-payment, Captain and Tamari perform the short exit handoff and return.',
'Survivors depend on costs chosen','Box, drum, cue and optional slate: ~30–60 sec'),
('05','Something reaches back','HEARTH · TOUCH · 3 MIN','Two harmless textures. Then a hand where no hand should be.',
'“Find the star. Keep hold of it, whatever answers.”',
'The texture box moves from cloth to smooth beads to a brief unexpected touch. The group’s last few hands become precious. No one needs to be removed just because this scene has finished.',
'Find a ridged star matching a tactile sample among three large shapes. Gain seal 3 and keepsake. A blind guest can lead; a hands-cursed guest directs another. <b>Solo with a hands curse:</b> operator holds each shape for inspection and the guest identifies it by sight or verbal description. Optional spirit-hand contact replaces the box’s final texture. Failure uses the shared cost menu.',
'Captain: touch/texture/hand scare. Firstmate: ash and spirit hands. New draft: matching task and fallback routes.',
'Use opt-in, brief touch with immediate release, or moving cloth + sound. If a sacrifice is chosen, both collectors enter; Captain returns promptly to the remaining players while Tamari completes the exit handoff. Never leave a blind guest navigating alone.',
'No required sacrifice · 1–4 remain','Texture box and contact surface: 1–2 min'),
('06','Speak the house awake','TABLE · SPEECH / HYPNOSIS · 3 MIN','There may be four voices left. There may be only one.',
'“Speak together—or speak for everyone who cannot.”',
'A short staged breathing/countdown ritual focuses the remaining guests. The ghost’s words now come directly from the room. Hypnosis is a theatrical frame, not a test of actual susceptibility.',
'Order four tiles with 1–4 raised dots. Recorded words match numbered knocks: <b>1 OPEN, 2 THE, 3 HOUSE, 4 AGAIN.</b> Speak the phrase to earn seal 4. Blind participants use touch/hearing; a speech-cursed group taps the four-beat pattern instead. Apply the same cost menu on failure. Everyone who remains returns to the table with all four seals.',
'Captain: hypnosis and ability-based puzzles. New draft: scalable tactile/spoken task. Baquet and glass tone are firstmate candidates.',
'Optional baquet: all <em>remaining</em> players complete the chain. At one player, one hand holds a handle and the other works the tiles/board. Choose a compatible gesture for a temporary hands curse or end that temporary curse at its stated expiry; Veiled is never lifted merely to simplify staging.',
'1–4 survivors reach four seals','Raised tiles, seals and optional chain: ~30–60 sec'),
('07','The book has been keeping score','SEANCE TABLE · OUIJA · 3 MIN','The names of those taken remain. The names of those here have empty places beside them.',
'“O F F E R. Then: Y O U R S.”',
'The required keepsakes lie around the board. A magnet hidden beneath the table moves the planchette; the voice speaks every letter aloud. Guests discover that the “inheritance” register has been tracking <em>them</em>. Those removed are already claimed. The rest have been carrying their own places to the table.',
'Any remaining player places fingertips on the planchette; others can join. A camera checks hand presence; hidden XY motion spells <b>OFFER → YOURS</b>, voiced aloud. Operator holds manual GO authority. If no guest can use hands under a temporary curse, use the spoken/static-board fallback. Keep blindness. The four-place register always contains all four name tokens: claimed marks for removed guests, open marks for survivors.',
'Captain: XY/camera Ouija and false choices. Firstmate: offerings bind players. New draft: variable-count register, YOURS message and spoken letter echo.',
'Optional baquet is checked by the operator; it is not silently another electronics project. Early board demonstration remains an option for sighted guests. Full build is from scratch; preserve the laser cutter. The static slate/voice version delivers the same information.',
'1–4 at table · removed guests already claimed','Gantry home/check + offerings/register: 1–3 min'),
('08','Open it. Or give it back.','TABLE · FINAL FALSE CHOICE · 2 MIN','The group has paid to reach the prize. Now the prize asks for them.',
'“Take what I have saved for you… or return what you have taken from me.”',
'Two choices converge: open the chest to receive the inheritance, or return the keepsakes to end the bargain. Either completes the four-place register. The medium explains the trap clearly before the payoff: every seal bound a name to the house; offerings and curses paid for passage, not freedom.',
'Choose together. Captain opens the chest or receives the returned keepsakes. Tamari flips the surviving guests’ name tokens to <b>HERS</b>. The previously removed guests’ slots were already marked. No last-minute puzzle or forced series of individual removals. The remaining 1–4 are claimed together in the ending; afterwards the collectors guide them out.',
'Captain response: variable survivors and “become hers” feels closer; exact ending remains undecided. New draft: two final choices, explicit binding explanation and shared claim.',
'Use one theatrical outcome with count-aware blocking. Blind guests hear each name read and feel their token turn. Sighted guests see four marks complete. Preserve actual freedom to leave; the false choice is in the story.',
'1–4 survivors · one collective final claim','Return name tokens/chest to start: ~30 sec'),
('09','The fourth place fills','TABLE → PARTY EXIT · ENDING CANDIDATE · 2 MIN','Four answers come from the dark. Some sound like children. Some sound almost like them.',
'“Every door you opened made a place for you. Those I took are already here. The rest of you… are mine.”',
'<b>Proposed fun-and-creepy payoff:</b> the chest opens to a family register bearing the four names the guests spoke at entry. A glass tone stops. Four child voices answer “Mother,” including a voice behind the survivors. The mother names each remaining guest while placing a keepsake/name card in their hand. Are they her children now, or something she possesses? The bargain is clear; the transformation stays uncertain.',
'For <b>1 survivor</b>, make the voice intimate and give one tactile token. For <b>2–3</b>, read each name and let the empty places stand for those removed. For <b>4</b>, all four marks turn together: saving every person never broke the bargain. A surviving blind player receives the entire reveal through spoken names, four voices and touch, and remains blind until “The game is over.”',
'Captain’s bar: fun AND creepy, comprehensible, cool experience. Ambiguous “hers” was a promising direction, not a final choice. This whole ending remains a selectable draft.',
'Hold the image/sound for a breath, then clearly end the game. Guide guests to the lit party area and invite blindfold removal after their ending. Removed guests already received a private epilogue and returned to the party; no waiting room or forced reunion. Give everyone a small marked card as the souvenir of the trick.',
'Ending works for 1, 2, 3 or 4 · no guaranteed survivor','Names, keepsakes, chest and final audio: ~30–60 sec')]
for n,title,loc,caption,line,story,play,origin,op,state,reset in scenes:
 old=re.search(f'<article class="scene" id="scene-{n}">.*?</article>',s,re.S).group(0)
 svg=re.search(r'<svg.*?</svg>',old,re.S).group(0)
 scope='Build-heavy option · theater fallback' if n=='07' else 'Theater / low-build'
 block=f'<article class="scene" id="scene-{n}"><div class="scene-top">{svg}<div class="scene-intro"><span class="number">{n}</span><div class="eyebrow">{loc}</div><h3>{title}</h3><p>{caption}</p><div class="badges"><span class="badge badge-outline">{scope}</span><span class="badge badge-ghost">{state}</span></div></div></div><div class="scene-body"><blockquote>{line}</blockquote><p>{story}</p><div class="mechanics"><div class="labelhead">What players do</div><p>{play}</p></div><p class="caption mechanics"><b>Reset estimate:</b> {reset}.</p><details class="operator"><summary>Operator cue & idea provenance</summary><p>{op}</p><p class="caption">{origin}</p></details></div></article>'
 s=s.replace(old,block)
# Captain correction strip and intro.
a=s.index('<section class="callout">');b=s.index('</section>',a)+10
s=s[:a]+'''<section class="callout"><div class="eyebrow">CAPTAIN REVIEW · SEPTEMBER 30 · DIRECTION, NOT FINAL APPROVAL</div><p><b>No guaranteed final survivor. No fixed sacrifice after a scene.</b> The captain says variable costs “feel closer”: failure may cost a curse, an offering, or a person. Current draft can reach the ending with 1–4 players.</p><p>A cursed blind guest stays blind if they survive, but can be sacrificed like anyone else. The ending must be fun, creepy and intelligible. “Become hers” remains an ambiguous candidate, not a settled ending.</p><p>Saturday October 31 · lower floor + basement · five groups of four · 15–30 minute runs · up to ~15-minute resets acceptable · from-scratch XY board; laser cutter preserved.</p></section>'''+s[b:]
s=s.replace('The team shrinks during play; a blind guest reaches the ending.','The team may shrink during play; a blind guest may reach the ending.').replace('Later spiritualists reopen contact. Four keepsakes buy the “inheritance.”','Later spiritualists reopen contact. Four seals promise the “inheritance.”')
s=s.replace('Four seals. One return. The team shrinks at every seal.','Four seals. Variable costs. One final claim.')
# Shared diagram.
a=s.index('<pre class="mermaid">');b=s.index('</pre>',a)+6
s=s[:a]+'''<pre class="mermaid">flowchart TD
 A["Four arrive; one receives Veiled curse"] --> B["Rigged test or next sense challenge"]
 B --> C{"Success?"}
 C -->|Yes| D["Gain seal or next instruction"]
 C -->|No| E{"Choose a cost"}
 E --> F["Spend offering"]
 E --> G["Take compatible curse"]
 E --> H["Sacrifice a player, if more than one remains"]
 H --> X["Collectors escort guest out; personal epilogue"]
 F --> D
 G --> D
 H --> D
 D --> I{"Four seals complete?"}
 I -->|No| B
 I -->|Yes| J["1 to 4 survivors: Ouija + register"]
 J --> K["Either final choice completes the claim"]
 K --> L["All hear the ending; party exit"]
</pre>'''+s[b:]
s=s.replace('At a timeout, take a compatible cost and give an explicit hint or the seal. Proceed to that station’s sacrifice; never loop indefinitely. Removals are real exits from the game.','A genuine success earns progress without a cost. A failed or rigged test earns progress after one payment. The party’s choices, performance and shuffled eligible curse draw vary the outcome. Sacrifice is never forced by a scene number.')
s=s.replace('03 · sight + first removal','03 · sight / possible cost').replace('04–05 · two more removals','04–05 · senses / possible costs').replace('Cards · blind witness seat · S','Cards · 1–4 finale seats · S')
s=s.replace('Dashed = return to table before third removal.','Dashed = return to table after the four seals.').replace('Keep blind guest’s stations and exit on one level','Keep a blind guest’s stations and exit on one level')
# Replace rules section entirely.
a=s.index('<section id="rules">');b=s.index('<section class="panel"><div class="eyebrow">SHRINKING-TEAM CHECK',a)
s=s[:a]+'''<section id="rules"><div class="eyebrow">VARIABLE COSTS · PROPOSED RULESET</div><h2>The team chooses its losses. The house keeps the names.</h2><div class="grid2"><div class="panel"><h3>One cost buys progress</h3><p><b>Success:</b> earn the seal free. <b>Failure/rigged test:</b> choose an offering, a curse, or a person. Then receive the seal/instruction and continue. One toll per challenge, no repeat-failure grind.</p><p>The opening Veiled curse is proposed as a separate entry price so blindness can coexist with free choice of later costs. The captain has not approved this exact arrangement.</p><p>Genuine puzzle outcomes, a shuffled compatible curse draw, and group choices make different runs different. The hidden blank-card test is the sole proposed guaranteed failure.</p></div><div class="panel"><h3>Blindness without plot armor</h3><p>Veiled persists until that guest’s personal game ends. They can be sacrificed; if they remain, they finish blind. No immunity, fixed removal order or promised solo hero.</p><p>A temporary curse may not close every solution route. The operator offers only compatible cards; alternate sound, tactile, spoken or visual clues remain available. Mark the expiry on each card—next seal, except Veiled.</p><p>For a lone guest with no offering and no compatible ability curse, use <b>The Named</b>: surrender their name token to the house while retaining their abilities. This proposed identity curse makes the finale’s cost concrete without a deadlock.</p></div><div class="panel"><h3>Three things to keep separate</h3><p><b>Spendable offerings:</b> four shared supplied tokens. Lose one to avoid a curse or sacrifice. They are optional costs, not clues.</p><p><b>Required ritual inventory:</b> four seals and four keepsakes. These always remain in the shared basket; departing guests leave all clues behind.</p><p><b>Name register:</b> four guest-name tokens exist from arrival. A removed guest’s place is marked claimed; the final ritual claims every remaining place. Thus four lives are accounted for whether 1 or 4 players reach the chest.</p></div><div class="panel"><h3>Removal &amp; exit</h3><p>A person-payment is available only with at least two people in the game. Captain and Tamari enter together, escort the chosen guest through the side threshold, then return. The last guest cannot pay themself before the ending.</p><p>Removed guests receive a brief personal “you belong to the house” epilogue and a marked keepsake card, then return to the party. They do not wait to rejoin, operate machinery or perform a new role.</p><p>The Menace remains optional and bounded. Healer/mercy, if kept, can remove a temporary curse; it cannot undo Veiled or bring someone back. Child-antagonist play stays HELD.</p></div></div><div class="callout" style="margin-top:20px"><b>Clear instructions:</b> “Four seals. At a failed test, pay one cost and continue. Keep all clues in this basket.” Print the count, named zones and payment icons on the map. Explain sacrifices before play, but keep the mother’s ownership trap secret until the register reveal.</div></section>'''+s[b:]
# Replace former guaranteed shrinking feasibility block.
a=s.index('<section class="panel"><div class="eyebrow">SHRINKING-TEAM CHECK');b=s.index('<section id="ouija">',a)
s=s[:a]+'''<section class="panel"><div class="eyebrow">FEASIBILITY AT EVERY COUNT</div><h2>One, two, three or four can finish.</h2><div class="grid2"><p><b>4:</b> everyone may remain by spending offerings or accepting curses. Share clue roles; the final claim turns all four names. Example: spend an offering on the rigged test, solve the real challenges.</p><p><b>2–3:</b> one or two player-payments reduce available hands/eyes/ears. Remaining roles are transferable; operator alternates cover lost senses. The empty marked places make the missing guests part of the story.</p><p><b>1 sighted:</b> all tasks have solo versions; no simultaneous multi-person locks. Ghost clues, taps and manual releases replace abilities temporarily lost to curses.</p><p><b>1 blind:</b> raised grille edge + spoken letters; audible code; tactile star; raised-dot phrase tiles; voiced board letters and name-token reveal. Guided transitions, finale seated, no visual-only win condition.</p></div><p><b>HELD OPTION:</b> removed guests return as the mother’s children to oppose survivors. Captain likes it but worries about novice complexity. Keep it out of the baseline; consider a single scripted knock/line only in a later test.</p><p><b>Pressure without invalidating success:</b> helpful play can save people from early removal, while the last revelation still claims them. What changes is who experiences the climax and what they sacrificed on the way—not whether a genuine puzzle answer counts.</p></section>'''+s[b:]
# Endings comparison before effects, with coherent cool/creepy experience.
a=s.index('<section id="effects">')
s=s[:a]+'''<section id="ending-options"><div class="eyebrow">ENDING STILL UNDECIDED</div><h2>A clear bargain. An unsettling answer.</h2><div class="grid3"><div class="panel"><span class="badge badge-outline">A · SHOWN IN SCENES 08–09</span><h3>“You are mine.”</h3><p>The chest contains the guests’ own names in a family register. Every missing place is already claimed; every survivor completes the picture. Four voices answer Mother.</p><p><b>Fun:</b> personalized object reveal, a tactile souvenir and a shared final action. <b>Creepy:</b> their names were taken at the very start.</p><p><b>Clear:</b> they paid for passage into her family. <b>Ambiguous:</b> children, possession, or ownership.</p></div><div class="panel"><span class="badge badge-outline">B · FIRSTMATE’S ORIGINAL INTERPRETATION</span><h3>“My children.”</h3><p>Child-name plaques overwrite the guests’ names, and Mother addresses survivors as the resurrected children. Removed guests count as already restored.</p><p><b>Fun:</b> a strong role transformation. <b>Creepy:</b> identity replacement. <b>Tradeoff:</b> answers the mystery more literally than the captain may want.</p></div><div class="panel"><span class="badge badge-outline">C · SEPARATE RESTORATION</span><h3>“Four lives for four lives.”</h3><p>The guests’ register goes blank as four children answer from a cabinet. Their lives restored someone else; the survivors are claimed in the final ritual.</p><p><b>Fun:</b> theatrical sound/cabinet payoff. <b>Creepy:</b> they were the fuel. <b>Tradeoff:</b> needs careful dialogue to feel like an earned reveal rather than arbitrary defeat.</p></div></div><p class="callout"><b>Rehearsal question:</b> after the ending, a new guest should be able to say “We helped her bring back her children, but the price was us.” They need not know whether they literally became those children. If they cannot explain that exchange, simplify the final line before adding effects.</p></section>'''+s[a:]
# Remaining scope/provenance/form strings.
repls={
'28 min draft / 30 min cap':'28 min draft / 30 min cap',
'complete OFFER / ONE runs':'complete OFFER / YOURS runs',
'one hand, not four':'one hand, not four',
'appropriate to the solo finale':'appropriate to a 1–4 player finale',
'The mother says “Offer one.”':'The mother says “Offer what is yours.”',
'Veiled curse on the final witness':'Veiled curse on an eligible guest',
'and a permanent blind witness. Three mid-game removals, then the final sacrifice.':'and a persistent Veiled curse. Variable person-payments during play; 1–4 reach the final claim.',
'a shrinking team, physical escorts, and an audible/tactile ending while the final guest is blind.':'variable survivor count, physical escorts when chosen, and an audible/tactile ending for any surviving blind guest.',
'full 4→3→2→1 rehearsal including permanent blindness':'rehearsals at 4, 2 and 1 survivors, including a blind survivor',
'Scene durations sum to 27 minutes plus one minute transition margin.':'Scene durations sum to 24 minutes; allow up to three one-minute escort interludes plus one minute transition margin for a 28-minute draft.',
'Weave':'Weave',
'which emissary':'which guest',
'Permanent blindness + one temporary curse; keep bounded menace':'Persistent Veiled + compatible temporary curses; optional menace',
'Permanent blindness; remove menace and healer':'Persistent Veiled; remove menace and healer',
'Additional curses while preserving solo hearing/touch/speech':'Revise curse/payment rules and explain below',
'Use 28 min draft, two performers, sacrifices during play':'Use 28 min, variable person-payments, two performers',
'Players become the restored children (held interpretation)':'A — Become hers, ambiguously (current draft)',
'Their lives restore separate children (current draft)':'B — Explicitly become her restored children',
'Change the ending / explain below':'C — Restore separate children / or explain another ending',
'Captain wants four sacrifices to restore her children. Firstmate’s possession interpretation is optional; removed guests need not see the finale.':'Ending is still undecided. Compare A/B/C above: current draft keeps the bargain explicit and “hers” ambiguous, for any survivor count.',
'Captain: blindness persists to the end;':'Captain: blindness persists for a surviving cursed guest;',
'Revision 03:</b>':'Revision 04:</b> Removed fixed per-scene sacrifices and protected survivor. Added flexible curse/offering/person costs, 1–4-player endings, persistent blindness without guaranteed survival, and three concrete ending choices. Captain says this direction “feels closer”; it is not final approval. Revision 03:',
'inbox messages 001–005':'inbox messages 001–006',
'All four sacrificed · guests return to party separately':'All four claimed · guests return to party',
'four-person rehearsal':'four-person rehearsal'
}
for a,b in repls.items():s=s.replace(a,b)
# Update the remaining build wording; no actual promise to add every effect.
s=s.replace('one rigged test and a permanent blind witness.','one rigged test and one persistent Veiled curse.')
s=s.replace('A willing last witness','A willing cursed guest')
s=s.replace('The captain has not approved this exact arrangement.','The captain has not approved this exact arrangement; this is an explicit review point, not a new fixed survivor rule.')
p.write_text(s)
print('Revision 04 complete: variable survivors and coherent scalable finale')
