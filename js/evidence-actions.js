// Perform actions on evidence (Analysis, Autopsy, etc.)

// Show action form
function showPerformAction() {
    showPage('perform-action');
    
    // Populate evidence dropdown (only user's evidence)
    const evidenceSelect = document.getElementById('action-evidence');
    evidenceSelect.innerHTML = '<option value="">Choose evidence</option>';
    
    const myEvidence = allEvidence.filter(e => e.ownerUid === currentUser.uid);
    myEvidence.forEach(e => {
        evidenceSelect.innerHTML += `
            <option value="${e.id}">${escapeHtml(e.title)}</option>
        `;
    });
}

// Perform action on evidence
async function performAction() {
    const evidenceId = document.getElementById('action-evidence').value;
    const actionType = document.getElementById('action-type').value;
    const notes = document.getElementById('action-notes').value.trim();
    
    if (!evidenceId || !actionType) {
        alert('Please select evidence and action type!');
        return;
    }
    
    try {
        // Update evidence
        await db.collection('evidence').doc(evidenceId).update({
            lastAction: actionType
        });
        
        // Add log
        await addLog(evidenceId, actionType, {
            note: notes || `${actionType} performed by ${currentUser.fullName}`
        });
        
        // Clear form
        document.getElementById('action-evidence').value = '';
        document.getElementById('action-type').value = '';
        document.getElementById('action-notes').value = '';
        
        alert(actionType + ' performed successfully!');
        showPage('evidence');
    } catch (error) {
        console.error('Action error:', error);
        alert('Failed to perform action!');
    }
}