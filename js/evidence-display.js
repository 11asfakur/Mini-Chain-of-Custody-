// Display evidence list

// Render all evidence cards
function renderEvidence() {
    const evidenceList = document.getElementById('evidence-list');
    
    if (allEvidence.length === 0) {
        evidenceList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📷</div>
                <p>No evidence yet!</p>
                ${currentUser.role === 'Investigator' ? 
                    '<button class="btn btn-primary" onclick="showUploadEvidence()">Upload First Evidence</button>' : 
                    ''}
            </div>
        `;
        return;
    }
       evidenceList.innerHTML = allEvidence.map(item => `
        <div class="evidence-card">
            <div class="evidence-header">
                <h3 class="evidence-title">${escapeHtml(item.title)}</h3>
                <span class="badge badge-blue">${item.id.substring(0, 8)}</span>
                <span class="badge badge-green">${escapeHtml(item.status)}</span>
            </div>
            <p class="evidence-description">${escapeHtml(item.info)}</p>
            
            <div class="evidence-meta">
                <div class="meta-item">
                    <span class="meta-label">Case</span>
                    <span class="meta-value">${escapeHtml(item.caseName || 'Unknown')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">File</span>
                    <span class="meta-value">${escapeHtml(item.filename)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Size</span>
                    <span class="meta-value">${formatFileSize(item.size)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Uploader</span>
                    <span class="meta-value">${escapeHtml(item.uploaderName || 'Unknown')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Current Custodian</span>
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
                <button class="btn btn-primary btn-small" onclick="viewEvidenceLog('${item.id}')">🕐 View Log</button>
                <button class="btn btn-success btn-small" onclick="downloadReport('${item.id}')">📥 Download</button>
            </div>
        </div>
    `).join('');
}