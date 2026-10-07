import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """      // Hide empty category carousels
      const wrappers = carouselWrapper.querySelectorAll('.category-wrapper');
      wrappers.forEach((wrapper: any) => {
        const visibleCards = Array.from(wrapper.querySelectorAll('.opp-card')).filter((c: any) => c.style.display !== 'none');
        if (visibleCards.length === 0) {
          wrapper.style.display = 'none';
        } else {
          wrapper.style.display = 'block';
        }
      });
    }"""

new_logic = """      // Hide empty category carousels
      const wrappers = carouselWrapper.querySelectorAll('.category-wrapper');
      let totalVisibleCards = 0;
      wrappers.forEach((wrapper: any) => {
        const visibleCards = Array.from(wrapper.querySelectorAll('.opp-card')).filter((c: any) => c.style.display !== 'none');
        totalVisibleCards += visibleCards.length;
        if (visibleCards.length === 0) {
          wrapper.style.display = 'none';
        } else {
          wrapper.style.display = 'block';
        }
      });
      
      let noResultsMsg = document.getElementById('no-results-msg');
      if (!noResultsMsg) {
         noResultsMsg = document.createElement('div');
         noResultsMsg.id = 'no-results-msg';
         noResultsMsg.style.textAlign = 'center';
         noResultsMsg.style.padding = '64px 20px';
         noResultsMsg.style.color = 'var(--gray-500)';
         noResultsMsg.style.fontSize = '18px';
         noResultsMsg.innerHTML = '<span style="font-size:32px; display:block; margin-bottom:12px;">🔍</span> No open roles match your specific search criteria.<br><span style="font-size:15px; margin-top:8px; display:block;">Try broadening your filters or check back tomorrow for new waves.</span>';
         carouselWrapper.appendChild(noResultsMsg);
      }
      noResultsMsg.style.display = totalVisibleCards === 0 ? 'block' : 'none';
    }"""

content = content.replace(old_logic, new_logic)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
