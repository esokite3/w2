function downloadPDF() {
    const link = document.createElement('a');
    link.href = 'etc/Resume-CaitlynLee.pdf';
    link.download = 'CaitlynLee_Resume.pdf';
    link.click();
}

function printPDF() {
    window.open('etc/Resume-CaitlynLee.pdf', '_blank');
}

function openWindow(id) {
    document.getElementById(id).style.display = 'block';
}

function closeWindow(id) {
    document.getElementById(id).style.display = 'none';
}

function openResume() {
    document.getElementById("resume-content").style.display = 'block';
}

function closeResume() {
    document.getElementById("resume-content").style.display = 'none';
}

function makeDraggable(el) {
    const header = el.querySelector('.window-header');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.style.cursor = 'move';

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - el.getBoundingClientRect().left;
        offsetY = e.clientY - el.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = 'auto';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        // Optional bounds
        const winWidth = el.offsetWidth;
        const winHeight = el.offsetHeight;
        const maxLeft = window.innerWidth - winWidth;
        const maxTop = window.innerHeight - winHeight;

        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (left > maxLeft) left = maxLeft;
        if (top > maxTop) top = maxTop;

        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.position = 'fixed';
    });
}

function makeResizable(el) {
    const resizer = el.querySelector('.resize-handle');
    let isResizing = false;
    let lastDownX = 0, lastDownY = 0;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        lastDownX = e.clientX;
        lastDownY = e.clientY;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const dx = e.clientX - lastDownX;
        const dy = e.clientY - lastDownY;

        const newWidth = el.offsetWidth + dx;
        const newHeight = el.offsetHeight + dy;

        if (newWidth > 300) el.style.width = newWidth + 'px';
        if (newHeight > 200) el.style.height = newHeight + 'px';

        lastDownX = e.clientX;
        lastDownY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.userSelect = 'auto';
    });
}

// Initialize when page loads
window.addEventListener('load', () => {
    const windows = [
        document.getElementById('resume-content'),
        document.getElementById('about-me-window'),
        document.getElementById('experience-text-window')
    ];

    windows.forEach(win => {
        makeDraggable(win);
        makeResizable(win);
    });
});