from bs4 import BeautifulSoup
import re

with open("apply.html", "r", encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

cards = soup.find_all("div", class_="opp-card")
for card in cards:
    # find h3
    h3 = card.find('h3')
    if not h3: continue
    
    # get text excluding the span
    title = ''.join([str(c) for c in h3.contents if isinstance(c, str)]).strip()
    
    # find pay
    pay_div = card.find('div', string=re.compile(r'\$\d+/hr'))
    pay = pay_div.text.strip() if pay_div else "$100/hr"
    
    # find domain
    domain_div = card.find('div', string=re.compile(r'SOFTWARE|GENERAL|MEDICAL|FINANCE'))
    domain = domain_div.text.strip().lower() if domain_div else "general"
    
    # find Apply Now button
    apply_btn = card.find('button', string=re.compile(r'Apply Now'))
    if apply_btn:
        # Check if save button already exists
        parent = apply_btn.parent
        existing_save = parent.find('button', string=re.compile(r'💾'))
        if not existing_save:
            # Create new button
            save_btn = soup.new_tag('button')
            save_btn['onclick'] = f"saveRole('{title.replace(chr(39), chr(92)+chr(39))}', '{domain}', '{pay}')"
            save_btn['style'] = "background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;"
            save_btn['onmouseover'] = "this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';"
            save_btn['onmouseout'] = "this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';"
            save_btn.string = "💾"
            
            apply_btn.insert_after(save_btn)
            
with open("apply.html", "w", encoding='utf-8') as f:
    f.write(str(soup))
