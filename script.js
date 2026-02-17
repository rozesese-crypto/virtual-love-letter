// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Check if there's a letter in the URL or localStorage
    const params = new URLSearchParams(window.location.search);
    const letterData = params.get('letter');
    
    if (letterData) {
        try {
            const decoded = JSON.parse(atob(letterData));
            sessionStorage.setItem('currentLetter', JSON.stringify(decoded));
            showViewMode(decoded);
        } catch (e) {
            console.error('Invalid letter data:', e);
            showModeSelection();
        }
    } else if (sessionStorage.getItem('currentLetter')) {
        const letter = JSON.parse(sessionStorage.getItem('currentLetter'));
        showViewMode(letter);
    } else {
        showModeSelection();
    }

    setupEventListeners();
}

function setupEventListeners() {
    // Mode selection
    document.getElementById('viewBtn').addEventListener('click', () => {
        showViewMode();
    });

    document.getElementById('createBtn').addEventListener('click', () => {
        showCreateMode();
    });

    // Envelope interaction
    document.getElementById('envelope').addEventListener('click', () => {
        const envelope = document.getElementById('envelope');
        const letterContainer = document.getElementById('letterContainer');
        
        if (envelope.classList.contains('open')) {
            envelope.classList.remove('open');
            letterContainer.classList.add('hidden');
        } else {
            envelope.classList.add('open');
            letterContainer.classList.remove('hidden');
        }
    });

    document.getElementById('closeLetter').addEventListener('click', () => {
        const envelope = document.getElementById('envelope');
        const letterContainer = document.getElementById('letterContainer');
        
        envelope.classList.remove('open');
        letterContainer.classList.add('hidden');
    });

    // Editor buttons
    document.getElementById('backBtn').addEventListener('click', showModeSelection);

    document.getElementById('saveLetter').addEventListener('click', saveLetter);

    document.getElementById('previewLetter').addEventListener('click', previewLetter);

    document.getElementById('copyLink').addEventListener('click', copyShareLink);
}

function showModeSelection() {
    document.getElementById('modeSelection').classList.remove('hidden');
    document.getElementById('viewMode').classList.add('hidden');
    document.getElementById('createMode').classList.add('hidden');
}

function showViewMode(letterData = null) {
    document.getElementById('modeSelection').classList.add('hidden');
    document.getElementById('viewMode').classList.remove('hidden');
    document.getElementById('createMode').classList.add('hidden');

    if (letterData) {
        document.querySelector('.recipient').textContent = `To: ${letterData.recipientName} 💕`;
        document.getElementById('letterContent').textContent = letterData.letterText;
        if (letterData.senderName) {
            document.getElementById('letterContent').textContent += `\n\nWith love,\n${letterData.senderName}`;
        }
    }
}

function showCreateMode() {
    document.getElementById('modeSelection').classList.add('hidden');
    document.getElementById('viewMode').classList.add('hidden');
    document.getElementById('createMode').classList.remove('hidden');

    // Load existing letter if available
    const currentLetter = sessionStorage.getItem('currentLetter');
    if (currentLetter) {
        const letter = JSON.parse(currentLetter);
        document.getElementById('recipientName').value = letter.recipientName;
        document.getElementById('letterText').value = letter.letterText;
        document.getElementById('senderName').value = letter.senderName || '';
    }
}

function saveLetter() {
    const recipientName = document.getElementById('recipientName').value.trim();
    const letterText = document.getElementById('letterText').value.trim();
    const senderName = document.getElementById('senderName').value.trim();

    if (!recipientName || !letterText) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    const letterData = {
        recipientName,
        letterText,
        senderName,
        createdAt: new Date().toISOString()
    };

    sessionStorage.setItem('currentLetter', JSON.stringify(letterData));
    showMessage('💾 Letter saved successfully!', 'success');
}

function previewLetter() {
    const recipientName = document.getElementById('recipientName').value.trim();
    const letterText = document.getElementById('letterText').value.trim();
    const senderName = document.getElementById('senderName').value.trim();

    if (!recipientName || !letterText) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    const letterData = {
        recipientName,
        letterText,
        senderName,
        createdAt: new Date().toISOString()
    };

    sessionStorage.setItem('currentLetter', JSON.stringify(letterData));
    showViewMode(letterData);
}

function copyShareLink() {
    const recipientName = document.getElementById('recipientName').value.trim();
    const letterText = document.getElementById('letterText').value.trim();
    const senderName = document.getElementById('senderName').value.trim();

    if (!recipientName || !letterText) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    const letterData = {
        recipientName,
        letterText,
        senderName,
        createdAt: new Date().toISOString()
    };

    const encoded = btoa(JSON.stringify(letterData));
    const shareLink = `${window.location.origin}${window.location.pathname}?letter=${encoded}`;

    navigator.clipboard.writeText(shareLink).then(() => {
        showMessage('🔗 Link copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('Failed to copy link', 'error');
    });
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;

    setTimeout(() => {
        messageEl.className = 'message';
        messageEl.textContent = '';
    }, 4000);
}
