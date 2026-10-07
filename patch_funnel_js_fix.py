import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_js = r"""        document.getElementById('dash-total').innerText = total;
        document.getElementById('dash-contacted').innerText = contacted;
        document.getElementById('dash-replied').innerText = replied;
        document.getElementById('dash-hired').innerText = hired;"""

new_js = r"""        document.getElementById('dash-total').innerText = total;
        document.getElementById('dash-contacted').innerText = contacted;
        document.getElementById('dash-replied').innerText = replied;
        document.getElementById('dash-hired').innerText = hired;
        
        // Update inline funnel in queue screen
        const fTotal = document.getElementById('funnel-total');
        if (fTotal) {
            fTotal.innerText = total;
            document.getElementById('funnel-contacted').innerText = contacted;
            document.getElementById('funnel-replied').innerText = replied;
            document.getElementById('funnel-hired').innerText = hired;
        }"""

content = content.replace(old_js, new_js)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
