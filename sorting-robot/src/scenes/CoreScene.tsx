import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { Robot } from '../components/Robot';
import { Ground } from '../components/Ground';
import { COLORS, LAYOUT, FONT_FAMILY } from '../utils/constants';

const INITIAL_NUMBERS = [5, 1, 4, 2, 3];

// Define the sequence of events
// Each event has a start frame and duration
// 30 FPS assumed for timing logic, but will adapt
const FPS = 30;
const EVENTS = [
    { start: 0, duration: 60, type: 'scan', indices: [0, 1] }, // Scan 5, 1
    { start: 60, duration: 60, type: 'swap', indices: [0, 1], from: [5, 1, 4, 2, 3], to: [1, 5, 4, 2, 3] }, // Swap
    { start: 120, duration: 30, type: 'scan', indices: [1, 2] }, // Scan 5, 4
    { start: 150, duration: 30, type: 'swap', indices: [1, 2], from: [1, 5, 4, 2, 3], to: [1, 4, 5, 2, 3] },
    { start: 180, duration: 30, type: 'scan', indices: [2, 3] }, // Scan 5, 2
    { start: 210, duration: 30, type: 'swap', indices: [2, 3], from: [1, 4, 5, 2, 3], to: [1, 4, 2, 5, 3] },
    { start: 240, duration: 30, type: 'scan', indices: [3, 4] }, // Scan 5, 3
    { start: 270, duration: 30, type: 'swap', indices: [3, 4], from: [1, 4, 2, 5, 3], to: [1, 4, 2, 3, 5] },
    { start: 300, duration: 60, type: 'sorted', index: 4 }, // 5 is sorted
];

export const CoreScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const startX = (width - (INITIAL_NUMBERS.length * (LAYOUT.robotWidth + LAYOUT.robotGap))) / 2;
    const groundY = LAYOUT.groundY;

    // Determine current state based on frame
    const currentState = useMemo(() => {
        let currentArray = [...INITIAL_NUMBERS];
        let activeIndices: number[] = [];
        let sortedIndices: number[] = [];
        let isSwapping = false;
        let swapProgress = 0;
        let swapIndices: number[] = [];
        let scanIndices: number[] = [];

        // Apply events up to current frame
        for (const event of EVENTS) {
            if (frame >= event.start + event.duration) {
                // Event finished
                if (event.type === 'swap' && event.to) {
                    currentArray = event.to;
                }
                if (event.type === 'sorted') {
                    sortedIndices.push(event.index);
                }
            } else if (frame >= event.start) {
                // Event in progress
                const progress = interpolate(frame, [event.start, event.start + event.duration], [0, 1], { extrapolateRight: 'clamp' });
                
                if (event.type === 'scan') {
                    activeIndices = event.indices;
                    scanIndices = event.indices;
                }
                if (event.type === 'swap') {
                    activeIndices = event.indices;
                    swapIndices = event.indices;
                    isSwapping = true;
                    swapProgress = progress;
                }
                if (event.type === 'sorted') {
                    sortedIndices.push(event.index); // Mark as sorted during animation too
                }
            }
        }
        
        return { currentArray, activeIndices, sortedIndices, isSwapping, swapProgress, swapIndices, scanIndices };
    }, [frame]);

    // Render Logic
    // We need to map values to positions.
    // If swapping, we interpolate positions of the swapping elements.
    
    // Create a map of Value -> Current Index (visual)
    const getVisualPosition = (val: number, index: number) => {
        let x = startX + index * (LAYOUT.robotWidth + LAYOUT.robotGap);
        let y = groundY;
        let scale = 1;

        if (currentState.isSwapping && currentState.swapIndices.includes(index)) {
             // Logic to interpolate X if this index is involved in swap
             // But wait, the 'index' here is the index in the *currentArray* (which changes *after* swap)
             // Actually, for the swap animation, we should look at the 'from' array of the current event.
             // This is tricky with the loop above.
             // Simplification:
             // If swapping, we are transitioning from 'from' to 'to'.
             // We need to know where the value IS in 'from' and where it IS in 'to'.
             // But my currentState logic updates currentArray only after event.
             // So during swap, currentArray is 'from'.
             
             const swapEvent = EVENTS.find(e => frame >= e.start && frame < e.start + e.duration && e.type === 'swap');
             if (swapEvent) {
                 const idx1 = swapEvent.indices[0];
                 const idx2 = swapEvent.indices[1];
                 
                 // If this is one of the swapping items
                 if (index === idx1) {
                     // Move to idx2
                     const x1 = startX + idx1 * (LAYOUT.robotWidth + LAYOUT.robotGap);
                     const x2 = startX + idx2 * (LAYOUT.robotWidth + LAYOUT.robotGap);
                     
                     // Arc movement? Or slide.
                     // User said "Elastic slide".
                     x = interpolate(currentState.swapProgress, [0, 1], [x1, x2], { easing: Easing.elastic(1) });
                     
                     // Jump a bit
                     y -= Math.sin(currentState.swapProgress * Math.PI) * 50;
                 } else if (index === idx2) {
                     // Move to idx1
                     const x1 = startX + idx1 * (LAYOUT.robotWidth + LAYOUT.robotGap);
                     const x2 = startX + idx2 * (LAYOUT.robotWidth + LAYOUT.robotGap);
                     x = interpolate(currentState.swapProgress, [0, 1], [x2, x1], { easing: Easing.elastic(1) });
                     y -= Math.sin(currentState.swapProgress * Math.PI) * 50;
                 }
             }
        }

        if (currentState.activeIndices.includes(index)) {
            // Scanning effect (scale up)
             if (!currentState.isSwapping) {
                 scale = 1.1 + Math.sin(frame * 0.5) * 0.05;
             }
        }
        
        if (currentState.sortedIndices.includes(index)) {
            y -= 10; // Rise up
        }

        return { x, y, scale };
    };


	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.background }}>
             {/* Scanner Light */}
             {currentState.scanIndices.length > 0 && (
                 <div style={{
                     position: 'absolute',
                     left: startX + currentState.scanIndices[0] * (LAYOUT.robotWidth + LAYOUT.robotGap) - 10,
                     top: 0,
                     width: (LAYOUT.robotWidth + LAYOUT.robotGap) * 2,
                     height: '100%',
                     background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 100%)',
                     borderLeft: '2px solid rgba(59, 130, 246, 0.5)',
                     borderRight: '2px solid rgba(59, 130, 246, 0.5)',
                     opacity: interpolate(frame % 20, [0, 10, 20], [0.5, 0.8, 0.5])
                 }} />
             )}

            <Ground y={groundY + 110} width={width} />

            {/* Render Robots based on currentArray */}
            {/* Note: During swap, we use the 'from' array order for mapping indices to values, but calculate positions dynamically */}
			{currentState.currentArray.map((num, index) => {
                 // To handle key continuity for React (important for animation), we should use 'num' as key if unique.
                 // Numbers are unique: 1,2,3,4,5.
                 
                 // We need to find the VISUAL index of this number.
                 // In the render loop, 'index' is the current position in the array.
                 const pos = getVisualPosition(num, index);

                 const isScanning = currentState.activeIndices.includes(index);
                 const isSorted = currentState.sortedIndices.includes(index);

				return (
					<Robot
						key={num}
						number={num}
						x={pos.x}
						y={pos.y}
                        scale={pos.scale}
                        isScanning={isScanning}
                        isSorted={isSorted}
                        isActive={isScanning} // Highlight color
					/>
				);
			})}

            {/* Captions */}
            <div style={{
                position: 'absolute',
                bottom: 100,
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontSize: 40,
                fontFamily: FONT_FAMILY
            }}>
                {currentState.scanIndices.length > 0 && !currentState.isSwapping && "从左到右，两个两个比"}
                {currentState.isSwapping && "大的站右边！"}
                {currentState.sortedIndices.includes(4) && "最大号码，已经排好了！"}
            </div>
		</AbsoluteFill>
	);
};
