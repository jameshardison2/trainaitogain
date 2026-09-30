with open("render_waves.ts", "r") as f:
    content = f.read()

expectation_text = """
      <div style="background:var(--gray-100); border-left:4px solid var(--primary); padding:16px; margin-bottom:24px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;">What to expect after you click Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li>First, create your account on the partner platform (Mercor or Micro1).</li>
          <li>Next, complete a roughly 20-minute AI interview (audio/video).</li>
          <li>Finally, matching can take a few days. Silence doesn't mean you're rejected—just keep an eye on your inbox!</li>
        </ul>
      </div>
"""

content = content.replace("<div style=\"display:flex; flex-wrap:wrap; gap:16px; margin-bottom:24px;\">", expectation_text + "      <div style=\"display:flex; flex-wrap:wrap; gap:16px; margin-bottom:24px;\">")

with open("render_waves.ts", "w") as f:
    f.write(content)

