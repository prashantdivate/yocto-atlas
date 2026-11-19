"""Build a local, page-addressable research index; never alter source PDFs."""
import json
import re
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
out = root / '.research'
out.mkdir(exist_ok=True)
topics = ['shell', 'permissions', 'process', 'toolchain', 'bootloader', 'device tree',
          'root filesystem', 'Buildroot', 'BitBake', 'override', 'sysroot', 'shared state',
          'package', 'SDK', 'devtool', 'systemd', 'driver', 'interrupt', 'memory',
          'network', 'GDB', 'ftrace', 'real-time', 'RAUC', 'security', 'license']
catalog = []
for path in sorted((root / 'Resources').glob('*.pdf')):
    reader = PdfReader(path)
    pages = [page.extract_text() or '' for page in reader.pages]
    title = next((' '.join(t.split())[:220] for t in pages[:3] if len(t.strip()) > 30), path.stem)
    entries = {topic: [i + 1 for i, text in enumerate(pages)
                        if topic.lower() in text.lower()] for topic in topics}
    (out / (path.stem + '.json')).write_text(json.dumps(pages, ensure_ascii=False), encoding='utf-8')
    catalog.append({'file': path.name, 'pages': len(pages), 'title': title,
                    'characters': sum(map(len, pages)), 'topics': entries})
    print(f'{path.name}: {len(pages)} pages, {sum(map(len, pages)):,} characters indexed', flush=True)
(out / 'catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Total: {sum(r["pages"] for r in catalog)} pages across {len(catalog)} PDFs')
