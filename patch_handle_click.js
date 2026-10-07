const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

const oldHandle = `(window as any).handleApplyClick = (title: string, link: string, btn: HTMLElement) => {
    btn.innerHTML = 'Taking you to the official application portal...';
    btn.style.opacity = '0.8';
    setTimeout(() => {
        window.open(link, '_blank');
        btn.innerHTML = 'Apply Now';
        btn.style.opacity = '1';
    }, 800);
};`;

const newHandle = `(window as any).handleApplyClick = (title: string, link: string, btn: HTMLElement) => {
    // Look for openApplyModal on the global window
    if (typeof (window as any).openApplyModal === 'function') {
        (window as any).openApplyModal(title, link);
    } else {
        // Fallback if modal script isn't loaded
        btn.innerHTML = 'Taking you to the official application portal...';
        btn.style.opacity = '0.8';
        setTimeout(() => {
            window.open(link, '_blank');
            btn.innerHTML = 'Apply Now';
            btn.style.opacity = '1';
        }, 800);
    }
};`;

code = code.replace(oldHandle, newHandle);

fs.writeFileSync('render_waves.ts', code);
console.log("Patched handleApplyClick in render_waves.ts successfully.");
