# Meme Expression Matcher

A real-time facial expression-based meme search application that matches your facial expressions with memes from the internet.

## Features

- Real-time facial expression detection using face-api.js
- Automatic meme matching based on detected expressions
- Save favorite memes to your personal collection
- Modern, responsive UI built with Tailwind CSS
- SQLite database for storing meme and user data

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser with camera access
- iOS device for mobile testing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meme-expression-matcher
```

2. Install dependencies:
```bash
npm install
```

3. Download face-api.js models:
Create a `public/models` directory and download the required models from [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights).

4. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Open the application in your web browser
2. Click "Start Camera" to begin facial expression detection
3. Allow camera access when prompted
4. The application will automatically detect your facial expressions and display matching memes
5. Click "Save" on any meme to add it to your collection
6. View your saved memes in the "Saved Memes" section

## Technical Details

- Backend: Express.js
- Database: SQLite3
- Frontend: HTML, CSS (Tailwind), JavaScript
- Facial Recognition: face-api.js
- Real-time video processing

## Security Considerations

- Camera access is required for facial expression detection
- User data is stored locally in SQLite database
- API endpoints are protected with basic authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 
