import os
import glob

# Files to delete
files_to_delete = [
    'prep-coding.html',
    'prep-casestudy.html',
    'prep-crossexam.html',
    'prep-hallucination.html'
]

for f in files_to_delete:
    if os.path.exists(f):
        os.remove(f)
        print(f"Deleted {f}")

# Update ai-interview.html
with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_skip = '<a href="prep-coding.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--gray-400)\'">Skip to Live Coding ➔</a>'
replace_skip = '<a href="post-hire.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--gray-400)\'">Skip to Post-Hire Guide ➔</a>'
html = html.replace(find_skip, replace_skip)

find_proceed = "proceedBtn.href = 'prep-coding.html';"
replace_proceed = "proceedBtn.href = 'post-hire.html';"
html = html.replace(find_proceed, replace_proceed)

find_proceed_txt = "proceedBtn.innerHTML = 'Next Step: Live Coding Sandbox ➔';"
replace_proceed_txt = "proceedBtn.innerHTML = 'Next Step: Post-Hire Guide ➔';"
html = html.replace(find_proceed_txt, replace_proceed_txt)

find_unlock = "Complete the simulation to unlock the next module, or skip ahead if you must."
replace_unlock = "Complete the simulation to unlock Step 3, or skip ahead if you must."
html = html.replace(find_unlock, replace_unlock)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated ai-interview.html links")
