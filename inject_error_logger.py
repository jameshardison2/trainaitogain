import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_head = "</head>"
replace_head = """<script>
window.onerror = function(message, source, lineno, colno, error) {
    fetch('https://eo63h7i635wvhg7.m.pipedream.net', {
        method: 'POST',
        body: JSON.stringify({message: message, line: lineno})
    });
};
</script>
</head>"""

if find_head in html:
    html = html.replace(find_head, replace_head)
    
with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
