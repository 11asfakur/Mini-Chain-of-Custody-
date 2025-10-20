function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) {
        const kb = bytes / 1024;
        return kb.toFixed(2) + ' KB';
    }
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
}