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
// Upload evidence to Firebase
async function uploadEvidence() {
    const caseId = document.getElementById('upload-case').value;
    const title = document.getElementById('upload-title').value.trim();
    const info = document.getElementById('upload-info').value.trim();
    const fileInput = document.getElementById('upload-file');
    const file = fileInput.files[0];
    
    if (!caseId || !title || !file) {
        alert('Fill all fields and pick a file!');
        return;
    }
    
    try {
        alert('Uploading... Please wait!');
        
        // Get case name
        const caseData = allCases.find(c => c.id === caseId);
        const caseName = caseData ? caseData.name : 'Unknown Case';
        
        // Generate hashes
        const hashes = await generateHash(file);
        
        // Upload file to Firebase Storage
        const storageRef = storage.ref(`evidence/${Date.now()}_${file.name}`);
        const uploadTask = await storageRef.put(file);
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Create evidence document
        const evidenceRef = await db.collection('evidence').add({
            caseId: caseId,
            caseName: caseName,
            title: title,
            info: info,
            filename: file.name,
            filetype: file.type || 'unknown',
            size: file.size,
            fileURL: downloadURL,
            hash1: hashes.sha256,
            hash2: hashes.md5,
            uploaderUid: currentUser.uid,
            uploaderName: currentUser.fullName,
            ownerUid: currentUser.uid,
            ownerName: currentUser.fullName,
            uploaded: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'Active',
            lastAction: 'Upload'
        });
        
        // Add log
        await addLog(evidenceRef.id, 'Upload', {
            note: 'Initial upload: ' + file.name
        });
        
        // Clear form
        document.getElementById('upload-case').value = '';
        document.getElementById('upload-title').value = '';
        document.getElementById('upload-info').value = '';
        document.getElementById('upload-file').value = '';
        document.getElementById('file-info').textContent = '';
        
        alert('Evidence uploaded successfully!');
        showPage('evidence');
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload evidence: ' + error.message);
    }
}