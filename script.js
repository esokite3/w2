const windowStates = new Map();

let currentZoom = 100;

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const img = document.getElementById('resume-image');

    const pdf = new jsPDF();
    const imgData = img.src;

    pdf.addImage(imgData, 'JPEG', 10, 10, 180, 250); // adjust sizing as needed
    pdf.save('CaitlynLee_Resume.pdf');
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
function saveWindowState(win) {
    win.dataset.left = win.style.left;
    win.dataset.top = win.style.top;
    win.dataset.width = win.style.width;
    win.dataset.height = win.style.height;
}



// Restore window to its saved state
function restoreWindowState(win) {
    win.style.left = win.dataset.left;
    win.style.top = win.dataset.top;
    win.style.width = win.dataset.width;
    win.style.height = win.dataset.height;
    makeDraggable(win);
}

// Maximize window functionality
function maximizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        restoreWindowState(win);
        win.style.position = 'absolute';
        makeDraggable(win);
    } else {
        saveWindowState(win);
        win.classList.add('maximized');
        win.style.left = '0px';
        win.style.top = '0px';
        win.style.width = '100vw';
        win.style.height = '100vh';
        win.style.position = 'fixed';
    }
}

// minimize window functionality
function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.classList.contains('minimized')) {
        win.classList.remove('minimized');

        win.style.height = win.dataset.height;
        win.style.width = win.dataset.width;
        win.style.left = win.dataset.left;
        win.style.top = win.dataset.top;
    } else {
        win.dataset.height = win.style.height;
        win.dataset.width = win.style.width;
        win.dataset.left = win.style.left;
        win.dataset.top = win.style.top;

        win.classList.add('minimized');
    }
}


// open a window by ID
function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.add('show');
        if (!win.style.left || !win.style.top) {
            setDefaultPosition(win);
        }
    }
}

// close a window by ID
function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.remove('show');
    }
}

// Function to set default position for windows
function setDefaultPosition(windowElement) {
    const rect = windowElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const left = Math.max(0, (viewportWidth - rect.width) / 2);
    const top = Math.max(0, (viewportHeight - rect.height) / 2);
    
    windowElement.style.left = left + 'px';
    windowElement.style.top = top + 'px';
}

// Function to open resume image window
function openResume() {
    openWindow('resume-image-window');
}

// Make a window draggable - IMPROVED VERSION
function makeDraggable(el) {
    const header = el.querySelector('.window-header');
    let offsetX = 0, offsetY = 0;
    let isDragging = false;

    if (!header) return;

    header.addEventListener('mousedown', (e) => {
        if (el.classList.contains('maximized')) return;
        
        isDragging = true;
        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        el.style.zIndex = 200;
        
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && !el.classList.contains('maximized')) {
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;
            
            const maxLeft = window.innerWidth - el.offsetWidth;
            const maxTop = window.innerHeight - el.offsetHeight;
            
            el.style.left = Math.max(0, Math.min(maxLeft, newLeft)) + 'px';
            el.style.top = Math.max(0, Math.min(maxTop, newTop)) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Make a window resizable from bottom-right
function makeResizable(el) {
    const existingHandle = el.querySelector('.resize-handle');
    if (existingHandle) return;
    
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
            const newWidth = startWidth + e.clientX - startX;
            const newHeight = startHeight + e.clientY - startY;
           
            el.style.width = Math.max(300, newWidth) + 'px';
            el.style.height = Math.max(200, newHeight) + 'px';
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

    const allWindows = document.querySelectorAll('.window, .floating-window');
    allWindows.forEach(win => {
        makeDraggable(win);
        makeResizable(win);
    });

    const positions = [
        { id: 'home-folder-window', left: '100px', top: '100px' },
        { id: 'about-me-window', left: '150px', top: '120px' },
        { id: 'experience-folder-window', left: '200px', top: '140px' },
        { id: 'experience-text-window', left: '250px', top: '160px' },
        { id: 'socials-folder-window', left: '300px', top: '180px' },
        { id: 'resume-image-window', left: '350px', top: '200px' }
    ];

    positions.forEach(pos => {
        const window = document.getElementById(pos.id);
        if (window) {
            window.style.left = pos.left;
            window.style.top = pos.top;
            window.style.position = 'absolute';
        }
    });
});