// Case management with Firebase

let allCases = [];
let selectedCaseId = null;

// Real-time listener for cases
db.collection('cases').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    allCases = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    // Refresh cases page if active
    const casesPage = document.getElementById('cases-page');
    if (casesPage && casesPage.classList.contains('active')) {
        renderCases();
    }
    
    // Update dashboard
    updateDashboard();
});

// Show create case page
async function showCreateCase() {
    showPage('create-case');
    
    // Load all users if not loaded
    if (allUsers.length === 0) {
        await loadAllUsers();
    }
    
    // Populate assignee dropdown
    const assigneeSelect = document.getElementById('case-assignee');
    assigneeSelect.innerHTML = '<option value="">Self (default)</option>';
    
    const investigators = allUsers.filter(u => u.role === 'Investigator');
    investigators.forEach(inv => {
        if (inv.uid !== currentUser.uid) {
            assigneeSelect.innerHTML += `
                <option value="${inv.uid}">
                    ${escapeHtml(inv.fullName)} (${escapeHtml(inv.designation)})
                </option>
            `;
        }
    });
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('case-date').value = today;
}

// Create case
async function createCase() {
    const name = document.getElementById('case-name').value.trim();
    const details = document.getElementById('case-details').value.trim();
    const type = document.getElementById('case-type').value;
    const assigneeUid = document.getElementById('case-assignee').value;
    const date = document.getElementById('case-date').value;
    const time = document.getElementById('case-time').value;
    
    if (!name || !type) {
        alert('Please fill in all required fields!');
        return;
    }
    
    try {
        const ownerUid = assigneeUid || currentUser.uid;
        const owner = allUsers.find(u => u.uid === ownerUid);
        
        await db.collection('cases').add({
            name: name,
            details: details,
            type: type,
            day: date || new Date().toISOString().split('T')[0],
            time: time || new Date().toTimeString().split(' ')[0].substring(0, 5),
            ownerUid: ownerUid,
            ownerName: owner ? owner.fullName : currentUser.fullName,
            status: 'Open',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Clear form
        document.getElementById('case-name').value = '';
        document.getElementById('case-details').value = '';
        document.getElementById('case-type').value = '';
        document.getElementById('case-assignee').value = '';
        document.getElementById('case-date').value = '';
        document.getElementById('case-time').value = '';
        
        alert('Case created successfully!');
        showPage('cases');
    } catch (error) {
        console.error('Error creating case:', error);
        alert('Failed to create case!');
    }
}

// Render cases
function renderCases() {
    const casesList = document.getElementById('cases-list');
    
    if (allCases.length === 0) {
        casesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <p>No cases yet</p>
                ${currentUser.role === 'Investigator' ? 
                    '<button class="btn btn-primary" onclick="showCreateCase()">Create First Case</button>' : 
                    ''}
            </div>
        `;
        return;
    }
    
    casesList.innerHTML = allCases.map(c => `
        <div class="case-card" onclick="viewCaseDetails('${c.id}')">
            <div class="case-header">
                <h3 class="case-title">${escapeHtml(c.name)}</h3>
                <span class="badge badge-blue">${escapeHtml(c.type)}</span>
                <span class="badge badge-green">${escapeHtml(c.status)}</span>
            </div>
            <p class="case-description">${escapeHtml(c.details)}</p>
            <div class="case-meta">
                <div class="meta-item">
                    <span class="meta-label">Case ID</span>
                    <span class="meta-value">${c.id.substring(0, 8)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Assigned To</span>
                    <span class="meta-value">${escapeHtml(c.ownerName || 'Unknown')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Incident Date</span>
                    <span class="meta-value">${escapeHtml(c.day)} ${escapeHtml(c.time)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Created</span>
                    <span class="meta-value">${c.createdAt ? formatDateOnly(c.createdAt.toDate().toISOString()) : 'N/A'}</span>
                </div>
            </div>
            <p class="case-hint">Click to view details and evidence →</p>
        </div>
    `).join('');
}

// View case details
async function viewCaseDetails(caseId) {
    selectedCaseId = caseId;
    const caseData = allCases.find(c => c.id === caseId);
    
    if (!caseData) {
        alert('Case not found!');
        return;
    }
    
    // Get evidence for this case
    const evidenceSnapshot = await db.collection('evidence')
        .where('caseId', '==', caseId)
        .get();
    
    const caseEvidence = evidenceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    const content = document.getElementById('case-details-content');
    content.innerHTML = `
        <div class="card">
            <div class="case-details-header">
                <span class="case-icon">📁</span>
                <div>
                    <h3>${escapeHtml(caseData.name)}</h3>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                        <span class="badge badge-blue">${escapeHtml(caseData.type)}</span>
                        <span class="badge badge-green">${escapeHtml(caseData.status)}</span>
                    </div>
                </div>
            </div>
            
            <div style="margin: 1rem 0;">
                <h4>Description</h4>
                <p class="text-muted">${escapeHtml(caseData.details)}</p>
            </div>
            
            <div class="case-details-grid">
                <div class="meta-item">
                    <span class="meta-label">Case ID</span>
                    <span class="meta-value">${caseId.substring(0, 8)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Category</span>
                    <span class="meta-value">${escapeHtml(caseData.type)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Status</span>
                    <span class="meta-value">${escapeHtml(caseData.status)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Assigned Investigator</span>
                    <span class="meta-value">${escapeHtml(caseData.ownerName || 'Unknown')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Incident Date</span>
                    <span class="meta-value">${escapeHtml(caseData.day)} ${escapeHtml(caseData.time)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Case Created</span>
                    <span class="meta-value">${caseData.createdAt ? formatDate(caseData.createdAt.toDate().toISOString()) : 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <div class="evidence-section">
            <h3>📷 Evidence (${caseEvidence.length})</h3>
            ${caseEvidence.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon">📷</div>
                    <p>No evidence uploaded for this case yet</p>
                </div>
            ` : caseEvidence.map(item => `
                <div class="evidence-item">
                    <div class="evidence-header">
                        <h4 class="evidence-title">${escapeHtml(item.title)}</h4>
                        <span class="badge badge-blue">${item.id.substring(0, 8)}</span>
                        <span class="badge badge-green">${escapeHtml(item.status)}</span>
                    </div>
                    <p class="evidence-description">${escapeHtml(item.info)}</p>
                    
                    <div class="evidence-meta">
                        <div class="meta-item">
                            <span class="meta-label">File Name</span>
                            <span class="meta-value">${escapeHtml(item.filename)}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">File Size</span>
                            <span class="meta-value">${formatFileSize(item.size)}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Uploader</span>
                            <span class="meta-value">${escapeHtml(item.uploaderName || 'Unknown')}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Current Owner</span>
                            <span class="meta-value owner">${escapeHtml(item.ownerName || 'Unknown')}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Last Action</span>
                            <span class="meta-value">${escapeHtml(item.lastAction)}</span>
                        </div>
                    </div>
                    
                    <div class="hash-box">
                        <div class="hash-item"><strong>SHA-256:</strong> ${escapeHtml(item.hash1)}</div>
                        <div class="hash-item"><strong>MD5:</strong> ${escapeHtml(item.hash2)}</div>
                    </div>
                    
                    <div class="evidence-actions">
                        <button class="btn btn-primary btn-small" onclick="viewEvidenceLog('${item.id}')">🕒 View Log</button>
                        <button class="btn btn-success btn-small" onclick="downloadReport('${item.id}')">📥 Download Report</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    showPage('case-details');
}
