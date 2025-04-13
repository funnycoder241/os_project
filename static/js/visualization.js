/**
 * Page Replacement Algorithm Visualization
 * This file handles the visualization of memory frames and page replacement algorithms
 */

class PageReplacementVisualizer {
    constructor() {
        this.animationSpeed = 1000; // milliseconds
        this.isAnimating = false;
        this.animationQueue = {};
    }

    /**
     * Set animation speed globally
     * @param {number} speed - Speed value from 1-10
     */
    setAnimationSpeed(speed) {
        // Convert speed value (1-10) to milliseconds (1500-300)
        this.animationSpeed = 1500 - ((speed - 1) * 120);
        
        // Update all individual algorithm speed controls
        document.querySelectorAll('[id$="-speed"]').forEach(control => {
            control.value = this.animationSpeed;
        });
    }

    /**
     * Create visualization containers for each algorithm
     * @param {Array} algorithms - List of algorithms to visualize
     */
    createVisualizationContainers(algorithms) {
        const container = document.querySelector('.algorithm-results');
        container.innerHTML = '';

        algorithms.forEach(algorithm => {
            const algorithmContainer = document.createElement('div');
            algorithmContainer.className = 'algorithm-container';
            algorithmContainer.id = `${algorithm.toLowerCase()}-container`;

            const header = document.createElement('div');
            header.className = 'algorithm-header';
            header.textContent = this.getAlgorithmFullName(algorithm);

            const stats = document.createElement('div');
            stats.className = 'algorithm-stats';
            stats.id = `${algorithm.toLowerCase()}-stats`;
            stats.innerHTML = `
                <div>Page Faults: <span id="${algorithm.toLowerCase()}-faults">0</span></div>
                <div>Hit Ratio: <span id="${algorithm.toLowerCase()}-hit-ratio">0%</span></div>
                <div>Execution Time: <span id="${algorithm.toLowerCase()}-time">0 ms</span></div>
            `;

            const framesContainer = document.createElement('div');
            framesContainer.className = 'memory-frames';
            framesContainer.id = `${algorithm.toLowerCase()}-frames`;

            const sequenceContainer = document.createElement('div');
            sequenceContainer.className = 'page-sequence';
            sequenceContainer.id = `${algorithm.toLowerCase()}-sequence`;

            const controls = document.createElement('div');
            controls.className = 'animation-controls';
            controls.innerHTML = `
                <button id="${algorithm.toLowerCase()}-play" class="play-btn"><i class="fas fa-play"></i> Play Animation</button>
                <div class="speed-control">
                    <span>Speed:</span>
                    <input type="range" id="${algorithm.toLowerCase()}-speed" min="300" max="1500" value="${this.animationSpeed}" step="100">
                </div>
            `;

            algorithmContainer.appendChild(header);
            algorithmContainer.appendChild(stats);
            algorithmContainer.appendChild(framesContainer);
            algorithmContainer.appendChild(sequenceContainer);
            algorithmContainer.appendChild(controls);

            container.appendChild(algorithmContainer);
        });
    }

    /**
     * Get the full name of an algorithm
     * @param {string} algorithm - Algorithm identifier
     * @returns {string} Full algorithm name
     */
    getAlgorithmFullName(algorithm) {
        switch (algorithm.toLowerCase()) {
            case 'fifo':
                return 'FIFO (First-In-First-Out)';
            case 'lru':
                return 'LRU (Least Recently Used)';
            case 'optimal':
                return 'Optimal Algorithm';
            case 'ai-lstm':
                return 'AI-Based (LSTM Model)';
            case 'ai-simple':
                return 'AI-Simple (Advanced)';
            default:
                return algorithm;
        }
    }

    /**
     * Initialize the memory frames for visualization
     * @param {string} algorithm - Algorithm identifier
     * @param {number} frameCount - Number of memory frames
     */
    initializeFrames(algorithm, frameCount) {
        const framesContainer = document.getElementById(`${algorithm.toLowerCase()}-frames`);
        framesContainer.innerHTML = '';

        for (let i = 0; i < frameCount; i++) {
            const frame = document.createElement('div');
            frame.className = 'frame';
            frame.id = `${algorithm.toLowerCase()}-frame-${i}`;
            frame.textContent = '-';
            framesContainer.appendChild(frame);
        }
    }

    /**
     * Initialize the page sequence for visualization
     * @param {string} algorithm - Algorithm identifier
     * @param {Array} pageSequence - Array of page references
     */
    initializeSequence(algorithm, pageSequence) {
        const sequenceContainer = document.getElementById(`${algorithm.toLowerCase()}-sequence`);
        sequenceContainer.innerHTML = '';

        pageSequence.forEach((page, index) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'page-reference';
            pageElement.id = `${algorithm.toLowerCase()}-page-${index}`;
            pageElement.textContent = page;
            sequenceContainer.appendChild(pageElement);
        });
    }

    /**
     * Update the statistics display for an algorithm
     * @param {string} algorithm - Algorithm identifier
     * @param {Object} results - Simulation results
     * @param {number} totalPages - Total number of pages in sequence
     */
    updateStats(algorithm, results, totalPages) {
        const faultsElement = document.getElementById(`${algorithm.toLowerCase()}-faults`);
        const hitRatioElement = document.getElementById(`${algorithm.toLowerCase()}-hit-ratio`);
        const timeElement = document.getElementById(`${algorithm.toLowerCase()}-time`);

        const hitRatio = totalPages ? (totalPages - results.pageFaults) / totalPages : 0;
        
        faultsElement.textContent = results.pageFaults;
        hitRatioElement.textContent = `${(hitRatio * 100).toFixed(2)}%`;
        timeElement.textContent = `${results.executionTime.toFixed(2)} ms`;
        
        // Store hit ratio in results for charts
        results.hitRatio = hitRatio;
    }

    /**
     * Animate the page replacement process
     * @param {string} algorithm - Algorithm identifier
     * @param {Object} results - Simulation results
     */
    animateReplacement(algorithm, results) {
        const algoId = algorithm.toLowerCase();
        
        // Stop any existing animation for this algorithm
        if (this.animationQueue[algoId]) {
            this.animationQueue[algoId].forEach(timeoutId => clearTimeout(timeoutId));
            this.animationQueue[algoId] = [];
        }
        
        const pageStatus = results.pageStatus;
        let currentStep = 0;

        // Reset all page references
        const pageElements = document.querySelectorAll(`#${algoId}-sequence .page-reference`);
        pageElements.forEach(el => {
            el.classList.remove('page-hit', 'page-fault');
        });
        
        // Reset all frames
        const frameElements = document.querySelectorAll(`#${algoId}-frames .frame`);
        frameElements.forEach(el => {
            el.textContent = '-';
            el.classList.remove('frame-updated');
        });

        // Get animation speed from the algorithm's speed control
        const speedControl = document.getElementById(`${algoId}-speed`);
        const animationSpeed = parseInt(speedControl.value);
        
        // Update play button to show it's playing
        const playButton = document.getElementById(`${algoId}-play`);
        playButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
        playButton.classList.add('playing');
        
        // Initialize animation queue
        this.animationQueue[algoId] = [];
        
        // Create animation steps with appropriate timing
        for (let step = 0; step < pageStatus.length; step++) {
            const timeoutId = setTimeout(() => {
                const status = pageStatus[step];
                const pageElement = document.getElementById(`${algoId}-page-${step}`);
                
                // Update page reference status (hit or fault)
                if (status.isHit) {
                    pageElement.classList.add('page-hit');
                } else {
                    pageElement.classList.add('page-fault');
                }
                
                // Update frames
                for (let i = 0; i < status.frames.length; i++) {
                    const frameElement = document.getElementById(`${algoId}-frame-${i}`);
                    frameElement.textContent = status.frames[i] || '-';
                    
                    // Highlight the frame if it was just updated
                    if (!status.isHit && status.replacedIndex === i) {
                        frameElement.classList.add('frame-updated');
                        setTimeout(() => {
                            frameElement.classList.remove('frame-updated');
                        }, animationSpeed * 0.8);
                    }
                }
                
                // If this is the last step, reset the play button
                if (step === pageStatus.length - 1) {
                    playButton.innerHTML = '<i class="fas fa-play"></i> Play Animation';
                    playButton.classList.remove('playing');
                }
            }, step * animationSpeed);
            
            this.animationQueue[algoId].push(timeoutId);
        }
    }

    /**
     * Set up event listeners for animation controls
     * @param {string} algorithm - Algorithm identifier
     * @param {Object} results - Simulation results
     */
    setupAnimationControls(algorithm, results) {
        const algoId = algorithm.toLowerCase();
        const playButton = document.getElementById(`${algoId}-play`);
        const speedControl = document.getElementById(`${algoId}-speed`);

        playButton.addEventListener('click', () => {
            if (playButton.classList.contains('playing')) {
                // Stop animation if already playing
                if (this.animationQueue[algoId]) {
                    this.animationQueue[algoId].forEach(timeoutId => clearTimeout(timeoutId));
                    this.animationQueue[algoId] = [];
                }
                playButton.innerHTML = '<i class="fas fa-play"></i> Play Animation';
                playButton.classList.remove('playing');
            } else {
                // Start animation
                this.animateReplacement(algorithm, results);
            }
        });

        speedControl.addEventListener('input', () => {
            // If animation is currently playing, restart it with new speed
            if (playButton.classList.contains('playing')) {
                this.animateReplacement(algorithm, results);
            }
        });
    }

    /**
     * Visualize simulation results for an algorithm
     * @param {string} algorithm - Algorithm identifier
     * @param {Array} pageSequence - Array of page references
     * @param {number} frameCount - Number of memory frames
     * @param {Object} results - Simulation results
     */
    visualizeResults(algorithm, pageSequence, frameCount, results) {
        this.initializeFrames(algorithm, frameCount);
        this.initializeSequence(algorithm, pageSequence);
        this.updateStats(algorithm, results, pageSequence.length);
        this.setupAnimationControls(algorithm, results);
        
        // Auto-play animation after a short delay
        setTimeout(() => {
            this.animateReplacement(algorithm, results);
        }, 500);
    }

    /**
     * Create performance comparison charts
     * @param {Object} allResults - Results for all algorithms
     * @param {number} totalPages - Total number of pages in sequence
     */
    createPerformanceCharts(allResults, totalPages) {
        this.createHitMissChart(allResults);
        this.createPageFaultsChart(allResults, totalPages);
        this.createPerformanceTable(allResults);
    }

    /**
     * Create hit/miss ratio chart
     * @param {Object} allResults - Results for all algorithms
     */
    createHitMissChart(allResults) {
        const ctx = document.getElementById('hit-miss-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        
        const algorithms = Object.keys(allResults);
        const hitRatios = algorithms.map(algo => allResults[algo].hitRatio * 100);
        const missRatios = algorithms.map(algo => (1 - allResults[algo].hitRatio) * 100);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: algorithms.map(algo => this.getAlgorithmFullName(algo)),
                datasets: [
                    {
                        label: 'Hit Ratio (%)',
                        data: hitRatios,
                        backgroundColor: '#2ecc71',
                        borderColor: '#27ae60',
                        borderWidth: 1
                    },
                    {
                        label: 'Miss Ratio (%)',
                        data: missRatios,
                        backgroundColor: '#e74c3c',
                        borderColor: '#c0392b',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create page faults chart
     * @param {Object} allResults - Results for all algorithms
     * @param {number} totalPages - Total number of pages in sequence
     */
    createPageFaultsChart(allResults, totalPages) {
        const ctx = document.getElementById('page-faults-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        
        const algorithms = Object.keys(allResults);
        const pageFaults = algorithms.map(algo => allResults[algo].pageFaults);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: algorithms.map(algo => this.getAlgorithmFullName(algo)),
                datasets: [{
                    label: 'Page Faults',
                    data: pageFaults,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(...pageFaults) + 2,
                        title: {
                            display: true,
                            text: 'Number of Page Faults'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create performance summary table
     * @param {Object} allResults - Results for all algorithms
     */
    createPerformanceTable(allResults) {
        const tableBody = document.querySelector('#performance-table tbody');
        tableBody.innerHTML = '';
        
        Object.keys(allResults).forEach(algo => {
            const result = allResults[algo];
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${this.getAlgorithmFullName(algo)}</td>
                <td>${result.pageFaults}</td>
                <td>${(result.hitRatio * 100).toFixed(2)}%</td>
                <td>${result.executionTime.toFixed(2)} ms</td>
            `;
            
            // Highlight the AI-Simple row if it's present
            if (algo.toLowerCase() === 'ai-simple') {
                row.classList.add('ai-row');
            }
            
            tableBody.appendChild(row);
        });
    }
}

// Create a global instance of the visualizer
const pageReplacementVisualizer = new PageReplacementVisualizer();
