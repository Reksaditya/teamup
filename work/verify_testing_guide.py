from pathlib import Path
import json
import pdfplumber
from PIL import Image, ImageOps, ImageDraw

root=Path(__file__).resolve().parents[1]
images=sorted((root/'work/pdf-preview').glob('teamup-*.png'))
assert len(images)==14
thumbs=[]
for index,path in enumerate(images,1):
    img=Image.open(path).convert('RGB')
    img.thumbnail((330,467))
    cell=Image.new('RGB',(350,500),'#e5e9ee')
    cell.paste(img,((350-img.width)//2,10))
    ImageDraw.Draw(cell).text((12,480),f'Halaman {index}',fill='#000321')
    thumbs.append(cell)
for start in [0,8]:
    subset=thumbs[start:start+8]
    canvas=Image.new('RGB',(350*4,500*((len(subset)+3)//4)),'#e5e9ee')
    for i,img in enumerate(subset):canvas.paste(img,((i%4)*350,(i//4)*500))
    canvas.save(root/f'work/pdf-preview/montage-{start+1}.png')

checks=[]
with pdfplumber.open(root/'outputs/Panduan_Pengujian_TeamUp.pdf') as pdf:
    for n,page in enumerate(pdf.pages,1):
        words=page.extract_words()
        bad=[w['text'] for w in words if w['x0']<45 or w['x1']>page.width-45 or w['top']<30 or w['bottom']>page.height-20]
        assert not bad,(n,bad)
        assert f'{n} / 14' in page.extract_text()
        checks.append({'page':n,'words':len(words),'bounds_ok':True,'footer_ok':True})
(root/'work/testing-guide-layout-checks.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
print('14 pages rendered; text boundaries and page footers verified.')
