import re

with open('/Users/176693/Documents/trainaitogain_site_seo_ready/ai-interview_1.html', 'r') as f:
    old_content = f.read()

# Get the body content of ai-interview_1.html
# It uses <main><div class="wrap"> ... </div></main>
body_match = re.search(r'<main><div class="wrap">(.*?)</div></main>', old_content, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    
    # We will inject this into ai-interview.html which currently has <div class="article-content">
    with open('/Users/176693/Documents/trainaitogain_site_seo_ready/ai-interview.html', 'r') as f:
        new_content = f.read()
        
    article_pattern = re.compile(r'<div class="article-content">.*?<!-- ─── Footer ─────────────────────────────────────────── -->', re.DOTALL)
    
    injected_body = f'<div class="article-content">\n    <div class="container" style="max-width:800px; margin:0 auto; padding:64px 20px;">\n{body_content}\n    </div>\n  </div>\n\n  <!-- ─── Footer ─────────────────────────────────────────── -->'
    
    final_content = article_pattern.sub(injected_body, new_content)
    
    with open('/Users/176693/Documents/trainaitogain_site_seo_ready/ai-interview.html', 'w') as f:
        f.write(final_content)
    print("Restored ai-interview.html body.")
