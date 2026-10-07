with open('render_waves.ts', 'r') as f:
    ts = f.read()

ts = ts.replace("this.style.color='#10B981'", "const btn = event.currentTarget as HTMLElement; btn.style.color='#10B981'")
ts = ts.replace("this.style.color='var(--gray-400)'", "btn.style.color='var(--gray-400)'")

with open('render_waves.ts', 'w') as f:
    f.write(ts)
