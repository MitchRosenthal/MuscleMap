# MuscleMap - Interactive Muscle Anatomy Learning Platform

MuscleMap is an interactive web application that helps users learn about muscle anatomy through an engaging visual interface and quiz system. The application features an interactive muscle map, detailed muscle information pages, and a quiz game to test knowledge.

## Features

- Interactive muscle map with front and back views
- Detailed muscle information pages with:
  - Muscle descriptions and fun facts
  - Subgroup information
  - Action demonstrations
  - Training guidance
- Quiz game to test muscle knowledge
- Progress tracking system
- Mobile-responsive design

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd MuscleMap
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install required packages:
```bash
pip install flask
```

## Running the Application

1. Start the Flask server:
```bash
python server.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## Project Structure

```
MuscleMap/
├── static/
│   ├── images/         # Muscle images and maps
│   ├── gifs/          # Action demonstration GIFs
│   ├── main.css       # Main stylesheet
│   ├── script.js      # Main JavaScript file
│   └── progress-tracker.js
├── templates/         # HTML templates
├── muscle_data.py    # Muscle information database
├── quiz_questions.py # Quiz content
└── server.py         # Flask application server
```

## Development

- The application uses Flask for the backend
- Frontend is built with HTML, CSS, and JavaScript
- Bootstrap 5 is used for responsive design
- SVG is used for the interactive muscle map

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- Nick Felix
- Mitchell Rosenthall
- Johnathan Wrenn
- Shaya Schwarz
