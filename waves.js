"use strict";
// waves.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('waves.json');
        const data = yield response.json();
        const roles = data.roles;
        // 1. Render Index wave cards
        const indexGrid = document.querySelector('#waves .feature-grid');
        if (indexGrid) {
            indexGrid.innerHTML = '';
            roles.filter((r) => r.type === 'wave').forEach((role) => {
                const bgVar = role.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
                indexGrid.innerHTML += `
        <div class="feature-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="feature-card-title">${role.title}</div>
            <span style="background:${bgVar}; color:var(--white); padding:2px 8px; border-radius:12px; font-size:12px; font-weight:bold;">${role.status}</span>
          </div>
          <div class="feature-card-body">${role.description}</div>
        </div>
        `;
            });
        }
        // 2. Render Apply wave & evergreen cards
        const applyWaveTrack = document.querySelector('#waves-track');
        const applyEvergreenTrack = document.querySelector('#evergreen-track');
        if (applyWaveTrack) {
            applyWaveTrack.innerHTML = '';
            roles.filter((r) => r.type === 'wave').forEach((role) => {
                applyWaveTrack.innerHTML += `
          <div class="opp-card">
            <div class="opp-card-icon">${role.icon}</div>
            <div class="opp-card-title" style="font-size:18px; font-weight:800; margin-bottom:8px;">${role.title} (Active Wave)</div>
            <div class="opp-card-desc" style="font-size:14px; color:var(--gray-500); line-height:1.6; margin-bottom:16px;">${role.description}</div>
          </div>
        `;
            });
        }
        if (applyEvergreenTrack) {
            applyEvergreenTrack.innerHTML = '';
            roles.filter((r) => r.type === 'evergreen').forEach((role) => {
                applyEvergreenTrack.innerHTML += `
          <div class="opp-card">
            <div class="opp-card-icon">${role.icon}</div>
            <div class="opp-card-title" style="font-size:18px; font-weight:800; margin-bottom:8px;">${role.title}</div>
            <div class="opp-card-desc" style="font-size:14px; color:var(--gray-500); line-height:1.6; margin-bottom:16px;">${role.description}</div>
          </div>
        `;
            });
        }
        // 3. Render Affiliate wave summary
        const affiliateGrid = document.querySelector('#affiliate-waves-grid');
        if (affiliateGrid) {
            affiliateGrid.innerHTML = '';
            roles.filter((r) => r.type === 'wave').forEach((role) => {
                const bgVar = role.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
                affiliateGrid.innerHTML += `
        <div class="feature-card" style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 16px;">${role.title}</span>
          <span style="background: ${bgVar}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700;">${role.status}</span>
        </div>
        `;
            });
        }
    }
    catch (error) {
        console.error("Error loading wave data:", error);
    }
}));
