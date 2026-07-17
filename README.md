# 🧪 Physics 8 - Semester 1 - Quiz

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML](https://img.shields.io/badge/HTML-5-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4)](https://tailwindcss.com/)

An interactive web application for practicing multiple-choice questions for **Physics Grade 8 - Semester 1**. Based on the official textbook question bank, it supports customizable quizzes by lesson and difficulty level, featuring a clean, modern, and user-friendly dark interface.

👉 Live Demo: [https://xn--msiu-goa8b.vn/github/physics08-semester1-quiz/](https://xn--msiu-goa8b.vn/github/physics08-semester1-quiz/)

## ✨ Features

- 📚 **Comprehensive Question Bank**: Covers 7 main lessons from Physics 8 - Semester 1.
- 🎯 **Lesson Filter**: Select specific lessons or choose "All Lessons" for a mixed quiz.
- 📊 **3 Difficulty Levels**: Easy, Medium, Hard – suitable for various skill levels.
- 🧠 **Dynamic Questions**: Some questions include randomized parameters (material names, density values, etc.) for varied practice.
- 🖼️ **Image Support**: Questions with visual illustrations are fully supported.
- 📐 **Math Formula Rendering**: Integrated with MathJax for beautiful formula display.
- 🌙 **Dark Mode Interface**: Modern dark theme designed to reduce eye strain.
- 📈 **Instant Feedback**: View correct answers and detailed explanations immediately after each question.
- 🏆 **Score Tracking**: See your results and performance summary after completing the quiz.

## 🚀 Installation & Running

This project uses `fetch()` to load data from `data.json`, so you need to run it on a **local server** (do not open the HTML file directly in your browser).

### Method 1: Using Live Server (VS Code)

1. Install the **Live Server** extension (if not already installed).
2. Open the project folder in VS Code.
3. Right-click on `index.html` → select **Open with Live Server**.

### Method 2: Using Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Method 3: Using Node.js (http-server)

```bash
npx http-server
```

## 📁 Project Structure

```text
physics08-semester1-quiz/
├── index.html              # Main entry page
├── data.json               # Question bank
├── script.js               # Core application logic
├── README.md               # Documentation
└── LICENSE                 # MIT License
```

## 🛠️ Technologies Used

- HTML5
- Tailwind CSS – Utility-first CSS framework
- MathJax – Math formula rendering
- JavaScript (ES6+) – Dynamic logic and data handling

## 📝 Lesson List

| # | Lesson Title
| :--- | :---: |
| 1 | Density |
| 2 | Practical: Determining Density |
| 3 | Pressure on a Surface |
| 4 | Fluid Pressure. Atmospheric Pressure |
| 5 | Archimedes' Principle |
| 6 | Rotational Effect of Force. Moment of Force |
| 7 | Levers and Their Applications |

## 🤝 Contributing
Contributions are welcome! Please feel free to submit issues or pull requests to improve the project.

## 📄 License
This project is distributed under the MIT License. Created by Deepseek and Gemini with my idea.
