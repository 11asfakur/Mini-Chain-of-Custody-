// Utility functions

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) {
        const kb = bytes / 1024;
        return kb.toFixed(2) + ' KB';
    }
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
}

// Generate hash from file
async function generateHash(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            const timeStamp = Date.now();
            const randomNum = Math.random();
            
            // SHA-256 simulation
            const combined1 = data.substring(0, 1000) + timeStamp;
            const encoded1 = btoa(combined1);
            const sha256 = encoded1.substring(0, 64).toUpperCase();
            
            // MD5 simulation
            const combined2 = data.substring(0, 500) + randomNum;
            const encoded2 = btoa(combined2);
            const md5 = encoded2.substring(0, 32).toLowerCase();
            
            resolve({ sha256, md5 });
        };
        reader.readAsDataURL(file);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Format date only
function formatDateOnly(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Show/hide screens
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Show/hide pages
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    
       // Update navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        if (btn.getAttribute('onclick')?.includes(pageId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Refresh page content
    if (pageId === 'dashboard') {
        updateDashboard();
    } else if (pageId === 'cases') {
        renderCases();
    } else if (pageId === 'evidence') {
        renderEvidence();
    } else if (pageId === 'logs') {
        renderAllLogs();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}