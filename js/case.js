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