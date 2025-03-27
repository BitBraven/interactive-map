import { CANVAS_MAP, MAP_SCALE } from '../../config/config-manager.js';
import { currentWallpaperMatrix, redrawCanvas } from '../../rendering/canvas-manager.js';
import { createInteractiveMapTooltip } from '../../ui/ui-manager.js';
import { getRelativeCoordinates } from '../../utilities/utils.js';

let isEnabled = false;
let points = [];
const circleRadius = 8;

// Tooltip Elements
let tooltip = null;
let tooltipName = null;
let tooltipDesc = null;
let isVisible = false;

// Cache transformed coordinates
let cachedPoints = [];

const drawMeasurement = function (ctx) {
	if (!isEnabled || !ctx) return;

	ctx.save();
	ctx.setTransform(currentWallpaperMatrix);

	// Draw connection lines
	if (cachedPoints.length > 1) {
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(230, 33, 33, 0.8)';
		ctx.lineWidth = 4;

		cachedPoints.forEach((p, i) => {
			if (i === 0) {
				ctx.moveTo(p.x, p.y);
			} else {
				ctx.lineTo(p.x, p.y);
			}
		});

		ctx.stroke();
	}

	// Draw points
	cachedPoints.forEach(p => {
		ctx.beginPath();
		ctx.arc(p.x, p.y, circleRadius, 0, Math.PI * 2);

		// Set the fill color
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.fill();

		// Add a black outline
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 3;
		ctx.stroke();
	});

	ctx.restore();
};

const updateCachedPoints = () => {
	cachedPoints = [...points];
	redrawCanvas();
};

window.addEventListener('overlaysUpdated', (event) => {
	const { ctxOverlays } = event.detail;
	drawMeasurement(ctxOverlays);
});

const getNaturalCoordinates = (event) => {
	const mousePos = getRelativeCoordinates(event, CANVAS_MAP);
	const point = new DOMPoint(mousePos.x, mousePos.y);
	return currentWallpaperMatrix.inverse().transformPoint(point);
};

const handleMouseDown = (event) => {
	if (event.button === 0) {
		// Left click
		const naturalPos = getNaturalCoordinates(event);
		points.push(naturalPos);
		updateCachedPoints();
	}
	else if (event.button === 2) {
		// Right click
		points = [];
		updateCachedPoints();
		return;
	}
};

// In distance-measurement-tool.js
const calculateRealDistance = (pointA, pointB) => {
	// Calculate distance in natural map pixels
	const dx = pointB.x - pointA.x;
	const dy = pointB.y - pointA.y;
	const pixelDistance = Math.sqrt(dx * dx + dy * dy);

	// Convert to real-world units
	return pixelDistance * MAP_SCALE.distancePerMapPixel;
};

const handleMouseMove = (event) => {
	if (!tooltip) return;

	const naturalPos = getNaturalCoordinates(event);
	let totalDistance = 0;
	let segmentDistance = 0;

	// Calculate total distance
	if (points.length > 1) {
		for (let i = 1; i < points.length; i++) {
			totalDistance += calculateRealDistance(points[i - 1], points[i]);
		}
	}

	// Calculate distance from last point
	if (points.length > 0) {
		segmentDistance = calculateRealDistance(points[points.length - 1], naturalPos);
	}

	// Update tooltip text
	tooltipDesc.textContent = `Total: ${totalDistance.toFixed(1)} ${MAP_SCALE.distanceUnit}\n`;
	tooltipDesc.textContent += `Current: ${segmentDistance.toFixed(1)} ${MAP_SCALE.distanceUnit}`;

	// Position tooltip relative to canvas
	const rect = CANVAS_MAP.getBoundingClientRect();
	const xOffset = 15 * window.devicePixelRatio;
	const yOffset = 15 * window.devicePixelRatio;

	tooltip.style.left = `${event.clientX - rect.left + xOffset}px`;
	tooltip.style.top = `${event.clientY - rect.top + yOffset}px`;

	if (!isVisible) {
		tooltip.classList.add('visible');
		isVisible = true;
	}
};

const createTooltip = () => {
	tooltipName = document.createElement('div');
	tooltipName.style.fontWeight = 'bold';
	tooltipName.textContent = 'Distance:';

	tooltipDesc = document.createElement('div');
	tooltipDesc.style.whiteSpace = 'pre-line'; 
	tooltipDesc.style.fontWeight = 'normal';
	tooltipDesc.style.color = 'rgb(204, 204, 204)';
	tooltipDesc.style.fontSize = '0.9em';
	tooltipDesc.textContent += `0 ${MAP_SCALE.distanceUnit}`;

	tooltip = createInteractiveMapTooltip('map-area-tooltip', {
		children: [tooltipName, tooltipDesc],
	});
};

export const enableDistanceMeasurement = (enable) => {
	if(!MAP_SCALE) return;
	isEnabled = enable;

	if (enable) {
		createTooltip();
		CANVAS_MAP.addEventListener('mousedown', handleMouseDown);
		CANVAS_MAP.addEventListener('mousemove', handleMouseMove);
	} else {
		points = [];
		cachedPoints = [];
		CANVAS_MAP.removeEventListener('mousedown', handleMouseDown);
		CANVAS_MAP.removeEventListener('mousemove', handleMouseMove);
		redrawCanvas();

		if (tooltip) {
			tooltip.remove();
			isVisible = false;
		}
	}
};