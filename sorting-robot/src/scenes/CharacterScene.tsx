import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Robot } from '../components/Robot';
import { COLORS, FONT_FAMILY } from '../utils/constants';

export const CharacterScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        from: 0,
        to: 1.5,
        config: { damping: 12 },
    });

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ transform: `scale(${scale})` }}>
			    <Robot number={0} x={-50} y={-60} color={COLORS.primary} />
            </div>

            <div style={{
                position: 'absolute',
                top: height / 2 + 100,
                textAlign: 'center',
                opacity: interpolate(frame, [20, 40], [0, 1])
            }}>
                <div style={{
                    backgroundColor: COLORS.primary,
                    padding: '10px 20px',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 40,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 'bold',
                    marginBottom: 10
                }}>
                    排序机器人
                </div>
                <div style={{ color: 'white', fontSize: 30, fontFamily: FONT_FAMILY }}>
                    让我来帮它们排队
                </div>
            </div>
		</AbsoluteFill>
	);
};
