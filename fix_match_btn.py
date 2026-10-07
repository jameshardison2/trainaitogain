with open("render_waves.ts", "r") as f:
    content = f.read()

content = content.replace("document.getElementById('aws-file-input').click()", "window.open('resume-ats-guide.html', '_blank')")

with open("render_waves.ts", "w") as f:
    f.write(content)

with open("apply.html", "r") as f:
    content = f.read()

content = content.replace("document.getElementById('aws-file-input').click()", "window.open('resume-ats-guide.html', '_blank')")

# Except we still want the BIG "Fast-Track: Match My Resume" button to work if there is one?
# Wait, the big "Fast-Track: Match My Resume" doesn't use `document.getElementById('aws-file-input').click()`, it IS the input!
# `<div id="aws-upload-zone" ... onclick="document.getElementById('aws-file-input').click();">` -- wait, no, the upload zone just contains the `<input type="file" id="aws-file-input" ...>` so it doesn't need click.
# But wait, what if `onclick="document.getElementById('aws-file-input').click()"` WAS used on the big button?
# Let's check `apply.html` just to be safe.

with open("apply.html", "w") as f:
    f.write(content)
