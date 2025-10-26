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