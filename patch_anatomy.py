import re

with open('articles/anatomy-of-a-failed-ai-interview.html', 'r') as f:
    content = f.read()

# Replace Title
content = re.sub(r'<title>.*?</title>', '<title>Anatomy of a Failed AI Interview - TrainAIToGain</title>', content)
content = re.sub(r'<h1.*?>.*?</h1>', '<h1 style="font-size:40px; font-weight:800; color:var(--black); line-height:1.1; margin-bottom:24px; letter-spacing:-0.03em;">Anatomy of a Failed AI Interview</h1>', content)

new_body = """
<p style="font-size:18px; color:var(--gray-600); line-height:1.6; margin-bottom:32px;">Why do highly qualified senior engineers fail automated video screeners? We break down the top 3 reasons AI bots flag you, and how to fix them.</p>

<h2 style="font-size:24px; font-weight:800; color:var(--black); margin-top:40px; margin-bottom:16px;">1. Gaze Aversion & Confidence Tracking</h2>
<p style="font-size:16px; color:var(--gray-600); line-height:1.6; margin-bottom:24px;">AI systems don't just transcribe your words; they track your eye movement. Looking away constantly or reading off a secondary monitor is often flagged as "hesitation" or "low confidence." You must speak directly into the lens as if it were a human.</p>

<h2 style="font-size:24px; font-weight:800; color:var(--black); margin-top:40px; margin-bottom:16px;">2. Poor STAR Structure</h2>
<p style="font-size:16px; color:var(--gray-600); line-height:1.6; margin-bottom:24px;">Human recruiters can infer context if you ramble. AI models map your transcript against a strict rubric. If you miss the "Result" (R) or "Impact" of your story, the NLP engine physically cannot score you highly. Every answer must cleanly follow Situation, Task, Action, Result.</p>

<h2 style="font-size:24px; font-weight:800; color:var(--black); margin-top:40px; margin-bottom:16px;">3. Missing Quantified Metrics</h2>
<p style="font-size:16px; color:var(--gray-600); line-height:1.6; margin-bottom:24px;">Saying "I improved the backend" scores a 4/10. Saying "I reduced latency by 45ms, saving $12,000 in monthly compute" scores a 10/10. AI models are strictly programmed to hunt for numbers, percentages, and dollar amounts as proof of impact.</p>

<div style="background:var(--primary-light); padding:24px; border-radius:12px; margin-top:40px;">
<h3 style="font-size:20px; font-weight:800; color:var(--primary-dark); margin-bottom:12px;">Practice makes perfect.</h3>
<p style="font-size:16px; color:var(--primary-dark); margin-bottom:16px;">Don't let your first time speaking to an AI be during the real interview. Test your delivery, filler-word count, and STAR structure right now.</p>
<a href="../ai-interview.html" style="display:inline-block; background:var(--primary); color:white; padding:12px 24px; border-radius:8px; font-weight:700; text-decoration:none;">Launch Live AI Mock Interview ➔</a>
</div>
"""

content = re.sub(r'(<h1.*?>.*?</h1>).*?(<div style="background:var\(--gray-100\); padding:32px; border-radius:16px; margin-top:64px;">)', r'\1' + new_body + r'\2', content, flags=re.DOTALL)

with open('articles/anatomy-of-a-failed-ai-interview.html', 'w') as f:
    f.write(content)
