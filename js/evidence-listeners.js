// Real-time Firebase listeners for evidence and logs

let allEvidence = [];
let allLogs = [];
let selectedEvidenceId = null;

// Listen to evidence collection
db.collection('evidence').orderBy('uploaded', 'desc').onSnapshot(snapshot => {
    allEvidence = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
     
    
    // Refresh evidence page if active
    const evidencePage = document.getElementById('evidence-page');
    if (evidencePage && evidencePage.classList.contains('active')) {
        renderEvidence();
    }
       // Update dashboard
    updateDashboard();
});

// Listen to logs collection
db.collection('logs').orderBy('when', 'desc').onSnapshot(snapshot => {
    allLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    // Refresh logs page if active
    const logsPage = document.getElementById('logs-page');
    if (logsPage && logsPage.classList.contains('active')) {
        renderAllLogs();
    }
    
    // Update dashboard
    updateDashboard();
});