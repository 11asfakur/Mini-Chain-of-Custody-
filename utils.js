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