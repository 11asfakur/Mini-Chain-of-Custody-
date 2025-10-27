// Log management and display

// Add log entry to Firestore
async function addLog(evidenceId, action, data = {}) {
    try {
        await db.collection('logs').add({
            itemId: evidenceId,
            what: action,
            userUid: currentUser.uid,
            userName: currentUser.fullName,
            when: firebase.firestore.FieldValue.serverTimestamp(),
            toWhoUid: data.toWhoUid || null,
            toWhoName: data.toWhoName || null,
            toWhoDesignation: data.toWhoDesignation || null,
            why: data.why || '',
            note: data.note || ''
        });
    } catch (error) {
        console.error('Error adding log:', error);
    }
}

// View log for specific evidence
async function viewEvidenceLog(evidenceId) {
    selectedEvidenceId = evidenceId;
    
    try {
        const snapshot = await db.collection('logs')
            .where('itemId', '==', evidenceId)
            .orderBy('when', 'desc')
            .get();
        
        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        document.getElementById('log-title').textContent = `Log for Evidence #${evidenceId.substring(0, 8)}`;
        
        const logContent = document.getElementById('log-content');
        
        if (logs.length === 0) {
            logContent.innerHTML = '<p class="text-muted">No logs yet</p>';
        } else {
            logContent.innerHTML = logs.map(log => `
                <div class="log-item">
                    <p class="log-action">${escapeHtml(log.what)}</p>
                    <p class="log-meta">By: ${escapeHtml(log.userName || 'Unknown')}</p>
                    ${log.toWhoName ? `<p class="log-meta">To: ${escapeHtml(log.toWhoName)}</p>` : ''}
                    ${log.why ? `<p class="log-note">Why: "${escapeHtml(log.why)}"</p>` : ''}
                    ${log.note ? `<p class="log-note">${escapeHtml(log.note)}</p>` : ''}
                    <p class="log-time">🕐 ${log.when ? formatDate(log.when.toDate().toISOString()) : 'N/A'}</p>
                </div>
            `).join('');
        }
        
        showPage('evidence-log');
    } catch (error) {
        console.error('Error fetching logs:', error);
        alert('Failed to load logs! Make sure Firestore indexes are created.');
    }
}

// Render all logs (system-wide)
function renderAllLogs() {
    const allLogsContent = document.getElementById('all-logs-content');
    
    if (allLogs.length === 0) {
        allLogsContent.innerHTML = '<p class="text-muted">No logs yet</p>';
        return;
    }
    
    allLogsContent.innerHTML = allLogs.map(log => {
        // Find the evidence to get its title
        const evidence = allEvidence.find(e => e.id === log.itemId);
        const evidenceTitle = evidence ? evidence.title : `Evidence #${log.itemId.substring(0, 8)}`;
        
        return `
            <div class="log-item">
                <p class="log-action">${escapeHtml(log.what)} - ${escapeHtml(evidenceTitle)}</p>
                <p class="log-meta">By: ${escapeHtml(log.userName || 'Unknown')}</p>
                ${log.toWhoName ? `<p class="log-meta">To: ${escapeHtml(log.toWhoName)}</p>` : ''}
                ${log.why ? `<p class="log-note">Why: "${escapeHtml(log.why)}"</p>` : ''}
                <p class="log-time">🕐 ${log.when ? formatDate(log.when.toDate().toISOString()) : 'N/A'}</p>
            </div>
        `;
    }).join('');
}