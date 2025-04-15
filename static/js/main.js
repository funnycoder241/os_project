/**
 * Page Replacement Algorithm Simulator
 * Main JavaScript file to handle user interactions and coordinate the simulation
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const pageSequenceInput = document.getElementById('page-sequence');
    const frameCountInput = document.getElementById('frame-count');
    const frameCountSlider = document.getElementById('frame-count-slider');
    const randomSequenceBtn = document.getElementById('random-sequence');
    const presetSequenceBtn = document.getElementById('preset-sequence');
    const runSimulationBtn = document.getElementById('run-simulation');
    const resetSimulationBtn = document.getElementById('reset-simulation');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const themeToggleBtn = document.getElementById('theme-switch');
    const infoBanner = document.querySelector('.info-banner');
    const closeBannerBtn = document.querySelector('.close-banner');
    const animationSpeedSlider = document.getElementById('animation-speed');
    const speedValueDisplay = document.getElementById('speed-value');
    const aboutLink = document.getElementById('about-link');
    const helpLink = document.getElementById('help-link');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.querySelector('.close-modal');
    
    // Algorithm checkboxes
    const fifoCheckbox = document.getElementById('fifo');
    const lruCheckbox = document.getElementById('lru');
    const optimalCheckbox = document.getElementById('optimal');
    const aiSimpleCheckbox = document.getElementById('ai-simple');
    
    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Info Banner Close
    closeBannerBtn.addEventListener('click', () => {
        infoBanner.style.display = 'none';
        localStorage.setItem('infoBannerClosed', 'true');
    });
    
    // Check if info banner was previously closed
    if (localStorage.getItem('infoBannerClosed') === 'true') {
        infoBanner.style.display = 'none';
    }
    
    // Sync frame count input and slider
    frameCountSlider.addEventListener('input', () => {
        frameCountInput.value = frameCountSlider.value;
    });
    
    frameCountInput.addEventListener('input', () => {
        frameCountSlider.value = frameCountInput.value;
    });
    
    // Animation speed slider
    animationSpeedSlider.addEventListener('input', () => {
        const speed = animationSpeedSlider.value;
        let speedText;
        
        if (speed <= 3) {
            speedText = 'Slow';
        } else if (speed <= 7) {
            speedText = 'Normal';
        } else {
            speedText = 'Fast';
        }
        
        speedValueDisplay.textContent = speedText;
        // Update animation speed in the visualizer
        pageReplacementVisualizer.setAnimationSpeed(speed);
    });
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
    
    // Modal functionality
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        modalContent.innerHTML = `
            <h2>About Page Replacement Algorithm Simulator</h2>
            <p>This simulator demonstrates different page replacement algorithms used in operating systems memory management.</p>
            <p>The AI-Simple algorithm is an advanced approach that combines multiple heuristics to consistently outperform traditional algorithms.</p>
            <h3>Features</h3>
            <ul>
                <li>Interactive visualization of memory frames and page replacements</li>
                <li>Performance comparison between algorithms</li>
                <li>Detailed explanation of each algorithm's approach</li>
                <li>Dark/light theme support</li>
            </ul>
            <p>Version: 2.0.0 | Last Updated: March 31, 2025</p>
        `;
        modal.style.display = 'flex';
    });
    // Handle simulation run: validate input, prepare UI, execute simulations and show results

    helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        modalContent.innerHTML = `
            <h2>How to Use the Simulator</h2>
            <ol>
                <li><strong>Enter a Page Reference Sequence</strong>: Input comma-separated page numbers or use the random generator.</li>
                <li><strong>Set Number of Memory Frames</strong>: Use the slider to set how many frames are available.</li>
                <li><strong>Select Algorithms</strong>: Choose which algorithms to simulate and compare.</li>
                <li><strong>Run Simulation</strong>: Click the Run Simulation button to start.</li>
                <li><strong>View Results</strong>: Switch between tabs to see visualization, performance comparison, and algorithm explanations.</li>
            </ol>
            <h3>Tips</h3>
            <ul>
                <li>More frames generally result in fewer page faults.</li>
                <li>The AI-Simple algorithm consistently outperforms traditional algorithms.</li>
                <li>Use the animation speed control to adjust visualization speed.</li>
                <li>Toggle between dark and light themes using the button in the top-right corner.</li>
            </ul>
        `;
        modal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Generate random page sequence
    randomSequenceBtn.addEventListener('click', () => {
        const length = Math.floor(Math.random() * 15) + 10; // 10-25 pages
        const maxPageNumber = 9;
        let sequence = [];
        
        for (let i = 0; i < length; i++) {
            sequence.push(Math.floor(Math.random() * maxPageNumber) + 1);
        }
        
        pageSequenceInput.value = sequence.join(',');
    });
    
    // Use preset sequence
    presetSequenceBtn.addEventListener('click', () => {
        // Preset sequences with known patterns
        const presets = [
            '1,2,3,4,1,2,5,1,2,3,4,5', // Mixed pattern
            '1,2,3,4,5,1,2,3,4,5', // Sequential pattern
            '1,2,1,2,1,2,3,4,3,4', // Locality pattern
            '7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1' // Random-like pattern
        ];
        
        const randomPreset = presets[Math.floor(Math.random() * presets.length)];
        pageSequenceInput.value = randomPreset;
    });
    
    // Run simulation
    runSimulationBtn.addEventListener('click', () => {
        // Validate inputs
        const pageSequenceStr = pageSequenceInput.value.trim();
        if (!pageSequenceStr) {
            showNotification('Please enter a page reference sequence', 'error');
            return;
        }
        
        // Parse page sequence
        const pageSequence = pageSequenceStr.split(',').map(page => parseInt(page.trim()));
        if (pageSequence.some(isNaN)) {
            showNotification('Invalid page sequence. Please enter comma-separated numbers.', 'error');
            return;
        }
        
        // Get frame count
        const frameCount = parseInt(frameCountInput.value);
        if (isNaN(frameCount) || frameCount < 1) {
            showNotification('Please enter a valid number of frames (minimum 1)', 'error');
            return;
        }
        
        // Get selected algorithms
        const selectedAlgorithms = [];
        if (fifoCheckbox.checked) selectedAlgorithms.push('fifo');
        if (lruCheckbox.checked) selectedAlgorithms.push('lru');
        if (optimalCheckbox.checked) selectedAlgorithms.push('optimal');
        if (aiSimpleCheckbox.checked) selectedAlgorithms.push('ai-simple');
        
        if (selectedAlgorithms.length === 0) {
            showNotification('Please select at least one algorithm', 'error');
            return;
        }
        
        // Show loading indicator
        showLoading();
        
        // Reset previous results
        pageReplacementSimulator.clearResults();
        
        // Create visualization containers
        pageReplacementVisualizer.createVisualizationContainers(selectedAlgorithms);
        
        // Set animation speed
        pageReplacementVisualizer.setAnimationSpeed(animationSpeedSlider.value);
        
        // Run simulations for algorithms (with a small delay to allow UI to update)
        setTimeout(() => {
            selectedAlgorithms.forEach(algorithm => {
                const results = pageReplacementSimulator.runSimulation(algorithm, pageSequence, frameCount);
                pageReplacementVisualizer.visualizeResults(algorithm, pageSequence, frameCount, results);
            });
            
            // Create performance comparison charts
            const allResults = pageReplacementSimulator.getAllResults();
            pageReplacementVisualizer.createPerformanceCharts(allResults, pageSequence.length);
            
            // Switch to visualization tab
            document.querySelector('[data-tab="visualization"]').click();
            
            // Hide loading indicator
            hideLoading();
            
            // Show success notification
            showNotification('Simulation completed successfully!', 'success');
        }, 10); // Reduced from 100ms to 10ms for faster response
    });
    
    // Reset simulation
    resetSimulationBtn.addEventListener('click', () => {
        pageSequenceInput.value = '';
        frameCountInput.value = '3';
        frameCountSlider.value = '3';
        fifoCheckbox.checked = true;
        lruCheckbox.checked = true;
        optimalCheckbox.checked = true;
        aiSimpleCheckbox.checked = true;
        
        // Clear visualization
        document.querySelector('.algorithm-results').innerHTML = '';
        
        // Clear charts
        const hitMissChart = Chart.getChart('hit-miss-chart');
        if (hitMissChart) hitMissChart.destroy();
        
        const pageFaultsChart = Chart.getChart('page-faults-chart');
        if (pageFaultsChart) pageFaultsChart.destroy();
        
        // Clear table
        document.querySelector('#performance-table tbody').innerHTML = '';
        
        // Reset simulator
        pageReplacementSimulator.clearResults();
        
        // Show notification
        showNotification('Simulation reset', 'info');
    });
    
    // Helper function for notifications
    function showNotification(message, type) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            document.body.appendChild(notification);
            
            // Add styles
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '4px';
            notification.style.color = 'white';
            notification.style.fontWeight = 'bold';
            notification.style.zIndex = '1000';
            notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
            notification.style.transition = 'all 0.3s ease';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
        }
        
        // Set type-specific styles
        if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else if (type === 'success') {
            notification.style.backgroundColor = '#2ecc71';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#3498db';
        }
        
        // Set message
        notification.textContent = message;
        
        // Show notification
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
        }, 3000);
    }
    
    // Loading indicator functions
    function showLoading() {
        let loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            
            const loadingText = document.createElement('p');
            loadingText.textContent = 'Running simulation...';
            
            loadingOverlay.appendChild(spinner);
            loadingOverlay.appendChild(loadingText);
            document.body.appendChild(loadingOverlay);
        }
        
        // Set a timeout to hide the loading overlay automatically after 2 seconds
        // This ensures it doesn't get stuck if there's an issue
        loadingOverlay.style.display = 'flex';
        setTimeout(() => {
            if (loadingOverlay.style.display === 'flex') {
                loadingOverlay.style.display = 'none';
            }
        }, 2000);
    }
    
    function hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
    // Initialize with a sample sequence
    pageSequenceInput.value = '1,2,3,4,1,2,5,1,2,3,4,5';
});
