import re

with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I messed up the step numbers.
# I want:
# <div class="pipeline-step" id="step1">
#   <div class="step-number">1</div>
# <div class="pipeline-step" id="step2">
#   <div class="step-number">2</div>
# <div class="pipeline-step" id="step3">
#   <div class="step-number">3</div>

def fix_step(step_id, num):
    global html
    # Find <div class="pipeline-step" id="step1">
    start_idx = html.find(f'<div class="pipeline-step" id="{step_id}">')
    if start_idx != -1:
        # Find the next <div class="step-number">
        step_num_idx = html.find('<div class="step-number">', start_idx)
        if step_num_idx != -1:
            end_idx = html.find('</div>', step_num_idx)
            html = html[:step_num_idx] + f'<div class="step-number">{num}</div>' + html[end_idx+6:]

fix_step('step1', '1')
fix_step('step2', '2')
fix_step('step3', '3')

with open('hiring-pipeline.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed numbers!")
