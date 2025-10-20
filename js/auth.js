// Authentication management with Firebase

let currentUser = null;
let allUsers = []; // Cache for user list

// Listen for auth state changes
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            currentUser = {
                uid: user.uid,
                email: user.email,
                ...userDoc.data()
            };
            
            // Only show app if we're not on login/register screen
            const loginScreen = document.getElementById('login-screen');
            const registerScreen = document.getElementById('register-screen');
            if (!loginScreen.classList.contains('active') && 
                !registerScreen.classList.contains('active')) {
                showApp();
            }
        }
    } else {
        currentUser = null;
    }
});

// Show login screen
function showLogin() {
    showScreen('login-screen');
}

// Show register screen
function showRegister() {
    showScreen('register-screen');
}

// Handle login
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password!');
        return;
    }
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // Get user data from Firestore
        const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
        
        if (userDoc.exists) {
            currentUser = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                ...userDoc.data()
            };
            
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
            
            showApp();
        } else {
            alert('User data not found!');
            await auth.signOut();
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            alert('Wrong email or password!');
        } else {
            alert('Login failed: ' + error.message);
        }
    }
}

// Handle register
async function handleRegister() {
    const firstName = document.getElementById('reg-firstname').value.trim();
    const lastName = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const designation = document.getElementById('reg-designation').value.trim();
    const department = document.getElementById('reg-department').value.trim();
    const role = document.getElementById('reg-role').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    if (!firstName || !lastName || !email || !designation || !department || !role || !password || !confirm) {
        alert('Please fill all fields!');
        return;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    
    try {
        // Create auth user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create readable username and full name
        const username = firstName.toLowerCase() + lastName.toLowerCase();
        const fullName = firstName + ' ' + lastName;
        
        // Save user data to Firestore
        await db.collection('users').doc(user.uid).set({
            username: username,
            fullName: fullName,
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: role,
            designation: designation,
            department: department,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Clear form
        document.getElementById('reg-firstname').value = '';
        document.getElementById('reg-lastname').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-designation').value = '';
        document.getElementById('reg-department').value = '';
        document.getElementById('reg-role').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-confirm').value = '';
        
        alert('Account created successfully! You can now login with your email: ' + email);
        showLogin();
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'auth/email-already-in-use') {
            alert('Email already registered! Please use a different email.');
        } else {
            alert('Registration failed: ' + error.message);
        }
    }
}

// Handle logout
async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await auth.signOut();
            currentUser = null;
            showLogin();
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed!');
        }
    }
}

// Show app
function showApp() {
    showScreen('app-screen');
    
    // Update user info
    const userInfo = document.getElementById('user-info');
    userInfo.innerHTML = `
        <p class="bold">${escapeHtml(currentUser.firstName)} ${escapeHtml(currentUser.lastName)}</p>
        <p>${escapeHtml(currentUser.role)} - ${escapeHtml(currentUser.designation)}</p>
        <p class="small">${escapeHtml(currentUser.department)}</p>
        <button onclick="handleLogout()" class="logout-btn">Logout</button>
    `;
    
    // Show/hide action buttons based on role
    if (currentUser.role === 'Investigator') {
        document.getElementById('create-case-btn').style.display = 'block';
        document.getElementById('evidence-actions').style.display = 'flex';
    } else {
        document.getElementById('create-case-btn').style.display = 'none';
        document.getElementById('evidence-actions').style.display = 'none';
    }
    
    // Show dashboard
    document.getElementById('dashboard-page').classList.add('active');
    updateDashboard();
}

// Load all users (for dropdowns)
async function loadAllUsers() {
    try {
        const snapshot = await db.collection('users').get();
        allUsers = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Get user's full name by UID
function getUserFullName(uid) {
    const user = allUsers.find(u => u.uid === uid);
    return user ? user.fullName : uid;
}

// Add enter key listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    
    if (loginEmail) {
        loginEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    if (loginPassword) {
        loginPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    // Load users on app start
    loadAllUsers();
});