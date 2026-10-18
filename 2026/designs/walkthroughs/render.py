from pathlib import Path
import re
import markdown

home = Path('/media/griswald/wd-black-2tb/personal/firstmate')
out = home / 'data/hw-story-walkthroughs'
reference_head = '\n'.join((home / '.lavish/hw-rage/index.html').read_text().splitlines()[:13])
style = re.search(r'<style>(.*?)</style>', reference_head, re.S).group(1)
nav = re.search(r'<nav>(.*?)</nav>', reference_head, re.S).group(1)
nav += '<a href="../hw-walkthrough-rage/index.html">Rage story</a><a href="../hw-walkthrough-resurrection/index.html">Resurrection story</a>'
print_style = '''
@page { size: letter; margin: 0.55in 0.65in; }
@media print {
  body { background: white; font: 10pt/1.25 Georgia, serif; }
  main { max-width: none; padding: 0; margin: 0; }
  nav { display: none; }
  h1 { font-size: 19pt; margin: 0 0 12pt; }
  h2 { font-size: 13pt; margin: 12pt 0 6pt; }
  p { margin: 0 0 5pt; }
  li { margin-bottom: 6pt; }
  h2 { break-after: avoid; }
  p, li { orphans: 2; widows: 2; }
  .print-start { break-before: page; margin-top: 0; }
}
'''
for variant in ('rage', 'resurrection'):
    md = (out / f'{variant}.md').read_text()
    html = markdown.markdown(md)
    for heading in ("Deliverance's room", "Mindwell's room", 'The turn: the fire', 'The win'):
        html = html.replace(f'<h2>{heading}</h2>', f'<h2 class="print-start">{heading}</h2>')
    title = f'Halloween 2026: {variant.capitalize()} guest walkthrough'
    page = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><style>{style}{print_style}</style></head><body><nav>{nav}</nav><main>{html}</main></body></html>\n'
    destination = home / f'.lavish/hw-walkthrough-{variant}/index.html'
    destination.write_text(page)
    print(f'{variant}: {len(md.split())} words; {html.count(chr(34) + "print-start" + chr(34)) + 1} print sections; {destination}')
