# -*- coding: utf-8 -*-
import os, shutil, time
VER = str(int(time.time()))
from content import T, LANGS
ROOT = os.path.dirname(os.path.abspath(__file__))
PAGES = ['index', 'excavators', 'loaders', 'works', 'contacts']
A = '../assets/'


import re as _re
_W = {
 'ru': 'в|во|на|и|а|но|да|с|со|к|ко|по|до|за|из|от|о|об|у|же|бы|не|ни|для|над|под|при|без|про|как|что|или|то|ли|при|из-за',
 'pl': 'i|w|z|o|u|a|na|do|po|ze|od|za|we|że|lub|czy|ale|dla|bez|pod|nad|przy|oraz',
 'en': 'a|an|the|of|to|in|on|at|by|or|and|for|as|with|is',
}
def typo(html, l):
    pat = _re.compile(r'(?i)(?<![\w-])(' + _W[l] + r')[ \t]+(?=\S)')
    num = _re.compile(r'(\d)[ ](м²|m²|кв|шт|зл|zł|%)')
    out = []
    for part in _re.split(r'(<[^>]+>)', html):
        if part.startswith('<'):
            out.append(part); continue
        part = pat.sub(lambda m: m.group(1) + '\u00a0', part)
        part = pat.sub(lambda m: m.group(1) + '\u00a0', part)  # цепочки «в на»
        part = num.sub(lambda m: m.group(1) + '\u00a0' + m.group(2), part)
        part = part.replace(' —', '\u00a0—')
        out.append(part)
    return ''.join(out)

LOGO = '<svg viewBox="0 0 34 26" fill="none"><path d="M2 3h19l9 9-3 11H9L2 3Z" stroke="#f1efea" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 23v3M15 23v3M21 23v3" stroke="#ff5a0a" stroke-width="2.4" stroke-linecap="round"/></svg>'
ARROW = '<span class="ar"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg></span>'


def head(l, page, title, desc):
    alts = ''.join(f'<link rel="alternate" hreflang="{x}" href="../{x}/{page}.html">' for x in LANGS)
    return f'''<!doctype html><html lang="{T[l]['html']}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{desc}">{alts}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700;800&family=Onest:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap&subset=cyrillic,latin-ext" rel="stylesheet">
<link rel="stylesheet" href="{A}css/style.css?v={VER}"></head><body data-page="{page}">'''


def chrome_top(l, page, pre=True):
    t = T[l]; n = t['nav']
    langs = ''.join(f'<a href="../{x}/{page}.html" class="{"on" if x == l else ""}" hreflang="{x}">{x.upper()}</a>' for x in LANGS)
    nav = f'''<header class="hdr"><a class="logo" href="index.html">{LOGO}<span>{t['brand']}</span></a>
<nav class="nav"><a class="l {'on' if page=='excavators' else ''}" href="excavators.html">{n['exc']}</a><a class="l {'on' if page=='loaders' else ''}" href="loaders.html">{n['load']}</a><a class="l {'on' if page=='works' else ''}" href="works.html">{n['works']}</a><a class="l {'on' if page=='contacts' else ''}" href="contacts.html">{n['contacts']}</a></nav>
<div class="right"><div class="lang">{langs}</div><a class="btn sm" href="contacts.html#form">{n['cta']}{ARROW}</a><button class="burger" aria-label="Menu"><i></i><i></i></button></div></header>'''
    p = ''
    if pre:
        teeth = '<i></i>' * 14
        p = f'<div class="pre"><span class="mono cap">{t["brand"]} — {t["pre"]}</span><div class="teeth">{teeth}</div><div class="num">0</div><span class="mono">%</span></div>'
    return f'<div class="prog"></div><div class="cur"><b></b><i></i><span></span></div><div class="grain"></div><div class="curtain"></div>{p}{nav}'


def footer(l):
    t = T[l]; f = t['foot']; n = t['nav']
    legal = ''.join(f'<span>{x}</span>' for x in f['legal'])
    return f'''<footer class="ft"><div class="teeth"></div><canvas></canvas>
<div class="wrap cols"><div><p class="big">{f['big']}</p></div>
<div><h4>{f['c1']}</h4><ul><li><a href="excavators.html">{n['exc']}</a></li><li><a href="loaders.html">{n['load']}</a></li></ul></div>
<div><h4>{f['c2']}</h4><ul><li><a href="works.html">{n['works']}</a></li><li><a href="contacts.html">{n['contacts']}</a></li></ul></div>
<div><h4>{f['c3']}</h4><ul><li><a href="tel:+48536786039">+48 536 786 039</a></li><li><a href="mailto:zamowienie@naprawa-lyzek.pl">zamowienie@naprawa-lyzek.pl</a></li><li>{f['soc']}</li></ul></div></div>
<div class="wm"><img src="{A}img/w-{l}.jpg" alt="{t['brand']}"></div>
<div class="wrap leg">{legal}</div></footer>'''


def scripts():
    return f'<script src="{A}vendor/gsap.min.js"></script><script src="{A}vendor/ScrollTrigger.min.js"></script><script src="{A}vendor/lenis.min.js"></script><script src="{A}js/main.js?v={VER}"></script></body></html>'


def hero(img, h1, sub, crumb=None, page=False, cta=None, meta=None, scroll=None, pos='60% 50%'):
    words = ' '.join(h1)
    c = f'<div class="crumb mono or">{crumb}</div>' if crumb else ''
    btns = ''
    if cta:
        btns = f'<div class="cta"><a class="btn" href="contacts.html#form">{cta[0]}{ARROW}</a><a class="btn o" href="#dirs">{cta[1]}{ARROW}</a></div>'
    m = ''
    s = f'<span class="scroll mono">{scroll} ↓</span>' if scroll else ''
    d = img.replace('.jpg', '-d.jpg')
    pic = (f'<picture><source media="(min-width:1001px)" srcset="{A}img/{d}"><img src="{A}img/{img}" alt="" style="object-position:{pos}"></picture>' if 'f-hero' in img else f'<img src="{A}img/{img}" alt="" style="object-position:{pos}">')
    return f'''<section class="hero {'page' if page else ''} {'top' if 'f-hero' in img else ''} {'bottom' if 'shop-real' in img else ''}"><div class="bg">{pic}</div>{s}
<div class="in">{c}<h1 data-split>{words}</h1><div class="row"><p class="sub">{sub}</p>{btns}</div></div></section>'''


def marquee(items):
    s = ''
    for i, x in enumerate(items):
        s += f'<span class="{"o" if i % 2 else ""}">{x}<em></em></span>'
    return f'<div class="mq"><div class="tr">{s}</div></div>'


def proc(l, head_eb, head_h):
    t = T[l]
    imgs = ['p1', 'p2', 'p3', 'p4']
    steps = ''.join(f'<div class="s"><img class="mi" src="{A}img/{imgs[i]}.jpg" alt=""><div class="n">0{i+1}</div><h3>{a}</h3><p>{b}</p></div>' for i, (a, b) in enumerate(t['steps']))
    phs = ''.join(f'<div class="ph"><img src="{A}img/{x}.jpg" alt=""></div>' for x in imgs)
    dots = ''.join('<i><b></b></i>' for _ in imgs)
    return f'''<section class="proc"><div class="stage"><div class="right">{phs}</div><div class="left"><div><div class="eb mono or">{head_eb}</div><h2 class="h2" data-lines>{head_h}</h2></div><div class="stp">{steps}</div><div class="dots">{dots}</div></div></div></section>'''


def form(l, img='f-portrait'):
    t = T[l]; f = t['form']; h = t['home']
    return f'''<section class="fm" id="form"><div class="wrap"><div class="fmw"><div class="fcol"><h2 data-lines>{h['fm_h']}</h2><p class="lead" data-rv>{h['fm_p']}</p>
<form data-rv><label><b>01</b><span>{f['name']}</span><input required name="n" autocomplete="name"></label><label><b>02</b><span>{f['phone']}</span><input required type="tel" name="t" autocomplete="tel"></label><label><b>03</b><span>{f['msg']}</span><textarea rows="2" name="m"></textarea></label>
<label class="drop"><b>04</b><input type="file" accept="image/*" multiple><span class="dt"><strong>{f['file']}</strong><small>{f['file2']}</small></span><i>+</i></label>
<button class="btn" type="submit">{f['send']}{ARROW}</button><p class="ok">{f['ok']}</p></form></div><div class="fph" data-mask><img src="{A}img/{img}.jpg" alt=""></div></div></div></section>'''


def cases_strip(l):
    t = T[l]; h = t['home']; cs = t['works']['cases']
    ims = ['c1-4.jpg', 'c2-2.jpg', 'c3-1.jpg', 'c4-1.jpg']
    cards = ''.join(f'<a class="card" href="works.html#c{i+1}" data-cur="→"><div class="im"><img src="{A}img/{ims[i]}" alt=""><span class="arr">→</span></div><div class="t"><span class="mono">{c[0]} / {c[1]}</span><h3>{c[2]}</h3></div></a>' for i, c in enumerate(cs))
    cards += f'<a class="card end" href="works.html"><div class="t"><h3>{h["cs_all"]} →</h3></div></a>'
    return f'''<section class="cs"><div class="pin"><div class="top"><div><div class="eb mono or">{h['cs_eb']}</div><h2 class="h2" data-lines style="max-width:12em">{h['cs_h']}</h2></div></div><div class="trk">{cards}</div></div></section>'''


def split_block(img, eb, h2, p, items, flip=False, cta=None):
    li = ''.join(f'<li>{a}<span>{b}</span></li>' for a, b in items)
    btn = f'<p style="margin-top:34px"><a class="btn" href="contacts.html#form">{cta}{ARROW}</a></p>' if cta else ''
    fr = f'<div class="frame" data-rv><img src="{A}img/{img}" alt=""></div>'
    tx = f'<div><div class="eb mono or">{eb}</div><h2 class="h2" data-lines style="font-size:clamp(28px,4.2vw,76px)">{h2}</h2><p style="margin-top:26px" data-rv>{p}</p><ul class="rl" data-rv>{li}</ul>{btn}</div>'
    return f'<section class="sec"><div class="wrap split">{tx + fr if flip else fr + tx}</div></section>'


def wsr(img, eb, h):
    return f'<section class="wsr"><div class="fr"><img src="{A}img/{img}" alt=""></div><div class="tx"><h2 data-lines>{h}</h2><span class="mono or">{eb}</span></div></section>'


def page_index(l):
    t = T[l]; h = t['home']
    out = head(l, 'index', h['title'], h['desc']) + chrome_top(l, 'index')
    out += hero('f-hero.jpg', h['h1'], h['sub'], None, False, (h['cta1'], h['cta2']), h['meta'], h['scroll'])
    out += marquee(h['mq'])
    out += f'<section class="sec"><div class="wrap"><div class="eb mono or">{h["eb1"]}</div><p class="manif" data-split>{h["manif"]}</p></div></section>'
    imgs = ['k-exc.jpg', 'k-load.jpg']; links = ['excavators.html', 'loaders.html']
    dirs = ''
    for i, (a, b, c) in enumerate(h['dirs']):
        dirs += f'<article class="dir"><div class="img"><img src="{A}img/{imgs[i]}" alt=""></div><div class="in"><span class="mono">0{i+1} / 02</span><h3 data-split>{a}</h3><p>{b}</p><a class="btn go" href="{links[i]}">{c}{ARROW}</a></div></article>'
    out += f'<section class="dirs" id="dirs">{dirs}</section>'
    out += proc(l, h['pr_eb'], h['pr_h'])
    out += wsr('shop-real.jpg', h['wsr_eb'], h['wsr_h'])
    st = ''.join(f'<div class="stat"><b data-count="{a}">0<sup>{u}</sup></b><span>{d}</span></div>' for a, u, d in h['stats'])
    out += f'<section class="sec"><div class="wrap"><div class="stats">{st}</div></div></section>'
    out += cases_strip(l)
    out += form(l)
    out += footer(l) + scripts()
    return out


HOT_EXC = [(37, 9), (51, 7), (34, 64), (21, 44), (53, 50), (63, 86)]


def page_exc(l):
    t = T[l]; e = t['exc']
    out = head(l, 'excavators', e['title'], e['desc']) + chrome_top(l, 'excavators', False)
    out += hero('k-exc.jpg', e['h1'], e['sub'], e['crumb'], True, None, None, None, '50% 55%')
    out += split_block('g-teeth.jpg', e['eb'], e['h2'], e['p'], e['list'], True, t['home']['cta1'])
    hot = ''.join(f'<button class="hot" style="left:{x}%;top:{y}%"><span>{e["hot"][i]}</span></button>' for i, (x, y) in enumerate(HOT_EXC))
    out += f'<section class="sec" style="background:var(--bg2)"><div class="wrap"><div class="eb mono or">{e["an_eb"]}</div><h2 class="h2" data-lines style="max-width:12em;margin-bottom:40px">{e["an_h"]}</h2><div class="anat" data-rv><img src="{A}img/g-anatomy.jpg" alt="">{hot}</div></div></section>'
    out += proc(l, t['home']['pr_eb'], t['home']['pr_h'])
    imgs = [1, 4, 7, 12, 16, 18, 22, 24, 26, 27]
    g = ''.join(f'<figure><img loading="lazy" src="{A}img/c4-{i}.jpg" alt=""></figure>' for i in imgs)
    out += f'<section class="sec"><div class="wrap"><div class="eb mono or">{e["gal_eb"]}</div><h2 class="h2" data-lines style="margin-bottom:40px">{e["gal_h"]}</h2><div class="gal">{g}</div></div></section>'
    out += wsr('shop-real.jpg', t['home']['wsr_eb'], t['home']['wsr_h'])
    out += form(l) + footer(l) + scripts()
    return out


def page_load(l):
    t = T[l]; e = t['load']
    out = head(l, 'loaders', e['title'], e['desc']) + chrome_top(l, 'loaders', False)
    out += hero('k-load.jpg', e['h1'], e['sub'], e['crumb'], True, None, None, None, '55% 55%')
    out += split_block('g-macro.jpg', e['eb'], e['h2'], e['p'], e['list'], True, t['home']['cta1'])
    out += proc(l, t['home']['pr_eb'], t['home']['pr_h'])
    g = ''.join(f'<figure><img loading="lazy" src="{A}img/c1-{i}.jpg" alt=""></figure>' for i in [1, 2, 3, 4])
    out += f'<section class="sec"><div class="wrap"><div class="eb mono or">{e["gal_eb"]}</div><h2 class="h2" data-lines style="margin-bottom:40px">{e["gal_h"]}</h2><div class="gal">{g}</div></div></section>'
    out += wsr('shop-real.jpg', t['home']['wsr_eb'], t['home']['wsr_h'])
    out += form(l) + footer(l) + scripts()
    return out


def page_works(l):
    t = T[l]; w = t['works']; cs = w['cases']
    out = head(l, 'works', w['title'], w['desc']) + chrome_top(l, 'works', False)
    out += hero('shop-real.jpg', w['h1'], w['sub'], w['crumb'], True, None, None, None, '50% 50%')
    G = lambda p, ids: '<div class="gal">' + ''.join(f'<figure><img loading="lazy" src="{A}img/{p}-{i}.jpg" alt=""></figure>' for i in ids) + '</div>'
    V = lambda p, ids: '<div class="vids">' + ''.join(f'<video src="{A}vid/{p}-{i}.mp4" poster="{A}img/{"c2v" if p=="c2" else p}-{i}.jpg" muted loop playsinline autoplay></video>' for i in ids) + '</div>'
    bodies = [G('c1', [1, 2, 3, 4]), G('c2', [1, 2, 3]) + V('c2', [1, 2, 3]), V('c3', [1, 2, 3, 4, 5, 6]), G('c4', list(range(1, 28)))]
    for i, c in enumerate(cs):
        out += f'<section class="wk" id="c{i+1}"><div class="wrap"><div class="hd"><div><div class="eb mono or">{c[0]} / {c[1]}</div><h2 data-lines>{c[2]}</h2></div><p>{c[3]}</p></div>{bodies[i]}</div></section>'
    out += form(l) + footer(l) + scripts()
    return out


def page_contacts(l):
    t = T[l]; c = t['contacts']
    out = head(l, 'contacts', c['title'], c['desc']) + chrome_top(l, 'contacts', False)
    rows = ''.join(f'<div><span class="mono">{a}</span><p>{b}</p></div>' for a, b in c['rows'])
    out += f'''<section class="sec" style="padding-top:clamp(130px,14vw,220px)"><div class="wrap cg"><div><div class="eb mono or">{c['crumb']}</div><h1 class="h2" data-split style="font-size:clamp(40px,8vw,150px)">{c['h1'][0]}</h1><p style="margin-top:20px;color:var(--mute)">{c['sub']}</p><div class="cl">{rows}</div></div>
<div class="map" data-rv><iframe loading="lazy" title="map" src="https://www.google.com/maps?q=Og%C5%82%C4%99czyzna+20,+31-589+Krak%C3%B3w&output=embed"></iframe></div></div></section>'''
    out += wsr('shop-real.jpg', t['home']['wsr_eb'], c['ws_h'])
    out += form(l) + footer(l) + scripts()
    return out


FN = dict(index=page_index, excavators=page_exc, loaders=page_load, works=page_works, contacts=page_contacts)

if __name__ == '__main__':
    for l in LANGS:
        os.makedirs(os.path.join(ROOT, l), exist_ok=True)
        for p in PAGES:
            open(os.path.join(ROOT, l, p + '.html'), 'w', encoding='utf-8').write(typo(FN[p](l), l))
    open(os.path.join(ROOT, 'index.html'), 'w').write('<!doctype html><meta charset="utf-8"><script>var l=(navigator.language||"ru").slice(0,2);location.replace((["ru","pl","en"].indexOf(l)>-1?l:"en")+"/index.html")</script><noscript><a href="en/index.html">EN</a></noscript>')
    print('built')
