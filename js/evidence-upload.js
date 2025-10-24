// Evidence upload functionality

// Show upload form
async function showUploadEvidence() {
    showPage('upload-evidence');
    
    // Populate case dropdown
    const caseSelect = document.getElementById('upload-case');
    caseSelect.innerHTML = '<option value="">Choose case</option>';
    
    allCases.forEach(c => {
        caseSelect.innerHTML += `
            <option value="${c.id}">${escapeHtml(c.name)}</option>
        `;
    });
    
    // File change listener
    const fileInput = document.getElementById('upload-file');
    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);
    
    newFileInput.addEventListener('change', function() {
        const file = newFileInput.files[0];
        if (file) {
            document.getElementById('file-info').textContent = 
                `Picked: ${file.name} (${formatFileSize(file.size)})`;
        }
    });
}