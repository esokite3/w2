let currentZoom = 100;

function downloadImage() {
    const link = document.createElement('a');
    link.href = 'etc/resume.jpg';
    link.download = 'CaitlynLee_Resume.jpg';
    link.click();
}

function printImage() {
    const img = document.getElementById('resume-image');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head><title>Print Resume</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh;">
                <img src="${img.src}" style="max-width:100%; height:auto;">
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function zoomIn() {
    currentZoom += 25;
    if (currentZoom > 200) currentZoom = 200;
    updateZoom();
}

function zoomOut() {
    currentZoom -= 25;
    if (currentZoom < 50) currentZoom = 50;
    updateZoom();
}

function updateZoom() {
    const img = document.getElementById('resume-image');
    const zoomLevel = document.getElementById('zoom-level');
    
    if (img && zoomLevel) {
        img.style.transform = `scale(${currentZoom / 100})`;
        zoomLevel.textContent = `${currentZoom}%`;
    }
}

// Save the current state of a window
function saveWindowState(windowElement) {
    const id = windowElement.id;
    const rect = windowElement.getBoundingClientRect();
    
    windowStates.set(id, {
        left: windowElement.style.left || rect.left + 'px',
        top: windowElement.style.top || rect.top + 'px',
        width: windowElement.style.width || rect.width + 'px',
        height: windowElement.style.height || rect.height + 'px',
        isMaximized: windowElement.classList.contains('maximized')
    });
}

// Restore window to its saved state
function restoreWindowState(windowElement) {
    const id = windowElement.id;
    const state = windowStates.get(id);
    
    if (state) {
        windowElement.style.left = state.left;
        windowElement.style.top = state.top;
        windowElement.style.width = state.width;
        windowElement.style.height = state.height;
    }
}

// Maximize window functionality
function maximizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    
    if (windowElement.classList.contains('maximized')) {
        // Restore from maximized state
        windowElement.classList.remove('maximized');
        restoreWindowState(windowElement);
    } else {
        // Save current state before maximizing
        saveWindowState(windowElement);
        
        // Maximize the window
        windowElement.classList.add('maximized');
        windowElement.style.left = '0px';
        windowElement.style.top = '0px';
        windowElement.style.width = '100vw';
        windowElement.style.height = '100vh';
    }
}

// Minimize window functionality
function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    
    if (windowElement.classList.contains('minimized')) {
        // Restore from minimized state
        windowElement.classList.remove('minimized');
        windowElement.classList.remove('show');
        // Add show class after a brief delay to trigger animation
        setTimeout(() => {
            windowElement.classList.add('show');
        }, 10);
    } else {
        // Minimize the window (hide it)
        windowElement.classList.add('minimized');
        windowElement.classList.remove('show');
    }
}

// Open a window by ID
function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.add('show');
    }
}

// Close a window by ID
function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.remove('show');
    }
}

// Function to open resume image window
function openResume() {
    openWindow('resume-image-window');
}

// Make a window draggable
function makeDraggable(el) {
    const header = el.querySelector('.window-header');
    let offsetX = 0, offsetY = 0;
    let isDragging = false;

    if (!header) return;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.zIndex = 200; // bring to front
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Make a window resizable from bottom-right
function makeResizable(el) {
    const existingHandle = el.querySelector('.resize-handle');
    if (existingHandle) return; // Don't add multiple handles
    
    const resizer = document.createElement('div');
    resizer.classList.add('resize-handle');
    el.appendChild(resizer);

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        let startX = e.clientX;
        let startY = e.clientY;
        let startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10);
        let startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10);

        function doDrag(e) {
            el.style.width = `${startWidth + e.clientX - startX}px`;
            el.style.height = `${startHeight + e.clientY - startY}px`;
        }

        function stopDrag() {
            document.documentElement.removeEventListener('mousemove', doDrag);
            document.documentElement.removeEventListener('mouseup', stopDrag);
        }

        document.documentElement.addEventListener('mousemove', doDrag);
        document.documentElement.addEventListener('mouseup', stopDrag);
    });
}

// Initialize folders and windows
window.addEventListener('load', () => {
    // Handle folder clicks
    document.querySelectorAll('.folder').forEach(folder => {
        folder.addEventListener('click', () => {
            const targetId = folder.getAttribute('data-target');
            const section = folder.getAttribute('data-section');
            
            if (targetId) {
                openWindow(targetId);
            } else if (section === 'socials') {
                openWindow('socials-folder-window');
            }
        });
    });

    // Handle Experience & Projects folder click
    document.querySelector('.folder[data-target="experience-projects"]').addEventListener('click', () => {
        openWindow('experience-folder-window');
    });

    // Initialize all windows to be draggable and resizable
    const allWindows = document.querySelectorAll('.window, .floating-window');
    allWindows.forEach(win => {
        makeDraggable(win);
        makeResizable(win);
    });

    // Set initial positions for windows
    const homeWindow = document.getElementById('home-folder-window');
    if (homeWindow) {
        homeWindow.style.left = '100px';
        homeWindow.style.top = '100px';
    }

    const aboutWindow = document.getElementById('about-me-window');
    if (aboutWindow) {
        aboutWindow.style.left = '150px';
        aboutWindow.style.top = '120px';
    }

    const expFolderWindow = document.getElementById('experience-folder-window');
    if (expFolderWindow) {
        expFolderWindow.style.left = '200px';
        expFolderWindow.style.top = '140px';
    }

    const expTextWindow = document.getElementById('experience-text-window');
    if (expTextWindow) {
        expTextWindow.style.left = '250px';
        expTextWindow.style.top = '160px';
    }

    const socialsWindow = document.getElementById('socials-folder-window');
    if (socialsWindow) {
        socialsWindow.style.left = '300px';
        socialsWindow.style.top = '180px';
    }

    const resumeWindow = document.getElementById('resume-image-window');
    if (resumeWindow) {
        resumeWindow.style.left = '350px';
        resumeWindow.style.top = '200px';
    }
});