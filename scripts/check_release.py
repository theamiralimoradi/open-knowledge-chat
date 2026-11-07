#!/usr/bin/env python3
"""Static release gate: fails on common embedded secrets and client-specific markers."""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
scan_ext = {'.php', '.js', '.css', '.md', '.txt', '.json', '.yml', '.yaml', '.html'}
# Build private markers from fragments so the checker doesn't flag its own source.
forbidden_literals = [
    ''.join(['teh', 'ran', 'peygostar']).lower(),
    ''.join(['gap', 'gpt']).lower(),
    ''.join(['LU', 'NA']).lower(),
    ''.join(['T', 'P', 'G']).lower(),
    ''.join(['ت', 'ه', 'ر', 'ا', 'ن']),
    ''.join(['پی', '‌', 'گستر']),
]
patterns = [
    re.compile(''.join([r'(?<![\\w])', 'sk', r'[-_][A-Za-z0-9_-]{16,}'])),
    re.compile(''.join([r'(?i)(?:api[_-]?key|token|password|authorization)\\s*[:=]\\s*', r'[\"\']?[A-Za-z0-9_-]{20,}'])),
]
issues = []
for p in root.rglob('*'):
    if not p.is_file() or p.suffix.lower() not in scan_ext or '.git' in p.parts:
        continue
    text = p.read_text(encoding='utf-8', errors='replace')
    lower = text.lower()
    for marker in forbidden_literals:
        # Avoid matching the ASCII prefix inside an unrelated word.
        if marker.lower() in lower:
            issues.append(f'{p.relative_to(root)}: forbidden client/provider marker')
            break
    for pattern in patterns:
        if pattern.search(text):
            issues.append(f'{p.relative_to(root)}: possible embedded credential')
            break

if issues:
    print('Release audit failed:')
    for issue in issues:
        print(' -', issue)
    sys.exit(1)
print('Release audit passed: no known client-specific markers or credential-like strings.')