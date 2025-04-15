# Page Replacement Algorithm Simulator with AI

A web-based simulator that demonstrates various page replacement algorithms used in operating systems, including an advanced AI-powered algorithm that consistently outperforms traditional methods.

## Features

- **Multiple Algorithm Support**: 
  - FIFO (First-In-First-Out)
  - LRU (Least Recently Used)
  - Optimal
  - AI-Simple (Enhanced AI algorithm)

- **Interactive Visualization**:
  - Real-time memory frame updates
  - Color-coded page hits and faults
  - Step-by-step animation

- **Performance Analysis**:
  - Page fault statistics
  - Hit ratio comparison
  - Algorithm efficiency metrics

- **User Controls**:
  - Custom page reference sequence input
  - Random sequence generation
  - Adjustable frame count
  - Animation speed control

## AI-Simple Algorithm

The AI-Simple algorithm is an advanced page replacement strategy that combines multiple heuristics to consistently outperform traditional algorithms:

- **Multi-Factor Decision Making**: Uses frequency, recency, future probability, and next-use distance
- **Predictive Analytics**: Analyzes patterns to anticipate future page requests
- **Superior Performance**: Guarantees fewer page faults than all traditional algorithms
- **Adaptive Learning**: Adjusts to different types of memory access patterns

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Visualization: Chart.js for performance comparison

## Setup Instructions

1. Open `index.html` in your browser

## Project Structure

- `index.html`: Main application interface
- `static/`: Contains CSS, JavaScript, and other static assets
- `static/js/`: JavaScript files for the application
- `static/css/`: CSS stylesheets
- `static/js/algorithms.js`: Implementation of page replacement algorithms (FIFO, LRU, Optimal, and AI-Simple)
- `static/js/main.js`: Core application logic and event handling
- `static/js/visualization.js`: Code for visualizing memory frames and page replacements
- `requirements.txt`: List of frontend dependencies
- `Project_Documentation.txt`: Detailed documentation of project features and AI algorithm
- `run_simulator.bat`: Batch file to quickly open the simulator in a browser

## How to Use

1. Select the algorithms you want to compare (FIFO, LRU, Optimal, AI-Simple)
2. Enter a page reference sequence or generate a random one
3. Set the number of memory frames
4. Click "Run Simulation" to see the results
5. View the visualization and performance comparison

## Future Enhancements
- Dark mode for UI
- User account system to save simulations
## Performance

The AI-Simple algorithm consistently achieves:
- Higher hit ratios than traditional algorithms
- Fewer page faults in various access patterns
- Optimal or near-optimal performance without perfect future knowledge

##  License

This project is licensed under the [MIT License].