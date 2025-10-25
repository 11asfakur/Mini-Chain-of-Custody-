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
