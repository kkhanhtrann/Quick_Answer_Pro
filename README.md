
# Quick-Answer Pro

Quick-Answer Pro is a Tauri-based web application that helps users quickly and easily get answers by uploading images. Built with vanilla HTML, CSS, and JavaScript, it leverages Tauri's Rust backend to process image uploads and return responses.

## Features

- Drag-and-drop image upload functionality.
- Instant answers processed via Rust backend.
- Clean and responsive user interface.
- Integrated with LinkedIn for quick social access.

## Getting Started

This template will help you start developing with Tauri in vanilla HTML, CSS, and JavaScript.

### Prerequisites

Make sure you have the following tools installed:

- [Rust](https://www.rust-lang.org/)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites/)
- [Node.js](https://nodejs.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kkhanhtrann/Quick_Answer_Pro.git
   cd Quick_Answer_Pro
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Build the Tauri application:

   ```bash
   npm run tauri build
   ```

### Usage

1. Start the Tauri development environment:

   ```bash
   npm run tauri dev
   ```

2. Open the app in your browser. You will see the main page where you can upload an image for instant answers.

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Project Structure

- `index.html`: The main landing page where users can upload an image to get answers.
- `answer.html`: Displays the processed answer after image submission.
- `main.js`: Handles the front-end logic, including file uploads, drag-and-drop functionality, and interaction with the Tauri backend.
- `styles.css`: Contains the application's styling for a clean and responsive UI.
- `aimodel.rs`: Rust backend logic that processes the image and returns answers using an AI model.
- `main.rs`: The main entry point for the Tauri application.

