import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Robot } from '../components/Robot';
import { Ground } from '../components/Ground';
import { COLORS, LAYOUT, FONT_FAMILY } from '../utils/constants';

const NUMBERS = [5, 1, 4, 2, 3];

export const HookScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const startX = (width - (NUMBERS.length * (LAYOUT.robotWidth + LAYOUT.robotGap))) / 2;
    const groundY = LAYOUT.groundY;

	return (
		<AbsoluteFill style={{ backgroundColor: 'black' }}>
			<div style={{
                position: 'absolute',
                top: 100,
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontSize: 50,
                fontFamily: FONT_FAMILY,
                fontWeight: 'bold',
                opacity: interpolate(frame, [10, 30], [0, 1])
            }}>
                机器人要按编号排队进仓库
            </div>

            <Ground y={groundY + 110} width={width} />

			{NUMBERS.map((num, index) => {
				const delay = index * 5; // Staggered fall
				const drop = spring({
					frame: frame - delay,
					fps,
					from: -200,
					to: groundY,
					damping: 12,
					stiffness: 100,
				});

                const x = startX + index * (LAYOUT.robotWidth + LAYOUT.robotGap);

				return (
					<Robot
						key={index}
						number={num}
						x={x}
						y={drop}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
