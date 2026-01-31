import React from 'react';
import { Series } from 'remotion';
import { HookScene } from './scenes/HookScene';
import { ProblemScene } from './scenes/ProblemScene';
import { CharacterScene } from './scenes/CharacterScene';
import { CoreScene } from './scenes/CoreScene';
import { EndScene } from './scenes/EndScene';

export const MyComposition: React.FC = () => {
	return (
		<Series>
			<Series.Sequence durationInFrames={90}>
				<HookScene />
			</Series.Sequence>
			<Series.Sequence durationInFrames={150}>
				<ProblemScene />
			</Series.Sequence>
			<Series.Sequence durationInFrames={120}>
				<CharacterScene />
			</Series.Sequence>
			<Series.Sequence durationInFrames={540}>
				<CoreScene />
			</Series.Sequence>
			<Series.Sequence durationInFrames={450}>
				<EndScene />
			</Series.Sequence>
		</Series>
	);
};
