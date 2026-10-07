with open('apply.html', 'r') as f:
    content = f.read()

old_track = """      <h2 style="font-size:24px; font-weight:800; margin-bottom:24px;">Top 3 Recommended Roles for Your Profile</h2>
      <div id="matched-waves-track" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; padding: 12px 16px 24px; margin: 0 -16px 24px; -webkit-overflow-scrolling: touch; text-align: left;">"""

new_track = """      <h2 style="font-size:24px; font-weight:800; margin-bottom:24px;">Top 3 Recommended Roles for Your Profile</h2>
      <div style="position: relative;">
        <button class="scroll-btn scroll-left" onclick="document.getElementById('matched-waves-track').scrollBy({left:-340, behavior:'smooth'})" style="position:absolute; left:-16px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid var(--gray-200); width:40px; height:40px; border-radius:50%; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; color: var(--gray-700); font-size: 18px;">❮</button>
        <button class="scroll-btn scroll-right" onclick="document.getElementById('matched-waves-track').scrollBy({left:340, behavior:'smooth'})" style="position:absolute; right:-16px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid var(--gray-200); width:40px; height:40px; border-radius:50%; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; color: var(--gray-700); font-size: 18px;">❯</button>
        <div id="matched-waves-track" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; padding: 12px 16px 24px; margin: 0 -16px 24px; -webkit-overflow-scrolling: touch; text-align: left;">"""

content = content.replace(old_track, new_track)

old_end = """        </style>
        <!-- Injected via JS -->
      </div>
    </div>"""

new_end = """        </style>
        <!-- Injected via JS -->
      </div>
      </div>
    </div>"""

content = content.replace(old_end, new_end)

with open('apply.html', 'w') as f:
    f.write(content)
print("Arrows added")
