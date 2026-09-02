import re

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r'(<nav class="nav".*?</nav>)', index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Live Coding Sandbox — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
</head>
<body style="background:var(--gray-900); color:var(--white); display:flex; flex-direction:column; min-height:100vh;">

{header}

<section style="padding: 24px 0; flex:1; display:flex; flex-direction:column;">
  <div class="container" style="flex:1; display:flex; flex-direction:column; max-width:1400px; padding:0 24px;">
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
            <h1 style="font-size:28px; font-weight:800; margin-bottom:4px; color:var(--white);">Live Coding Sandbox</h1>
            <p style="color:var(--gray-400); font-size:14px; margin:0;">Practice technical evaluation tasks in our embedded Monaco Editor.</p>
        </div>
        <div style="display:flex; gap:12px;">
            <select id="language-select" style="background:var(--black); color:var(--white); border:1px solid var(--gray-700); padding:8px 12px; border-radius:4px; font-family:var(--font);">
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="rust">Rust</option>
            </select>
            <button onclick="runCode()" class="btn-primary">Run Code</button>
        </div>
    </div>

    <div style="display:flex; gap:24px; flex:1; min-height:600px;">
        <div style="flex:1; background:var(--black); border:1px solid var(--gray-700); border-radius:var(--radius); padding:24px; overflow-y:auto;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:var(--primary); font-weight:700; margin-bottom:8px;">Challenge</div>
            <h2 style="font-size:20px; font-weight:700; margin-bottom:12px; color:var(--white);">Detect Cycle in Linked List (O(1) Space)</h2>
            <p style="color:var(--gray-400); font-size:14px; line-height:1.6; margin-bottom:24px;">
                You are evaluating an LLM's logic for cycle detection. The model provided the code on the right. Does it work? Is it O(1) space? Fix any bugs you find and run the tests.
            </p>
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:var(--gray-500); font-weight:700; margin-bottom:8px;">Console Output</div>
            <div id="output-console" style="background:#111; color:#0f0; font-family:monospace; font-size:13px; padding:16px; border-radius:6px; min-height:200px; border:1px solid #333;">
                Waiting for execution...
            </div>
        </div>

        <div style="flex:2; border:1px solid var(--gray-700); border-radius:var(--radius); overflow:hidden; position:relative;">
            <div id="editor-container" style="width:100%; height:100%;"></div>
        </div>
    </div>
  </div>
</section>

{footer}

<!-- Monaco Editor Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js"></script>
<script>
    require.config({{ paths: {{ 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }} }});
    require(['vs/editor/editor.main'], function() {{
        window.editor = monaco.editor.create(document.getElementById('editor-container'), {{
            value: [
                'class ListNode:',
                '    def __init__(self, x):',
                '        self.val = x',
                '        self.next = None',
                '',
                'class Solution:',
                '    def hasCycle(self, head: ListNode) -> bool:',
                '        seen = set()',
                '        current = head',
                '        while current:',
                '            if current in seen:',
                '                return True',
                '            seen.add(current)',
                '            current = current.next',
                '        return False',
                '',
                '# NOTE: The LLM used O(n) space instead of O(1).',
                '# Please optimize it using Floyd\\'s Tortoise and Hare algorithm.',
                '# Then click "Run Code".'
            ].join('\\n'),
            language: 'python',
            theme: 'vs-dark',
            minimap: {{ enabled: false }},
            automaticLayout: true,
            fontSize: 14
        }});
        
        document.getElementById('language-select').addEventListener('change', function(e) {{
            monaco.editor.setModelLanguage(window.editor.getModel(), e.target.value);
            if (e.target.value === 'cpp') {{
                window.editor.setValue('// C++ code here\\n');
            }} else if (e.target.value === 'rust') {{
                window.editor.setValue('// Rust code here\\n');
            }}
        }});
    }});

    function runCode() {{
        const code = window.editor.getValue();
        const cons = document.getElementById('output-console');
        cons.innerHTML = '<span style="color:#a7f3d0;">Running tests...</span><br/>';
        
        // Mock evaluation logic
        setTimeout(() => {{
            if (code.includes('seen = set()')) {{
                cons.innerHTML += '<span style="color:#ef4444;">[FAIL] Space complexity is O(N) due to hash set. Target is O(1).</span><br/>';
            }} else if (code.includes('slow') && code.includes('fast') && code.includes('fast.next')) {{
                cons.innerHTML += '<span style="color:#34d399;">[PASS] Floyd\\'s Tortoise and Hare implemented correctly! O(1) space.</span><br/>';
                cons.innerHTML += '<span style="color:#34d399;">Score: 100/100</span>';
            }} else {{
                cons.innerHTML += '<span style="color:#f59e0b;">[WARN] Tests ran, but O(1) space constraints could not be verified. Check your logic.</span><br/>';
            }}
        }}, 800);
    }}
</script>

</body>
</html>
"""

with open("prep-coding.html", "w") as f:
    f.write(html)
print("Created prep-coding.html")
