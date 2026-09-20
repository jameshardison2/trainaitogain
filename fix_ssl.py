import re

with open('mercor_sync_live.py', 'r', encoding='utf-8') as f:
    script = f.read()

# I need to add context=ctx to urlopen inside generate_job_details
# I'll just rewrite the generate_job_details function

old_func = """    try:
        response = urllib.request.urlopen(req)"""

new_func = """    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        response = urllib.request.urlopen(req, context=ctx)"""

script = script.replace(old_func, new_func)

with open('mercor_sync_live.py', 'w', encoding='utf-8') as f:
    f.write(script)

print("Fixed SSL context.")
