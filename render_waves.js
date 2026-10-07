// render_waves.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    function filterJobs() {
        var term = searchInput_1 ? searchInput_1.value.toLowerCase() : '';
        var domain = domainFilter_1 ? domainFilter_1.value : 'ALL';
        var loc = locationFilter_1 ? locationFilter_1.value : 'ALL';
        var sort = sortFilter_1 ? sortFilter_1.value : 'DEFAULT';
        // Update individual cards
        var cards = carouselWrapper_1.querySelectorAll('.opp-card');
        var cardsArray = Array.from(cards);
        cardsArray.forEach(function (card) {
            var _a, _b;
            var text = ((_a = card.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            var cardDomain = card.getAttribute('data-domain');
            var cardPlatform = ((_b = card.getAttribute('data-platform')) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || '';
            var cardLoc = card.getAttribute('data-location');
            var matchesSearch = text.includes(term);
            var matchesDomain = true;
            if (domain !== 'ALL') {
                if (domain === 'MICRO1' || domain === 'MERCOR') {
                    matchesDomain = cardPlatform === domain;
                }
                else {
                    matchesDomain = cardDomain === domain;
                }
            }
            var matchesLoc = true;
            if (loc !== 'ALL') {
                matchesLoc = (cardLoc === loc);
            }
            if (matchesSearch && matchesDomain && matchesLoc) {
                card.style.display = 'flex';
            }
            else {
                card.style.display = 'none';
            }
        });
        // Handle Sorting using Flex Order
        var containerWrappers = carouselWrapper_1.querySelectorAll('.carousel-container');
        containerWrappers.forEach(function (container) {
            var containerCards = Array.from(container.querySelectorAll('.opp-card'));
            if (sort === 'PAY_HIGH') {
                containerCards.sort(function (a, b) {
                    return parseInt(b.getAttribute('data-pay') || '0') - parseInt(a.getAttribute('data-pay') || '0');
                });
            }
            else {
                containerCards.sort(function (a, b) {
                    return parseInt(a.getAttribute('data-index') || '0') - parseInt(b.getAttribute('data-index') || '0');
                });
            }
            // Assign order
            containerCards.forEach(function (c, i) {
                c.style.order = i.toString();
            });
        });
        // Hide empty category carousels
        var wrappers = carouselWrapper_1.querySelectorAll('.category-wrapper');
        var totalVisibleCards = 0;
        wrappers.forEach(function (wrapper) {
            var visibleCards = Array.from(wrapper.querySelectorAll('.opp-card')).filter(function (c) { return c.style.display !== 'none'; });
            totalVisibleCards += visibleCards.length;
            if (visibleCards.length === 0) {
                wrapper.style.display = 'none';
            }
            else {
                wrapper.style.display = 'block';
            }
        });
        var noResultsMsg = document.getElementById('no-results-msg');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-msg';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '64px 20px';
            noResultsMsg.style.color = 'var(--gray-500)';
            noResultsMsg.style.fontSize = '18px';
            noResultsMsg.innerHTML = '<span style="font-size:32px; display:block; margin-bottom:12px;">🔍</span> No open roles match your specific search criteria.<br><span style="font-size:15px; margin-top:8px; display:block;">Try broadening your filters or check back tomorrow for new waves.</span>';
            carouselWrapper_1.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = totalVisibleCards === 0 ? 'block' : 'none';
    }
    var response, data_1, carouselWrapper_1, categories, html_1, carouselsSection, searchInput_1, domainFilter_1, locationFilter_1, sortFilter_1, allCards, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch('waves.json')];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("HTTP error! status: ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data_1 = _a.sent();
                carouselWrapper_1 = document.createElement('div');
                carouselWrapper_1.style.marginBottom = '48px';
                carouselWrapper_1.style.position = 'relative';
                categories = [
                    { id: 'carousel-software', name: 'Software & Tech Pipelines', icon: '💻', domain: 'SOFTWARE' },
                    { id: 'carousel-medical', name: 'Medical & Clinical Pipelines', icon: '⚕️', domain: 'MEDICAL' },
                    { id: 'carousel-finance', name: 'Finance & Quant Pipelines', icon: '📈', domain: 'FINANCE' },
                    { id: 'carousel-legal', name: 'Translation & Law Pipelines', icon: '⚖️', domain: 'LEGAL' },
                    { id: 'carousel-general', name: 'Generalist & Content Pipelines', icon: '📋', domain: 'GENERAL' }
                ];
                html_1 = "\n      <div style=\"background:var(--gray-100); border-left:4px solid var(--primary); padding:16px; margin-bottom:48px; border-radius:8px;\">\n        <h4 style=\"margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;\">What to expect after you click Apply:</h4>\n        <ul style=\"margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;\">\n          <li>First, create your account on the partner platform (Mercor or Micro1).</li>\n          <li>Next, complete a roughly 20-minute AI interview (audio/video).</li>\n          <li>Finally, matching can take a few days. Silence doesn't mean you're rejected\u2014just keep an eye on your inbox!</li>\n        </ul>\n      </div>\n    ";
                html_1 += "\n      <div style=\"display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;\">\n        <input type=\"text\" id=\"jobSearchInput\" placeholder=\"Search roles (e.g. Python, Medical)...\" style=\"flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);\">\n        <select id=\"jobDomainFilter\" style=\"appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);\">\n            <option value=\"ALL\">All Categories</option>\n            <option value=\"SOFTWARE\">Software & Engineering</option>\n            <option value=\"GENERAL\">General & Expert</option>\n            <option value=\"MEDICAL\">Medical & Clinical</option>\n            <option value=\"FINANCE\">Finance & Economics</option>\n            <option value=\"LEGAL\">Legal & Compliance</option>\n            <option value=\"MICRO1\">Micro1 Roles</option>\n            <option value=\"MERCOR\">Mercor Roles</option>\n        </select>\n        <select id=\"jobLocationFilter\" style=\"appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);\">\n            <option value=\"ALL\">All Locations</option>\n            <option value=\"US\">US Based</option>\n            <option value=\"INTL\">International</option>\n        </select>\n        <select id=\"jobSortFilter\" style=\"appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);\">\n            <option value=\"DEFAULT\">Recommended Sort</option>\n            <option value=\"PAY_HIGH\">Highest Paying</option>\n        </select>\n      </div>\n    ";
                categories.forEach(function (cat) {
                    var categoryRoles = data_1.roles.filter(function (r) { return r.domain === cat.domain; });
                    if (categoryRoles.length === 0)
                        return; // Skip empty categories
                    html_1 += "\n        <div class=\"category-wrapper\">\n        <div style=\"display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:48px;\">\n          <div style=\"width:40px; height:40px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;\">".concat(cat.icon, "</div>\n          <h2 style=\"font-size:24px; font-weight:800; color:var(--black); margin:0;\">").concat(cat.name, "</h2>\n        </div>\n        \n        <div style=\"position:relative;\">\n          <button class=\"carousel-btn\" style=\"position:absolute; left:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;\" onmouseover=\"this.style.background='var(--orange)'; this.style.color='white';\" onmouseout=\"this.style.background='white'; this.style.color='var(--orange)';\" onclick=\"document.getElementById('").concat(cat.id, "')?.scrollBy({left: -320, behavior: 'smooth'})\">\u2039</button>\n          <button class=\"carousel-btn\" style=\"position:absolute; right:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;\" onmouseover=\"this.style.background='var(--orange)'; this.style.color='white';\" onmouseout=\"this.style.background='white'; this.style.color='var(--orange)';\" onclick=\"document.getElementById('").concat(cat.id, "')?.scrollBy({left: 320, behavior: 'smooth'})\">\u203A</button>\n          \n          <div id=\"").concat(cat.id, "\" style=\"display:flex; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; gap:20px; padding: 12px 16px 24px; margin: -12px -16px -24px; -webkit-overflow-scrolling:touch;\">\n            <style>\n              #").concat(cat.id, "::-webkit-scrollbar { display: none; }\n            </style>\n      ");
                    categoryRoles.forEach(function (role, index) {
                        var payYearly = 0;
                        var pStr = (role.pay || '').toLowerCase().replace(/,/g, '');
                        var m = pStr.match(/(\d+)/);
                        if (m) {
                            var val = parseInt(m[1]);
                            if (pStr.includes('k'))
                                val *= 1000;
                            if (pStr.includes('/hr'))
                                payYearly = val * 2000;
                            else if (pStr.includes('/mo'))
                                payYearly = val * 12;
                            else
                                payYearly = val;
                        }
                        var loc = 'ALL';
                        var searchStr = (role.title + ' ' + (role.tags || []).join(' ')).toLowerCase();
                        if (searchStr.includes('(us)') || searchStr.includes('us-based') || searchStr.includes('us only') || searchStr.includes('united states')) {
                            loc = 'US';
                        }
                        else if (searchStr.includes('india') || searchStr.includes('latam') || searchStr.includes('uk-based') || searchStr.includes('bilingual')) {
                            loc = 'INTL';
                        }
                        var tagsHtml = role.tags.map(function (t) { return "<span style=\"background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;\">".concat(t, "</span>"); }).join('');
                        var bg = role.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
                        var safeTitle = role.title.replace(/'/g, "\'");
                        var safeDomain = role.domain.replace(/'/g, "\'");
                        var safePay = role.pay.replace(/'/g, "\'");
                        html_1 += "\n          <div class=\"feature-card opp-card\" data-domain=\"".concat(role.domain, "\" data-platform=\"").concat(role.platform || 'Mercor', "\" data-pay=\"").concat(payYearly, "\" data-location=\"").concat(loc, "\" data-index=\"").concat(index, "\" style=\"flex:0 0 320px; order:").concat(index, "; scroll-snap-align:start; background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);\">\n            <div style=\"display:flex; justify-content:space-between; margin-bottom:16px; align-items:center;\">\n              <div style=\"display:flex; gap:8px;\">\n              <button style=\"flex:1; text-align:center; background:var(--white); border:2px solid var(--primary); color:var(--primary); font-weight:800; font-size:14px; padding:12px; border-radius:6px; transition:all 0.2s; cursor:pointer;\" onmouseover=\"this.style.background='var(--primary)'; this.style.color='var(--white)';\" onmouseout=\"this.style.background='var(--white)'; this.style.color='var(--primary)';\" onclick=\"window.handleApplyClick('").concat(safeTitle, "', '").concat(role.linkTarget || 'https://t.mercor.com/wbPMF', "', this)\">Apply Now</button>\n              <button onclick=\"saveRole('").concat(safeTitle, "', '").concat(safeDomain, "', '").concat(safePay, "', this, '").concat(role.linkTarget || 'https://t.mercor.com/wbPMF', "')\" style=\"background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-600); padding:0 12px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;\" onmouseover=\"this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';\" onmouseout=\"this.style.background='var(--gray-100)'; this.style.color='var(--gray-600)';\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"></path><polyline points=\"17 21 17 13 7 13 7 21\"></polyline><polyline points=\"7 3 7 8 15 8\"></polyline></svg></button>\n              <button onclick=\"markAsComplete('").concat(safeTitle, "', '").concat(safeDomain, "', '").concat(safePay, "', this)\" style=\"background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-600); padding:0 12px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;\" onmouseover=\"this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';\" onmouseout=\"this.style.background='var(--gray-100)'; this.style.color='var(--gray-600)';\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg></button>\n              <button onclick=\"window.open('resume-ats-guide.html?role=' + encodeURIComponent('").concat(safeTitle, "'), '_blank');\" style=\"background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-600); padding:0 12px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;\" onmouseover=\"this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';\" onmouseout=\"this.style.background='var(--gray-100)'; this.style.color='var(--gray-600)';\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"6\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle></svg></button>\n            </div>\n            <div style=\"text-align:center; font-size:11px; color:var(--gray-500); margin-top:8px; font-weight:600;\">Takes 3 mins \u2022 Have your PDF resume ready</div>\n          </div>\n        ");
                    });
                    html_1 += "</div></div></div>";
                });
                carouselWrapper_1.innerHTML = html_1;
                carouselsSection = document.querySelector('.section .container');
                if (carouselsSection && carouselsSection.firstChild) {
                    carouselsSection.insertBefore(carouselWrapper_1, carouselsSection.firstChild);
                }
                searchInput_1 = document.getElementById('jobSearchInput');
                domainFilter_1 = document.getElementById('jobDomainFilter');
                locationFilter_1 = document.getElementById('jobLocationFilter');
                sortFilter_1 = document.getElementById('jobSortFilter');
                searchInput_1 === null || searchInput_1 === void 0 ? void 0 : searchInput_1.addEventListener('input', filterJobs);
                domainFilter_1 === null || domainFilter_1 === void 0 ? void 0 : domainFilter_1.addEventListener('change', filterJobs);
                locationFilter_1 === null || locationFilter_1 === void 0 ? void 0 : locationFilter_1.addEventListener('change', filterJobs);
                sortFilter_1 === null || sortFilter_1 === void 0 ? void 0 : sortFilter_1.addEventListener('change', filterJobs);
                locationFilter_1 === null || locationFilter_1 === void 0 ? void 0 : locationFilter_1.addEventListener('change', filterJobs);
                sortFilter_1 === null || sortFilter_1 === void 0 ? void 0 : sortFilter_1.addEventListener('change', filterJobs);
                allCards = document.querySelectorAll('.opp-card');
                allCards.forEach(function (card) {
                    var _a;
                    var htmlCard = card;
                    // Don't update the ones we just injected in our new wrapper
                    if (carouselWrapper_1.contains(htmlCard))
                        return;
                    var titleEl = htmlCard.querySelector('h3');
                    if (!titleEl)
                        return;
                    var title = (_a = titleEl.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!title)
                        return;
                    // A) Remove Closed Roles
                    if (data_1.closedRoles && data_1.closedRoles.includes(title)) {
                        htmlCard.remove();
                        return;
                    }
                    // B) Update Active Roles
                    var matchingRole = data_1.roles.find(function (r) { return r.title === title; });
                    if (matchingRole) {
                        // Update Pay
                        var payEl = htmlCard.querySelector('div[style*="font-size:18px"]');
                        if (payEl)
                            payEl.textContent = matchingRole.pay;
                        // Update Description
                        var descEl = htmlCard.querySelector('p');
                        if (descEl)
                            descEl.textContent = matchingRole.description;
                        // Add/Update Status Badge next to Domain Badge
                        // Find the container holding the domain badge
                        var badgesContainer = htmlCard.querySelector('.opp-card > div:first-child > div:first-child');
                        if (badgesContainer) {
                            // Check if status badge already exists
                            var statusBadge = badgesContainer.querySelector('.dynamic-status');
                            var bg = matchingRole.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
                            if (!statusBadge) {
                                statusBadge = document.createElement('div');
                                statusBadge.className = 'dynamic-status';
                                statusBadge.style.padding = '6px 10px';
                                statusBadge.style.borderRadius = '6px';
                                statusBadge.style.fontSize = '11px';
                                statusBadge.style.fontWeight = '700';
                                statusBadge.style.letterSpacing = '0.05em';
                                statusBadge.style.textTransform = 'uppercase';
                                // Make sure container is flex
                                badgesContainer.style.display = 'flex';
                                badgesContainer.style.gap = '8px';
                                badgesContainer.appendChild(statusBadge);
                            }
                            statusBadge.style.background = bg;
                            statusBadge.style.color = 'white';
                            statusBadge.textContent = matchingRole.status;
                        }
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error rendering waves:", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
