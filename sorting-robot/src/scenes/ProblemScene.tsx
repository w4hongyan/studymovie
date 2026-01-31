import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Robot } from '../components/Robot';
import { Ground } from '../components/Ground';
import { COLORS, LAYOUT, FONT_FAMILY } from '../utils/constants';

const NUMBERS = [5, 1, 4, 2, 3];

export const ProblemScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const startX = (width - (NUMBERS.length * (LAYOUT.robotWidth + LAYOUT.robotGap))) / 2;
    const groundY = LAYOUT.groundY;

    // Door animation
    const doorProgress = spring({
        frame,
        fps,
        config: { damping: 20 },
    });
    
    const doorHeight = interpolate(doorProgress, [0, 1], [0, height]);
    const doorY = interpolate(doorProgress, [0, 1], [-height, 0]);


    // Red X animation
    const xScale = spring({
        frame: frame - 20,
        fps,
        config: { damping: 10 },
    });

	return (
		<AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Robots (Static) */}
            <Ground y={groundY + 110} width={width} />
			{NUMBERS.map((num, index) => {
                const x = startX + index * (LAYOUT.robotWidth + LAYOUT.robotGap);
				return (
					<Robot
						key={index}
						number={num}
						x={x}
						y={groundY}
					/>
				);
			})}

            {/* Warehouse Door Overlay - simplified as a red overlay or gate */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                opacity: interpolate(frame, [0, 15], [0, 0.8]),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                 {/* Red X */}
                 <svg width="200" height="200" viewBox="0 0 100 100" style={{ transform: `scale(${Math.max(0, xScale)})` }}>
                     <line x1="20" y1="20" x2="80" y2="80" stroke={COLORS.danger} strokeWidth="10" strokeLinecap="round" />
                     <line x1="80" y1="20" x2="20" y2="80" stroke={COLORS.danger} strokeWidth="10" strokeLinecap="round" />
                 </svg>
                 
                 <div style={{
                     color: COLORS.danger,
                     fontSize: 60,
                     fontWeight: 'bold',
                     fontFamily: FONT_FAMILY,
                     marginTop: 20,
                     opacity: interpolate(frame, [20, 30], [0, 1])
                 }}>
                     现在这样，进不了仓库！
                 </div>
            </div>
		</AbsoluteFill>
	);
};
