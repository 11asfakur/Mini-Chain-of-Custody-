// Evidence transfer functionality

// Show transfer form

async function showTransferEvidence() 

{
    showPage('transfer-evidence');
    
    // Load all users if not loaded
    if (allUsers.length === 0)

{
        await loadAllUsers();
    }

    
    // Populate evidence dropdown (only user's evidence)
    const evidenceSelect = document.getElementById('transfer-evidence');
    evidenceSelect.innerHTML = '<option value="">Choose evidence</option>';
    
   
const myEvidence = allEvidence.filter(e => e.ownerUid === currentUser.uid);
    myEvidence.forEach(e => {
        evidenceSelect.innerHTML += `
            <option value="${e.id}">${escapeHtml(e.title)}</option>
        `;
    }
)
      ;
    
    // Populate recipient dropdown
    const recipientSelect = document.getElementById('transfer-to');
    recipientSelect.innerHTML = '<option value="">Select recipient</option>';


    const investigators = allUsers.filter(u => 
        u.role === 'Investigator' && u.uid !== currentUser.uid
    );
  
    
    investigators.forEach(inv => 
      {
        recipientSelect.innerHTML += `
        
<option value="${inv.uid}" 
                    data-fullname="${escapeHtml(inv.fullName)}" 
                    data-designation="${escapeHtml(inv.designation)}" 
                    data-department="${escapeHtml(inv.department)}">
                ${escapeHtml(inv.fullName)} (${escapeHtml(inv.designation)})
            </option>
        `;
    }
                          
     );
    
    // Clone to remove old event listeners
  
    const newRecipientSelect = recipientSelect.cloneNode(true);
    recipientSelect.parentNode.replaceChild(newRecipientSelect, recipientSelect);
  
    
    // Show recipient details on selection
  
    newRecipientSelect.addEventListener('change', function() 
                                        {
        const selected = this.options[this.selectedIndex];
        const recipientDetails = document.getElementById('recipient-details');
        
        if (this.value) 
          
{
            const fullName = selected.getAttribute('data-fullname');
            const designation = selected.getAttribute('data-designation');
            const department = selected.getAttribute('data-department');
            
            document.getElementById('recipient-info').innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <div>
                    
                        <span class="meta-label">Name:</span>
                        <span class="meta-value">${fullName}</span>
                    </div>
                    
                    <div>
                        <span class="meta-label">ID:</span>
                        <span class="meta-value">${this.value.substring(0, 8)}</span>
                    </div>
                    <div>
                        <span class="meta-label">Designation:</span>
                        <span class="meta-value">${designation}</span>
                    </div>
                    <div>
                        <span class="meta-label">Department:</span>
                        <span class="meta-value">${department}</span>
                    </div>
                </div>
            `;
  
            recipientDetails.style.display = 'block';
        } 
        else 
        {
            recipientDetails.style.display = 'none';
        }
    });
}

// Transfer evidence to another user
async function transferEvidence() 
{
    const evidenceId = document.getElementById('transfer-evidence').value;
    const recipientUid = document.getElementById('transfer-to').value;
    const reason = document.getElementById('transfer-reason').value.trim();
    
    if (!evidenceId || !recipientUid)
    {
        alert('Please fill all required fields!');
        return;
    }
    
    try 
    {
        const recipient = allUsers.find(u => u.uid === recipientUid);
        const evidence = allEvidence.find(e => e.id === evidenceId);
        
        if (!recipient || !evidence) {
            alert('Invalid selection!');
            return;
        }
        
        const oldOwnerName = evidence.ownerName;
        
        // Update evidence
        await db.collection('evidence').doc(evidenceId).update({
            ownerUid: recipientUid,
            ownerName: recipient.fullName,

            lastAction: 'Transfer'
        });
        
        // Add log
        await addLog(evidenceId, 'Transfer', {
            toWhoUid: recipientUid,
            toWhoName: recipient.fullName,
            toWhoDesignation: recipient.designation,
            why: reason,
            note: `Transferred from ${oldOwnerName} to ${recipient.fullName}`
        }
                    );
        
        // Clear form
        document.getElementById('transfer-evidence').value = '';
        document.getElementById('transfer-to').value = '';
        document.getElementById('transfer-reason').value = '';
        document.getElementById('recipient-details').style.display = 'none';
        
        alert('Evidence transferred successfully!');
        showPage('evidence');
    } catch (error) {
        console.error('Transfer error:', error);
        alert('Failed to transfer evidence!');
    }
  
}
