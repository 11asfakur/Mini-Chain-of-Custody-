async function loadHTML(file, containerId) {
    try {
        const response = await fetch(file);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
}

async function loadAllHTML() {
    // Load screens
    await loadHTML('html/login-screen.html', 'login-screen');
    await loadHTML('html/register-screen.html', 'register-screen');
    
    // Load app components
    await loadHTML('html/app-header.html', 'app-header');
    await loadHTML('html/app-navigation.html', 'app-navigation');
    
    // Load all pages
    await loadHTML('html/pages/dashboard.html', 'dashboard-page');
    await loadHTML('html/pages/cases-list.html', 'cases-page');
    await loadHTML('html/pages/case-details.html', 'case-details-page');
    await loadHTML('html/pages/create-case.html', 'create-case-page');
    await loadHTML('html/pages/evidence-list.html', 'evidence-page');
    await loadHTML('html/pages/upload-evidence.html', 'upload-evidence-page');
    await loadHTML('html/pages/transfer-evidence.html', 'transfer-evidence-page');
    await loadHTML('html/pages/perform-action.html', 'perform-action-page');
    await loadHTML('html/pages/evidence-log.html', 'evidence-log-page');
    await loadHTML('html/pages/all-logs.html', 'logs-page');
    
}
