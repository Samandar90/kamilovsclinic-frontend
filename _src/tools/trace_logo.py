# Traces the flat-colour RGBA brand PNG into SVG logo variants.
import sys, os, re
import numpy as np
from PIL import Image
import potrace

SRC = r"C:\Users\Samandar\Desktop\kamilovs clinic\site\images\Лого Camilovs‘ Полноцветный RGB.png"
OUT = sys.argv[1]
SCALE = 3
NAVY, CYAN, GREEN = '#022a47', '#00a3bb', '#43b19a'
im = Image.open(SRC).convert('RGBA')
W, H = im.size
big = im.resize((W*SCALE, H*SCALE), Image.LANCZOS)
a = np.asarray(big).astype(float)
rgb, alpha = a[...,:3], a[...,3]/255
targets = {'navy':(0x02,0x2a,0x47),'cyan':(0x00,0xa3,0xbb),'green':(0x43,0xb1,0x9a),'white':(255,255,255)}
stack = np.stack([np.linalg.norm(rgb-np.array(c),axis=-1) for c in targets.values()],axis=-1)
winner = stack.argmin(axis=-1)
from PIL import ImageFilter
def grow(m, px):
    return np.asarray(Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(px*2+1)))>127
near = stack.min(axis=-1) < 70
masks = {n:(winner==i)&(alpha>0.5)&near for i,n in enumerate(targets)}
masks['navy'] = (winner==0)&(alpha>0.5)
for n in ('cyan','green','white'):
    masks[n] = grow(masks[n], 3)

def curves(mask):
    bm = potrace.Bitmap(~mask)      # potracer treats False as ink
    return bm.trace(turdsize=30, alphamax=1.2, opticurve=True, opttolerance=2.2)

def path_d(curve):
    s = 1/SCALE
    R = lambda v: round(v*s*2)/2          # half-pixel grid on the 1152-wide artboard
    def num(v):
        t = f"{v:g}"
        return t[1:] if t.startswith('0.') else ('-'+t[2:] if t.startswith('-0.') else t)
    x, y = R(curve.start_point.x), R(curve.start_point.y)
    d = [f"M{num(x)} {num(y)}"]
    def rel(p):
        return R(p.x)-x, R(p.y)-y
    for seg in curve.segments:
        if seg.is_corner:
            cx, cy = rel(seg.c); d.append(f"l{num(cx)} {num(cy)}")
            x += cx; y += cy
            ex, ey = rel(seg.end_point); d.append(f"l{num(ex)} {num(ey)}")
            x += ex; y += ey
        else:
            a, b = rel(seg.c1); c, e = rel(seg.c2); f, g = rel(seg.end_point)
            d.append(f"c{num(a)} {num(b)} {num(c)} {num(e)} {num(f)} {num(g)}")
            x += f; y += g
    d.append('z')
    return ''.join(d)

def bbox_curve(curve):
    pts=[curve.start_point]
    for seg in curve.segments:
        pts += [seg.c, seg.end_point] if seg.is_corner else [seg.c1, seg.c2, seg.end_point]
    xs=[p.x/SCALE for p in pts]; ys=[p.y/SCALE for p in pts]
    return min(xs),min(ys),max(xs),max(ys)

def pl_paths(mask):
    out=[]
    for c in curves(mask):
        d=path_d(c); out.append((bbox_curve(c),d))
    return out

navy = pl_paths(masks['navy'])
def largest(paths):
    return [max(paths, key=lambda t:(t[0][2]-t[0][0])*(t[0][3]-t[0][1]))]
cyan = largest(pl_paths(masks['cyan']))
green = [t for t in pl_paths(masks['green']) if t[0][2]-t[0][0] > 250 and t[0][3] < 520]
white = largest(pl_paths(masks['white']))
for n,l in [('navy',navy),('cyan',cyan),('green',green),('white',white)]:
    print(n,[[round(v) for v in b] for b,_ in l])

def inside(b, box):
    return b[0]>=box[0]-1 and b[1]>=box[1]-1 and b[2]<=box[2]+1 and b[3]<=box[3]+1

# navy groups. Holes in letters (e.g. the a, o bowls) land in the same box, evenodd fills them correctly.
WORD=(140,700,1012,885); CLINIC=(460,905,684,995)
TOOTH=(626,300,905,625); CROSS=(250,88,618,616); HEART=(440,212,782,524)
word=[d for b,d in navy if inside(b,WORD)]
clinic=[d for b,d in navy if inside(b,CLINIC)]
mark_lines=[(b,d) for b,d in navy if b[3]<640]
tooth_line=[d for b,d in mark_lines if inside(b,TOOTH)]
cross_line=[d for b,d in mark_lines if inside(b,CROSS) and not inside(b,HEART) and not inside(b,TOOTH)]
heart_line=[d for b,d in mark_lines if inside(b,HEART) and not inside(b,TOOTH) and d not in cross_line]
print('groups word',len(word),'clinic',len(clinic),'tooth',len(tooth_line),'cross',len(cross_line),'heart',len(heart_line),'marklines',len(mark_lines))

j=lambda L:' '.join(L)
cyan_d=j([d for _,d in cyan]); green_d=j([d for _,d in green]); white_d=j([d for _,d in white])

def p(fill,d): return f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/>'
def mark_color():
    return p(CYAN,cyan_d)+p(GREEN,green_d)+p('#fff',white_d)+p(NAVY,j([d for _,d in mark_lines]))
def mark_inverse():
    return p(CYAN,j(cross_line))+p(GREEN,j(heart_line))+p('#fff',j(tooth_line))
def mark_mono(col):
    return p(col,j([d for _,d in mark_lines]))

MX,MY,MW,MH=257,95,644,525
def wrap(vb,body,title='Kamilovs’ clinic'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'

def save(name,s):
    open(os.path.join(OUT,name),'w',encoding='utf-8').write(s); print(name,len(s))

# stacked (official lockup)
save('logo-stacked.svg',wrap(f'130 80 892 920',mark_color()+p(NAVY,j(word))+p(NAVY,j(clinic))))
save('logo-stacked-inverse.svg',wrap(f'130 80 892 920',mark_inverse()+p('#fff',j(word))+p(CYAN,j(clinic))))
# mark only
save('mark.svg',wrap(f'{MX-8} {MY-8} {MW+16} {MH+16}',mark_color()))
save('mark-inverse.svg',wrap(f'{MX-8} {MY-8} {MW+16} {MH+16}',mark_inverse()))

# horizontal lockup, for the header/footer
k=0.70                                  # mark scale
tw=854; th=986-707
mh=MH*k; mw=MW*k
gap=56
tx=mw+gap; ty=(mh-th)/2
tr_mark=f'translate({-MX*k:.1f} {-MY*k:.1f}) scale({k})'
tr_text=f'translate({tx-150:.1f} {ty-707:.1f})'
# ‘clinic’ is centred under the word in the stacked logo, here it aligns to the K
tr_clinic=f'translate({tx-468:.1f} {ty-707:.1f})'
vw=tx+tw+4; vh=max(mh,th)
def h(body_mark,word_fill,clinic_fill):
    return wrap(f'-4 -4 {vw+8:.0f} {vh+8:.0f}',f'<g transform="{tr_mark}">{body_mark}</g><g transform="{tr_text}">{p(word_fill,j(word))}</g><g transform="{tr_clinic}">{p(clinic_fill,j(clinic))}</g>')
save('logo.svg',h(mark_color(),NAVY,NAVY))
save('logo-inverse.svg',h(mark_inverse(),'#fff',CYAN))
