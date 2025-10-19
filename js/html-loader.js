// HTML Loader - Loads HTML partials into index.html

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
    await loadHTML('html/app-navigation.html', 'app-navigation');
    
    
    
}