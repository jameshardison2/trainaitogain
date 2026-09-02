import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    if filepath == 'index.html':
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()

    # Find all <a href="https://t.mercor.com/wbPMF" ...> ... </a>
    # and replace them with <button ... onclick="openApplyModal('content_button');"> ... </button>
    # EXCEPT for the one inside the modal (which has "Proceed to Priority Portal")
    
    def replace_link(match):
        full_tag = match.group(0)
        attrs = match.group(1)
        text = match.group(2)
        
        # Don't replace the modal button
        if "Proceed to Priority Portal" in text or "closeApplyModal()" in attrs:
            return full_tag
            
        # Don't replace nav_cta (it's handled by update_nav_footer)
        if "nav_cta" in attrs:
            return full_tag

        # Remove href and target
        attrs = re.sub(r'href="[^"]+"', '', attrs)
        attrs = re.sub(r'target="[^"]+"', '', attrs)
        
        # Add cursor pointer if not there
        if 'style="' in attrs:
            attrs = re.sub(r'style="', 'style="cursor:pointer; ', attrs)
        else:
            attrs += ' style="cursor:pointer;"'
            
        # Add or modify onclick
        if 'onclick="' in attrs:
            attrs = re.sub(r'onclick="([^"]+)"', r'onclick="\1 openApplyModal(\'content_button\');"', attrs)
        else:
            attrs += ' onclick="openApplyModal(\'content_button\');"'
            
        # Change background/border/etc for text decoration (buttons don't need text-decoration usually but it doesn't hurt)
        # Convert to button
        return f'<button {attrs}>{text}</button>'

    new_content = re.sub(r'<a\s+href="https://t.mercor.com/wbPMF"([^>]*)>(.*?)</a>', replace_link, content, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(new_content)

print("Updated links in all HTML files.")
