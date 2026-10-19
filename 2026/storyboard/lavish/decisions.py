from pathlib import Path
import re
p=Path(__file__).parent/'storyboard.html';s=p.read_text().replace('STORYBOARD 04','STORYBOARD 05')
# Replace all settled review forms with a compact decision record below.
for key in ['cards','rig','death','menace','medium','ouija']:
 s=re.sub(r'<form class="panel question" data-lavish-question="'+key+r'".*?</form>','',s,flags=re.S)
# Universal corrections before specific scene additions.
repls={
'Optional Menace overlay goes to one guest':'A secret Tory-spy Menace overlay goes to one randomly dealt guest',
'one wrong suggestion or brief delay, never obstruction.':'one wrong suggestion or brief delay, never physical obstruction. A separately dealt Healer overlay holds one proposed cure token; four guests cover all roles, with no extra player. Keep the two special overlays on different guests.',
'Current draft assigns the opening Veiled curse to a willing participant as the price of contact. They remain blind until their own game ends. They can be sacrificed like anyone else; no protected witness, no predetermined final player. This entry curse is the proposed way to preserve the captain’s blindness requirement while later payments remain flexible.':'The opening reading uses four honestly shuffled tutorial cards, exactly one Veiled. Whoever draws it is blinded immediately, teaching everyone how curses work. The recipient is not selected by the actors and gains no survival protection. Explain blindfold participation before the random draw; if a guest cannot participate, adapt the role openly rather than secretly fixing the draw. The cursed guest remains blind if they survive.',
'“One must close their eyes to see her. If the test fails, choose what the house takes.”':'“The card has chosen. Now tell me what lies behind the next five.”',
'Then guess a face-down card rank. The card is a blank mourning card: this <b>proposed rig is guaranteed to fail</b>.':'Then guess <b>five real symbol cards consecutively</b>, using five equally likely symbols. Return and reshuffle the card before each next draw, including after a correct guess. With independent uniform draws, five correct is 1 in 3,125. The cards and outcomes are honest; the demand is effectively impossible, not literally unwinnable. A lucky perfect run succeeds and pays no cost.',
'New draft: entry Veiled curse plus a separately paid rigged test; exact arrangement still for review.':'Captain decisions: randomly assigned immediate tutorial blindness, honest near-impossible card test. New draft: four-card tutorial deal, five-symbol replacement protocol and exact costs.',
'If they are removed, give their personal ending aloud while still blind':'If they are removed, give their personal ending aloud while still blind',
'Other curses':'Other curses',
'The hidden blank-card test is the sole proposed guaranteed failure.':'The honest five-symbol test is designed to fail almost always. Do not falsify a lucky success. The rule is five consecutive correct guesses in one five-draw attempt, not endless attempts until someone succeeds.',
'The opening Veiled curse is proposed as a separate entry price so blindness can coexist with free choice of later costs. The captain has not approved this exact arrangement; this is an explicit review point, not a new fixed survivor rule.':'Opening tutorial: four shuffled cards, exactly one Veiled, randomly assign blindness immediately. This tutorial is separate from later failed-test payments. Captain has chosen random immediate blindness and the honest difficult card test; exact deck/round details are draft implementation.',
'Genuine puzzle outcomes, a shuffled compatible curse draw, and group choices make different runs different.':'Genuine puzzle outcomes, honestly shuffled ESP draws, compatible curse draws and group choices make different runs different.',
'The Menace remains optional and bounded. Healer/mercy, if kept, can remove a temporary curse; it cannot undo Veiled or bring someone back.':'The Tory-spy Menace and Healer are both baseline. Additional Deafened, Silenced and No Hands curses remain in play. Proposed healer rule: one cure token removes one non-Veiled curse; it cannot bring a sacrificed player back. Preserving Veiled keeps the blind-ending requirement intact; the exact cure limit remains draft tuning.',
'one rigged test':'one near-impossible honest test',
'Firstmate: inheritance/war-chest lure and keepsakes.':'Firstmate: inheritance/war-chest lure and keepsakes. Captain now confirms mediums are unwitting and menace serves the Tory husband.',
'The medium tells the true tragedy plainly:':'The medium is genuinely trying to help and does not know the ghost’s purpose. The medium tells the true tragedy plainly:',
'Sacrifices happen <b>during</b>':'Sacrifices happen <b>during</b>',
'No guest brings valuables.':'No guest brings valuables.',
'The board should move. The schedule should not depend on it.':'The contact scene works before a board is chosen.',
'ONE SIGNATURE BUILD, IF IT EARNS ITS PLACE':'OUIJA DEFERRED · NOT YET SELECTED',
'BUILD-HEAVY · CAPTAIN IDEA':'OPTIONAL / DEFERRED · BUILD-HEAVY',
'The film-like illusion depends':'If selected later, the film-like illusion depends',
'<b>Commit gate:</b> reserve at most two available work sessions to prove motion. If it fails, freeze the theatrical version. Do not spend the final rehearsal week debugging vision.':'<b>Captain decision:</b> defer the Ouija investment until the overall mechanics are settled. It may not be included at all. If selected later, propose a short proof-of-motion gate; do not schedule or start that build now.',
'<b>Sessions 6–7, only if available:</b> time-box the Ouija prototype. Commit to full motion or spoken fallback by October 17, or earlier if absence requires it.':'<b>Only after mechanics are agreed:</b> revisit whether the Ouija belongs in the show. Its investment is deferred. If later selected, time-box a prototype; otherwise retain the voice/slate contact scene. Protect the final rehearsal week.',
'Menace overlay, healer/mercy token, short hypnosis ritual, richer keepsake dressing and optional fog.':'Short hypnosis ritual, richer keepsake dressing and optional fog. Menace, healer and additional curses are already part of the core game.',
'None is necessary to explain the betrayal.':'These optional effects are not necessary to explain the betrayal.',
'A short staged breathing/countdown ritual':'A short staged breathing/countdown ritual',
'Captain: variable survivors and “become hers” feels closer; exact ending remains undecided.':'Captain: variable survivors and “become hers” feels closer; exact ending remains undecided.',
'Ouija + register':'Voice/slate + register; Ouija optional',
'1 to 4 survivors: Ouija + register':'1 to 4 survivors: contact + register',
'One permanent Veiled curse':'One persistent Veiled curse',
'Optional Menace':'Secret Tory Menace',
'No immunity, fixed removal order or promised solo hero.':'No immunity, fixed removal order or promised solo hero. Baseline healer can lift a curse; proposed limit excludes Veiled so a surviving blind guest still ends blind.',
'The full build is from scratch':'If chosen, the full build is from scratch',
'Revision 04:</b>':'Revision 05:</b> Incorporated random immediate tutorial blindness; baseline additional curses/healer/Tory spy; honest 5-symbol card test; death discoveries mapped to curses; unwitting mediums; Ouija optional and deferred. Removed settled choice forms. Revision 04:',
'inbox messages 001–006':'inbox messages 001–010',
'A medium’s complicity and the literal ending remain open.':'The medium is unwitting; the exact ending remains open.',
'medium’s complicity and the literal ending remain open.':'the medium is unwitting; the exact ending remains open.',
'ending/lure, optional curse-menace rules':'ending/lure and rule tuning',
'Firstmate suggestion #1; intentionally not used in this draft.':'Captain selected the curse/death connection.',
'one rigged test and one persistent Veiled curse':'one near-impossible card test and one persistent Veiled curse'
}
for a,b in repls.items():s=s.replace(a,b)
# The contact scene gets a voice-first default, independent of Ouija.
a=s.index('<article class="scene" id="scene-07">');b=s.index('</article>',a)
seg=s[a:b]
seg=seg.replace('SEANCE TABLE · OUIJA · 3 MIN','SEANCE TABLE · DIRECT CONTACT · 3 MIN')
seg=seg.replace('Build-heavy option · theater fallback','Theater / low-build · Ouija deferred')
seg=seg.replace('A magnet hidden beneath the table moves the planchette; the voice speaks every letter aloud.','The mother’s voice speaks from the room and a prewritten double slate reveals the same words. A self-moving board may replace this only if chosen later.')
start=seg.index('<div class="mechanics">');end=seg.index('</div>',start)+6
seg=seg[:start]+'''<div class="mechanics"><div class="labelhead">What players do</div><p><b>Default:</b> place the four keepsakes around the register. The mother says “OFFER… YOURS”; the unwitting medium opens the slate and reads the message aloud. The four-place register contains all four name tokens: removed guests already claimed, survivors still open. No board, camera or motion is needed to proceed.</p><p><b>Optional / deferred:</b> if selected later, fingers on the planchette permit a camera-checked XY magnet to spell the same message. Voice echoes letters for blind guests; manual GO and no-hands stop remain. Any contact chain gates the voice equally well without the board.</p></div>'''+seg[end:]
seg=seg.replace('Captain: XY/camera Ouija and false choices.','Captain: XY/camera was an idea; investment now deferred, inclusion uncertain. False choices remain.')
s=s[:a]+seg+s[b:]
# Progressive child-death evidence. Names/details are draft fiction, not claimed captain decisions.
clues={
3:('Child I · Veiled','A burned household letter and charcoal scene reveal: “Smoke blinded her; she could not find the door before the fire took her.” The revealed BELL clue points onward. Turn portrait I and its EYE symbol on the register. Proposed fictional detail, not a settled death script.'),
4:('Child II · Deafened','The voice recounts that an assailant’s blow left the child unable to hear the escape call; the child was trapped in the deliberately set fire. The 3–1–4 knocks identify portrait II. Turn its EAR symbol. Describe the loss plainly; do not rely on a tiny prop or an inferred sound cue.'),
5:('Child IV · No Hands','The ridged star is attached to a loose cloth binding. A readable/spoken testimony says the child’s hands were bound and they could not free the door before the fire. Turn portrait IV and its HAND symbol. No actual player bindings.'),
6:('Child III · Silenced','The phrase tiles include a witness line: “They covered his mouth so no alarm could be raised; he never breathed again.” The spoken/tapped answer restores the missing testimony. Turn portrait III and its VOICE symbol. The players now know four distinct murders, and recognize that their curse cards echo them.')}
for n,(title,content) in clues.items():
 a=s.index(f'<article class="scene" id="scene-{n:02d}">');b=s.index('</article>',a)
 seg=s[a:b].replace('<details class="operator">',f'<div class="callout mechanics"><b>Death discovery — {title}.</b> {content}<p class="caption">Captain decision: curses mirror each child’s death and the party learns those deaths through play. Specific incidents/wording here are new draft fiction; intensity still needs the captain’s taste.</p></div><details class="operator">')
 s=s[:a]+seg+s[b:]
# A spoken recap makes the mapping work for the blind guest and any removed clue-bearer.
s=s.replace('Everyone who remains returns to the table with all four seals.','Everyone who remains returns to the table with all four seals. The medium recaps aloud: “Smoke took sight. A blow took hearing. A covered mouth took breath. Bound hands could not escape.” The ghost has been making the living resemble her murdered children.')
# Updated baseline rule card.
pos=s.index('<section id="ouija">')
s=s[:pos]+'''<section class="panel"><div class="eyebrow">BASELINE ROLES &amp; CURSES · CAPTAIN SELECTED</div><h2>They have already dealt the mother’s hand.</h2><div class="grid2"><div><h3>The healer</h3><p>A public overlay, distinct from the hidden spy. Can lift a curse. Draft tuning: one cure token; use it to remove Deafened, Silenced or No Hands. Veiled persists to honor the blind-ending requirement. If the healer is sacrificed, the cure is lost unless used first; this is a real group tradeoff, not a plot requirement.</p></div><div><h3>The Tory’s spy</h3><p>The secret Menace serves the husband. A private instruction permits one false suggestion or a short deliberate delay, never hiding essential clues or obstructing a guest. They can be cursed or sacrificed too. The mother’s eventual trap includes the spy.</p></div></div><p><b>Curse compatibility:</b> Deafened → others relay clues or use text/tactile versions. Silenced → gesture/tap. No Hands → direct another guest or use operator positioning. Veiled → spoken/tactile versions and guided movement. Curses are meaningful losses of participation, but not real confinement or a reason the show cannot finish.</p></section>'''+s[pos:]
# Replace eight suggestion audit, since selected items are no longer questions.
a=s.index('<details class="panel"><summary>Audit all eight firstmate suggestions');b=s.index('</details>',a)+10
s=s[:a]+'''<details class="panel"><summary>Audit the original firstmate suggestions</summary><ol><li><b>Curses mirror deaths:</b> captain selected; four discoveries now included. Exact death details are draft.</li><li><b>Spycraft puzzles:</b> one grille included as draft. Larger codebook/UV/laundry systems remain candidates.</li><li><b>Menace is Tory’s agent:</b> captain selected. No further choice needed.</li><li><b>Belongings / war chest:</b> keepsakes included provisionally; exact lure remains open.</li><li><b>Later medium:</b> captain confirms mediums unknowingly serve the ghost. Rebuilt-house framing remains connective draft.</li><li><b>Period-style senses:</b> hearth, drawings and texture box included; material details adjustable.</li><li><b>Playing cards versus Zener:</b> captain chooses honestly dealt real cards and an effectively impossible consecutive streak. Current five-symbol protocol uses replacement for the 1-in-3,125 odds.</li><li><b>Players as restored children:</b> cool to captain, still undecided. Ambiguous “hers” is current candidate. Child-antagonist play remains HELD.</li></ol></details>'''+s[b:]
# Show decision record before open questions.
pos=s.index('<section id="decisions">')
s=s[:pos]+'''<section class="panel"><div class="eyebrow">SETTLED IN CAPTAIN VOICE REVIEW</div><h2>Decisions already made.</h2><ul><li>Randomly assign immediate tutorial blindness; no protected survivor.</li><li>Keep additional curses, the healer and secret Tory-spy menace as baseline.</li><li>Use real cards honestly dealt; make the streak so hard it almost never succeeds.</li><li>Curses mirror the children’s deaths; discover those deaths during play.</li><li>Mediums are not in on the trap.</li><li>Defer Ouija investment until mechanics are settled; it may be omitted.</li><li>Do not guarantee a single survivor; variable payment direction feels closer.</li></ul><p>Still open: final ending and lure, exact rule tuning/death intensity, physical room mapping, and which séance effects to select.</p></section>'''+s[pos:]
# Adjust core build text.
s=s.replace('Four roles, four seals, four keepsakes,','Four roles plus healer and secret spy overlays, four seals, four keepsakes,')
s=s.replace('short hypnosis ritual, richer keepsake dressing','short hypnosis ritual, richer keepsake dressing')
s=s.replace('A real tragedy','A real tragedy')
s=s.replace('Cards, curses, a secret menace, impossible tests, offerings and physical sacrifice. These predate the chosen story and remain negotiable.','Cards, sense curses, healer, the Tory’s spy, hard honest tests, offerings and physical sacrifice. The captain has now selected these core ingredients; exact cost balance remains draft.')
s=s.replace('CAPTAIN · EARLIER IDEAS','CAPTAIN · CORE MECHANICS SELECTED')
p.write_text(s)
print('Revision 05: captain decisions 007–010 incorporated')
