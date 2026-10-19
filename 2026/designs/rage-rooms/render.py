from pathlib import Path
import re
import markdown
from html import escape

ROOT = Path(__file__).resolve().parent
DEST = ROOT.parents[1] / '.lavish' / 'hw-rage-rooms'
source = (ROOT / 'report.md').read_text()
# S-numbers cite the supplied catalogue, not a claim of fresh web research.
source = re.sub(r'\bS(\d+)\b', lambda m: f'[S{m[1]}](../hw-story-research/report.md#s{m[1]})', source)
body = markdown.markdown(source, extensions=['tables', 'fenced_code', 'toc'])
def link(m):
    target = m[1]
    if target.startswith(('#', 'http:', 'https:', 'file:')):
        return m[0]
    path, sep, anchor = target.partition('#')
    resolved = (ROOT / path).resolve()
    if resolved.name == 'report.md' and resolved.parent.name == 'hw-story-research' and sep:
        resolved = ROOT.parents[1] / '.lavish' / 'hw-story-research' / 'index.html'
    return 'href="' + escape(resolved.as_uri() + (sep + anchor if sep else ''), quote=True) + '"'
body = re.sub(r'href="([^"]+)"', link, body)
# The overview is an actual first printed page; the rest flows continuously.
body = body.replace('<h2 id="the-sitting">', '</section><section><h2 id="the-sitting">', 1)
body = '<section class="overview">' + body + '</section>'
css = '''
body{margin:0;background:#faf8f4;color:#1d1a16;font:17px/1.6 Georgia,serif}
main{max-width:860px;margin:0 auto;padding:40px 24px 80px}
h1,h2,h3{font-family:system-ui,sans-serif;line-height:1.25} h2{margin-top:2.2em;border-bottom:1px solid #d9d2c5;padding-bottom:.2em}
table{border-collapse:collapse;width:100%;font:14px/1.4 system-ui,sans-serif;margin:1em 0;display:block;overflow-x:auto}
th,td{border:1px solid #d9d2c5;padding:6px 10px;text-align:left;vertical-align:top} th{background:#efe9df}
code{overflow-wrap:anywhere;font-size:.9em;background:#efe9df;padding:1px 4px;border-radius:3px} pre{background:#efe9df;padding:12px;overflow-x:auto} pre code{background:none}
blockquote{border-left:4px solid #b8a98e;margin:1em 0;padding:.2em 1em;color:#4a4238}
nav{font:14px system-ui,sans-serif;background:#efe9df;padding:10px 24px;position:sticky;top:0} nav a{margin-right:14px;line-height:1.8}
a{color:#674a27} h2,h3{scroll-margin-top:90px}
@page{size:letter;margin:.6in .65in;@bottom-center{content:counter(page);font:9pt Georgia,serif;color:#4a4238}}
@media print{
body{font:10.5pt/1.28 Georgia,serif;background:white;color:#1d1a16}
main{max-width:none;padding:0}nav{display:none}p{margin:.5em 0}
h1{font-size:20pt;margin:0 0 .6em}h2{font-size:14pt;margin:1.2em 0 .4em}h3{font-size:11pt;margin:1em 0 .35em}
h1,h2,h3{break-after:avoid}p,li{orphans:2;widows:2}
table{display:table;overflow:visible;font-size:9pt;line-height:1.25}tr{break-inside:avoid}th,td{padding:4px 6px}
a{color:inherit;text-decoration:none}.overview{break-after:page}.overview h2{margin-top:.8em}.overview h3{margin-top:.65em}
}
'''
nav = [('one-page-the-four-changes','Four changes'),('the-sitting','Sitting'),('deliverance-open-the-place-where-he-left-the-message','Rooms'),('the-turn-what-the-first-half-hands-over','Turn'),('revised-guests-eye-walkthrough','Walkthrough'),('captains-calls','Captain’s calls')]
page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Halloween 2026: Rage, four guests together</title><style>' + css + '</style></head><body><nav aria-label="This report">' + ''.join(f'<a href="#{key}">{label}</a>' for key,label in nav) + '</nav><main>' + body + '</main></body></html>'
DEST.mkdir(parents=True,exist_ok=True)
(DEST / 'index.html').write_text(page)
print(f'Rendered {DEST / "index.html"}; {len(source.split())} words')
