const fs = require('fs');

const tooltipCSS = `
/* 10. Layman Hover Tooltips */
[data-tooltip] {
  position: relative;
}
[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: rgba(15, 23, 42, 0.95);
  color: #f8fafc;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: normal;
  width: max-content;
  max-width: 250px;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.5);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000000;
  pointer-events: none;
}
/* Tooltip Arrow */
[data-tooltip]::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  border-width: 6px;
  border-style: solid;
  border-color: rgba(16, 185, 129, 0.5) transparent transparent transparent;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000000;
  pointer-events: none;
}
[data-tooltip]:hover::before,
[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
[data-tooltip]:hover::after {
  transform: translateX(-50%) translateY(6px);
}
`;

fs.appendFileSync('extension/styles.css', tooltipCSS);
console.log('styles.css updated with tooltips!');
