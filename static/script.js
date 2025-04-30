$(document).ready(function(){
    const $container = $('.image-map-container');
  
    // Hover‐in: draw highlight
    $container.on('mouseenter', 'area.muscle-area', function(){
      // parse all x,y pairs
      const pts = this.coords.split(',').map(Number);
      const xs = pts.filter((_,i) => i % 2 === 0);
      const ys = pts.filter((_,i) => i % 2 === 1);
  
      // compute bounding box
      const x1 = Math.min(...xs),
            x2 = Math.max(...xs),
            y1 = Math.min(...ys),
            y2 = Math.max(...ys);
  
      // add highlight div
      const $hl = $('<div class="muscle-highlight"></div>').css({
        top:    y1,
        left:   x1,
        width:  x2 - x1,
        height: y2 - y1
      });
      $container.append($hl);
    });
  
    // Hover‐out: remove highlight
    $container.on('mouseleave', 'area.muscle-area', function(){
      $container.find('.muscle-highlight').remove();
    });
  });

// Development helper for getting SVG coordinates
function enableCoordinateHelper() {
    const container = document.querySelector('.svg-map-container');
    const svg = container.querySelector('svg');
    
    // Add dev-mode class for visibility
    container.classList.add('dev-mode');
    
    // Create UI container
    const uiContainer = document.createElement('div');
    uiContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 5px;
        font-family: monospace;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(uiContainer);

    // Create coordinate display
    const coordDisplay = document.createElement('div');
    uiContainer.appendChild(coordDisplay);

    // Create controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    `;
    uiContainer.appendChild(controlsContainer);

    // Point type selector
    const pointTypes = {
        'L': 'Line',
        'Q': 'Quadratic Curve',
        'C': 'Cubic Curve'
    };

    let currentPointType = 'L';
    let points = [];
    let controlPoints = [];

    // Create point type buttons
    Object.entries(pointTypes).forEach(([type, label]) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = `
            padding: 5px 10px;
            background: ${type === currentPointType ? '#007bff' : '#6c757d'};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        btn.addEventListener('click', () => {
            currentPointType = type;
            // Update all button styles
            controlsContainer.querySelectorAll('button').forEach(b => {
                b.style.background = b === btn ? '#007bff' : '#6c757d';
            });
        });
        controlsContainer.appendChild(btn);
    });

    // Add reset and undo buttons
    const actionButtons = [
        { text: 'Reset', action: () => { points = []; controlPoints = []; updateDisplay(); } },
        { text: 'Undo', action: () => { 
            if (controlPoints.length > 0) {
                controlPoints.pop();
            } else if (points.length > 0) {
                points.pop();
            }
            updateDisplay();
        }}
    ];

    actionButtons.forEach(({text, action}) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 5px 10px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        btn.addEventListener('click', action);
        controlsContainer.appendChild(btn);
    });

    function updateDisplay() {
        if (points.length === 0) {
            coordDisplay.textContent = 'Click to start mapping points';
            return;
        }

        let output = `Last Click: ${points[points.length - 1].join(',')}\n\n`;
        
        if (points.length > 0) {
            output += 'Path Data:\nM ' + points[0].join(',');
            let controlPointIndex = 0;

            for (let i = 1; i < points.length; i++) {
                if (points[i].type === 'Q') {
                    output += ' Q ' + controlPoints[controlPointIndex].join(',') + ' ' + points[i].join(',');
                    controlPointIndex++;
                } else if (points[i].type === 'C') {
                    output += ' C ' + 
                        controlPoints[controlPointIndex].join(',') + ' ' + 
                        controlPoints[controlPointIndex + 1].join(',') + ' ' + 
                        points[i].join(',');
                    controlPointIndex += 2;
                } else {
                    output += ' L ' + points[i].join(',');
                }
            }
            output += ' Z';
        }
        
        coordDisplay.textContent = output;
    }

    svg.addEventListener('click', (e) => {
        // Get SVG point coordinates
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        
        // Transform to SVG coordinate system
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        const x = Math.round(svgP.x);
        const y = Math.round(svgP.y);
        
        const point = [x, y];
        point.type = currentPointType;

        if (points.length > 0 && currentPointType === 'Q') {
            if (controlPoints.length === points.length - 1) {
                // If we have all control points, add the end point
                points.push(point);
            } else {
                // Add control point
                controlPoints.push(point);
            }
        } else if (points.length > 0 && currentPointType === 'C') {
            if (controlPoints.length === (points.length - 1) * 2) {
                // If we have all control points, add the end point
                points.push(point);
            } else {
                // Add control point
                controlPoints.push(point);
            }
        } else {
            points.push(point);
        }
        
        updateDisplay();
        console.log(`Added point: ${x},${y} (${currentPointType})`);
    });
}

// Call this function when in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', enableCoordinateHelper);
}