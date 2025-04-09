// Load face-api models
console.log('Starting to load face-api models...');
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
    console.log('Face-api models loaded successfully');
    startVideo();
}).catch(err => {
    console.error('Error loading face-api models:', err);
});

const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startCamera');
const resultsContainer = document.getElementById('results');
const savedMemesContainer = document.getElementById('savedMemes');

let isProcessing = false;
let currentExpression = null;

// Start video stream
function startVideo() {
    console.log('Requesting camera access...');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            console.log('Camera access granted');
            video.srcObject = stream;
            video.play();
            startButton.style.display = 'none';
            startExpressionDetection();
        })
        .catch(err => {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
        });
}

// Start facial expression detection
function startExpressionDetection() {
    setInterval(async () => {
        if (!isProcessing) {
            isProcessing = true;
            const detections = await faceapi.detectAllFaces(video, 
                new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            if (detections.length > 0) {
                const detection = detections[0];
                currentExpression = getDominantExpression(detection.expressions);
                
                // Draw face detection
                const canvas = faceapi.createCanvasFromMedia(video);
                overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
                faceapi.matchDimensions(canvas, { width: video.width, height: video.height });
                const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height });
                faceapi.draw.drawDetections(overlay, resizedDetections);
                faceapi.draw.drawFaceExpressions(overlay, resizedDetections);

                // Search for matching memes
                searchMatchingMemes(currentExpression);
            }
            isProcessing = false;
        }
    }, 100);
}

// Get the dominant facial expression
function getDominantExpression(expressions) {
    return Object.entries(expressions)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

// Search for matching memes
async function searchMatchingMemes(expression) {
    try {
        const response = await fetch('/api/analyze-expression', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expressionData: expression })
        });

        const data = await response.json();
        if (data.success) {
            displayMemeResults(data.memes);
        }
    } catch (error) {
        console.error('Error searching memes:', error);
    }
}

// Display meme results
function displayMemeResults(memes) {
    resultsContainer.innerHTML = '';
    memes.forEach(meme => {
        const memeCard = document.createElement('div');
        memeCard.className = 'meme-card relative bg-white rounded-lg shadow-lg overflow-hidden';
        memeCard.innerHTML = `
            <img src="${meme.url}" alt="Meme" class="meme-image">
            <button class="save-button" onclick="saveMeme(${meme.id})">
                Save
            </button>
        `;
        resultsContainer.appendChild(memeCard);
    });
}

// Save meme to user's collection
async function saveMeme(memeId) {
    try {
        const response = await fetch('/api/save-meme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 1, // TODO: Replace with actual user ID
                memeId: memeId
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('Meme saved successfully!');
            loadSavedMemes();
        }
    } catch (error) {
        console.error('Error saving meme:', error);
    }
}

// Load user's saved memes
async function loadSavedMemes() {
    try {
        const response = await fetch('/api/saved-memes/1'); // TODO: Replace with actual user ID
        const data = await response.json();
        if (data.success) {
            displaySavedMemes(data.memes);
        }
    } catch (error) {
        console.error('Error loading saved memes:', error);
    }
}

// Display saved memes
function displaySavedMemes(memes) {
    savedMemesContainer.innerHTML = '';
    memes.forEach(meme => {
        const memeCard = document.createElement('div');
        memeCard.className = 'meme-card relative bg-white rounded-lg shadow-lg overflow-hidden';
        memeCard.innerHTML = `
            <img src="${meme.url}" alt="Saved Meme" class="meme-image">
        `;
        savedMemesContainer.appendChild(memeCard);
    });
}

// Initialize the application
startButton.addEventListener('click', startVideo);
loadSavedMemes(); 
