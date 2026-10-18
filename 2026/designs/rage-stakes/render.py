from pathlib import Path
import html
import re
import markdown

root = Path('/media/griswald/wd-black-2tb/personal/firstmate')
source = root / 'data/hw-rage-stakes/report.md'
target = root / '.lavish/hw-rage-stakes/index.html'
body = markdown.markdown(source.read_text(), extensions=['tables', 'fenced_code', 'toc'])

def local_link(match):
    url = html.unescape(match.group(1))
    if url.startswith(('#', 'https:', 'http:', 'file:')):
        return match.group(0)
    path, separator, fragment = url.partition('#')
    resolved = (source.parent / path).resolve()
    assert resolved.exists(), resolved
    return 'href="' + html.escape(resolved.as_uri() + (separator + fragment if separator else ''), quote=True) + '"'

body = re.sub(r'href="([^"]+)"', local_link, body)
headings = re.findall(r'<h2 id="([^"]+)">([^<]+)</h2>', body)
assert len(headings) == 9, headings
parts = re.split(r'(?=<h2\b)', body)
body = '<section class="reading-page">' + parts[0] + parts[1] + '</section>'
body += ''.join('<section class="reading-page">' + part + '</section>' for part in parts[2:])
nav = ''.join(f'<a href="#{anchor}">{html.escape(label)}</a>' for anchor, label in headings)
css = '''
body{margin:0;background:#faf8f4;color:#1d1a16;font:17px/1.6 Georgia,serif}
main{max-width:860px;margin:0 auto;padding:40px 24px 80px}
h1,h2,h3{font-family:system-ui,sans-serif;line-height:1.25} h2{margin-top:2.2em;border-bottom:1px solid #d9d2c5;padding-bottom:.2em}
table{border-collapse:collapse;width:100%;font:14px/1.4 system-ui,sans-serif;margin:1em 0;display:block;overflow-x:auto}
th,td{border:1px solid #d9d2c5;padding:6px 10px;text-align:left;vertical-align:top} th{background:#efe9df}
code{font-size:.9em;background:#efe9df;padding:1px 4px;border-radius:3px} pre{background:#efe9df;padding:12px;overflow-x:auto} pre code{background:none}
blockquote{border-left:4px solid #b8a98e;margin:1em 0;padding:.2em 1em;color:#4a4238}
nav{font:14px system-ui,sans-serif;background:#efe9df;padding:10px 24px;position:sticky;top:0;z-index:1;display:flex;flex-wrap:wrap;gap:8px 0} nav a{margin-right:14px}
html{scroll-padding-top:125px} a{color:#55412b} h2,h3{break-after:avoid} tr,blockquote{break-inside:avoid}
@media(max-width:600px){main{padding:24px 18px 50px}nav{position:static}html{scroll-padding-top:12px}}
@page{size:A4;margin:15mm}
@media print{body{background:white;font:10pt/1.32 Georgia,serif}nav{display:none}main{max-width:none;padding:0}h1{font-size:19pt}h2{font-size:15pt;margin-top:1.4em}h3{font-size:11pt}p{margin:.65em 0}table{font-size:8.5pt;display:table;overflow:visible}th,td{padding:4px 6px}a{color:inherit;text-decoration:none}code{overflow-wrap:anywhere}}
'''
target.write_text('<!doctype html><html lang="en"><head><meta charset="utf-8">'
                  '<meta name="viewport" content="width=device-width,initial-scale=1">'
                  '<title>Halloween 2026: why act at the fire?</title><style>' + css +
                  '</style></head><body><nav aria-label="Report sections">' + nav +
                  '</nav><main>' + body + '</main></body></html>')
print(f'Rendered {len(headings)} sections, {len(source.read_text().split())} words: {target}')
