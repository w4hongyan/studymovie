import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../utils/constants';

interface RobotProps {
	number: number;
	x: number;
	y: number;
	scale?: number;
	isScanning?: boolean;
	isSorted?: boolean;
	isActive?: boolean; // For comparison
	color?: string;
}

export const Robot: React.FC<RobotProps> = ({
	number,
	x,
	y,
	scale = 1,
	isScanning = false,
	isSorted = false,
	isActive = false,
	color = COLORS.robotBody,
}) => {
	const frame = useCurrentFrame();

	// Simple jitter effect when scanning
	const jitter = isScanning
		? Math.sin(frame * 0.8) * 3
		: 0;

	// Color logic
	const bodyColor = isSorted
		? COLORS.secondary
		: isActive
		? COLORS.primary
		: color;

	const glow = isSorted
		? 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.8))'
		: isActive
		? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))'
		: 'none';

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `scale(${scale}) translateX(${jitter}px)`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				filter: glow,
			}}
		>
			{/* Robot Head */}
			<svg width="100" height="120" viewBox="0 0 100 120">
				{/* Antenna */}
				<line x1="50" y1="0" x2="50" y2="20" stroke={bodyColor} strokeWidth="4" />
				<circle cx="50" cy="0" r="4" fill={isScanning ? COLORS.warning : bodyColor} />

				{/* Head */}
				<rect
					x="20"
					y="20"
					width="60"
					height="40"
					rx="10"
					fill={bodyColor}
					stroke="white"
					strokeWidth="2"
				/>
				{/* Eyes */}
				<circle cx="40" cy="40" r="5" fill="white" />
				<circle cx="60" cy="40" r="5" fill="white" />

				{/* Body */}
				<rect
					x="10"
					y="65"
					width="80"
					height="55"
					rx="10"
					fill={bodyColor}
					stroke="white"
					strokeWidth="2"
				/>
				
				{/* Chest Screen for Number */}
				<rect
					x="30"
					y="80"
					width="40"
					height="30"
					fill="white"
					opacity="0.9"
					rx="5"
				/>
			</svg>
			
			{/* Number Overlay */}
			<div
				style={{
					position: 'absolute',
					top: 80,
					width: '100%',
					textAlign: 'center',
					fontSize: 24,
					fontWeight: 'bold',
					color: '#000',
					fontFamily: 'sans-serif',
				}}
			>
				{number}
			</div>
		</div>
	);
};
