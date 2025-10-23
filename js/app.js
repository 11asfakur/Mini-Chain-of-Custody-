// Main app initialization and dashboard


function updateDashboard()
  
{
    // Update stats
    const statCases = document.getElementById('stat-cases');
    const statEvidence = document.getElementById('stat-evidence');
    const statActions = document.getElementById('stat-actions');

  
    if (statCases) statCases.textContent = allCases.length;
    if (statEvidence) statEvidence.textContent = allEvidence.length;
    if (statActions) statActions.textContent = allLogs.length;
}

// Initialize app on page load

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chain of Custody System initialized with Firebase');
  
    
    // Show login screen by default
  
    showLogin();
  
});
