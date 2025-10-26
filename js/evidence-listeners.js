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