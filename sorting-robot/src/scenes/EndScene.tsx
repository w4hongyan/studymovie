import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Robot } from '../components/Robot';
import { Ground } from '../components/Ground';
import { COLORS, LAYOUT, FONT_FAMILY } from '../utils/constants';

const FINAL_SORTED = [1, 2, 3, 4, 5];
const UNSORTED_GHOST = [5, 1, 4, 2, 3];

export const EndScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const startX = (width - (FINAL_SORTED.length * (LAYOUT.robotWidth + LAYOUT.robotGap))) / 2;
    const groundY = LAYOUT.groundY;

    // Phase 1: Acceleration (0-5s -> 0-150 frames)
    // Just show them flashing and moving quickly to final spots.
    // Or just show them sorted with a "Flash" effect.
    
    // Phase 2: Result (5-12s -> 150-360 frames)
    // Left: Unsorted (Ghost), Right: Sorted (Glowing)
    
    // Phase 3: Title (12-15s -> 360-450 frames)
    
    const showResult = frame > 150;
    const showTitle = frame > 360;

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.background }}>
            <Ground y={groundY + 110} width={width} />

            {/* Fast Forward Effect */}
            {!showResult && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '40%',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: 100,
                        color: COLORS.warning,
                        opacity: interpolate(frame % 10, [0, 5, 10], [0.5, 1, 0.5])
                    }}>⚡</div>
                     {FINAL_SORTED.map((num, index) => (
                        <Robot
                            key={index}
                            number={num}
                            x={startX + index * (LAYOUT.robotWidth + LAYOUT.robotGap)}
                            y={groundY}
                            // Jitter like crazy
                            scale={1}
                            color={index % 2 === 0 ? COLORS.secondary : COLORS.robotBody}
                        />
                    ))}
                </>
            )}

            {/* Comparison */}
            {showResult && !showTitle && (
                <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'row' }}>
                    {/* Left: Unsorted Ghost */}
                    <div style={{ flex: 1, position: 'relative', opacity: 0.5, transform: 'scale(0.8)' }}>
                        <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center', color: 'white', fontSize: 40, fontFamily: FONT_FAMILY }}>一开始</div>
                         {UNSORTED_GHOST.map((num, index) => (
                            <Robot
                                key={index}
                                number={num}
                                x={50 + index * 80}
                                y={groundY}
                                color={COLORS.robotBody}
                            />
                        ))}
                    </div>
                    
                    {/* Right: Sorted */}
                    <div style={{ flex: 1, position: 'relative' }}>
                         <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center', color: COLORS.secondary, fontSize: 40, fontWeight: 'bold', fontFamily: FONT_FAMILY }}>排队完成！</div>
                         {FINAL_SORTED.map((num, index) => (
                            <Robot
                                key={index}
                                number={num}
                                x={50 + index * 80}
                                y={groundY - 20} // Slightly lifted
                                isSorted={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Title Card */}
            {showTitle && (
                 <AbsoluteFill style={{ backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                     <div style={{ fontSize: 100, color: 'white', fontWeight: 'bold', fontFamily: FONT_FAMILY }}>
                         冒泡排序
                     </div>
                     <div style={{ fontSize: 40, color: 'white', marginTop: 20, fontFamily: FONT_FAMILY }}>
                         从左到右，慢慢变整齐
                     </div>
                     
                     {/* Sorting Robot Character */}
                     <div style={{ marginTop: 50 }}>
                         <Robot number={0} x={-50} y={0} scale={1.5} color={COLORS.secondary} />
                     </div>
                 </AbsoluteFill>
            )}
		</AbsoluteFill>
	);
};
