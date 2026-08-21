from pathlib import Path
p = Path('/home/ubuntu/proline/client/src/pages/Home.tsx')
s = p.read_text()
start = s.index('const legacySeedOrders: Order[] = [')
end = s.index('];', start) + 2
p.write_text(s[:start] + s[end:])
