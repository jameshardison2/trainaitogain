  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

  const firebaseConfig = {
    projectId: "trainaitogain-50c19"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  let globalLeads = []; // Store leads in memory

  function maskEmail(email) {
    if (!email || !email.includes('@')) return email;
    const parts = email.split('@');
    const name = parts[0];
    const domain = parts[1];
    
    let maskedName = name;
    if (name.length > 2) {
      maskedName = name.substring(0, 2) + '*'.repeat(name.length - 2);
    } else {
      maskedName = name.substring(0, 1) + '*';
    }
    return `${maskedName}@${domain}`;
  }

  // Handle status update
  window.updateLeadStatus = async function(leadId, newStatus) {
    const selectEl = document.getElementById(`status-${leadId}`);
    const origStatus = selectEl.getAttribute('data-original');
    
    selectEl.disabled = true;
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, {
        status: newStatus
      });
      // Update local state and re-render
      const leadObj = globalLeads.find(l => l.id === leadId);
      if (leadObj) leadObj.status = newStatus;
      renderBoard();
    } catch (err) {
      console.error(err);
      alert("Error updating status. Make sure you have permission.");
      selectEl.value = origStatus; // Revert on failure
    } finally {
      selectEl.disabled = false;
    }
  }

  window.deleteLead = async function(leadId) {
    if (!confirm("Are you sure you want to delete this test lead?")) return;
    
    try {
      const leadRef = doc(db, "leads", leadId);
      await deleteDoc(leadRef);
      // Remove from local state
      globalLeads = globalLeads.filter(l => l.id !== leadId);
      renderBoard();
    } catch (err) {
      console.error(err);
      alert("Error deleting lead. Make sure you have permission.");
    }
  }

  function renderBoard() {
    const cols = {
        'Captured': document.getElementById('col-captured'),
        'Applied': document.getElementById('col-applied'),
        'Offer': document.getElementById('col-offer'),
        'Hired': document.getElementById('col-hired')
    };
    const counts = {
        'Captured': 0,
        'Applied': 0,
        'Offer': 0,
        'Hired': 0
    };

    // Clear columns
    Object.values(cols).forEach(col => col.innerHTML = '');

    globalLeads.forEach(lead => {
      const status = lead.status || 'Captured'; // Default to Captured
      if (counts[status] !== undefined) {
          counts[status]++;
          
          const dateStr = lead.timestamp ? new Date(lead.timestamp.toMillis()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown';
          const masked = maskEmail(lead.email);
          const currentRef = document.getElementById('ref-input').value.trim().toLowerCase();
          const refBadge = currentRef === 'admin_all' && lead.referred_by ? `<div style="background:var(--primary-light); color:var(--primary-dark); font-size:10px; font-weight:800; padding:2px 6px; border-radius:100px; display:inline-block; margin-bottom:8px;">REF: ${lead.referred_by}</div>` : '';
          
          let statusUI = '';
          let deleteBtn = '';
          if (currentRef === 'admin_all') {
            statusUI = `
              <select id="status-${lead.id}" data-original="${status}" class="status-select" onchange="updateLeadStatus('${lead.id}', this.value)">
                  <option value="Captured" ${status === 'Captured' ? 'selected' : ''}>Captured</option>
                  <option value="Applied" ${status === 'Applied' ? 'selected' : ''}>Applied</option>
                  <option value="Offer" ${status === 'Offer' ? 'selected' : ''}>Offer</option>
                  <option value="Hired" ${status === 'Hired' ? 'selected' : ''}>Hired 🎉</option>
              </select>
            `;
            deleteBtn = `<button onclick="deleteLead('${lead.id}')" style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:14px; padding:4px;" title="Delete Test Lead">🗑️</button>`;
          } else {
            statusUI = `
              <div style="font-size:12px; font-weight:800; color:var(--primary-dark); background:var(--primary-light); padding:6px 12px; border-radius:4px; display:inline-block; border: 1px solid rgba(16, 185, 129, 0.2);">
                  Status: ${status} ${status === 'Hired' ? '🎉' : ''}
              </div>
            `;
          }
          
          const card = document.createElement('div');
          card.className = 'lead-card';
          card.style.position = 'relative';
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                ${refBadge}
                ${deleteBtn}
            </div>
            <div style="font-weight:700; color:var(--black); font-size:16px;">${lead.firstName || 'Anonymous'}</div>
            <div style="color:var(--gray-500); font-size:12px; font-family:monospace; margin-bottom:8px;">${masked}</div>
            <div style="color:var(--gray-400); font-size:12px; margin-bottom:12px;">Captured: ${dateStr}</div>
            ${statusUI}
          `;
          cols[status].appendChild(card);
      }
    });

    // Update counts
    document.getElementById('count-captured').innerText = counts['Captured'];
    document.getElementById('count-applied').innerText = counts['Applied'];
    document.getElementById('count-offer').innerText = counts['Offer'];
    document.getElementById('count-hired').innerText = counts['Hired'];

    // Update Bonus UI
    const hiresCount = counts['Hired'];
    const appliedCount = counts['Applied'];
    
    if (document.getElementById('applied-count-bonus')) {
        document.getElementById('applied-count-bonus').innerText = appliedCount;
        document.getElementById('hires-count-bonus').innerText = hiresCount;
        
        const totalBonus = (appliedCount * 5) + (hiresCount * 15);
        document.getElementById('bonus-amount').innerText = totalBonus;
    }
  }

  window.loadDashboard = async function() {
    const refCode = document.getElementById('ref-input').value.trim();
    if (!refCode) return;
    
    const url = new URL(window.location);
    url.searchParams.set('ref', refCode);
    window.history.pushState({}, '', url);
    
    const btn = document.getElementById('load-btn');
    const origText = btn.innerHTML;
    btn.innerHTML = 'Loading...';
    btn.disabled = true;
    
    document.getElementById('results-section').style.display = 'block';
    
    try {
      let q;
      if (refCode.toLowerCase() === 'admin_all') {
        q = collection(db, "leads");
      } else {
        q = query(
          collection(db, "leads"), 
          where("referred_by", "==", refCode)
        );
      }
      
      const querySnapshot = await getDocs(q);
      globalLeads = [];
      querySnapshot.forEach((doc) => {
        globalLeads.push({
            id: doc.id,
            ...doc.data()
        });
      });
      
      globalLeads.sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
        const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
        return timeB - timeA; 
      });
      
      renderBoard();
      
    } catch (err) {
      console.error(err);
      alert("Error loading leads. Please check console.");
    } finally {
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    
    if (ref) {
      document.getElementById('ref-input').value = ref;
      
      // Affiliate Lock Down
      if (ref.toLowerCase() !== 'admin_all') {
         document.getElementById('search-box-container').style.display = 'none';
         
         // Add a nice header indicating whose board this is
         const headerContainer = document.createElement('div');
         headerContainer.innerHTML = `<h3 style="color:var(--primary); font-size:24px; font-weight:800; margin-top:24px; text-transform:uppercase;">Pipeline For: ${ref}</h3>`;
         document.getElementById('search-box-container').parentElement.appendChild(headerContainer);
      }
      
      loadDashboard();
    }
    document.getElementById('dashboard-form').addEventListener('submit', (e) => {
      e.preventDefault();
      loadDashboard();
    });
  });
