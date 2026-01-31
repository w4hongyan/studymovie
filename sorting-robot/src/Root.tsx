import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SortingAlgorithm"
        component={MyComposition}
        durationInFrames={1350} // 45s * 30fps
        fps={30}
        width={1080} // Short format (vertical or square? User said "Short级" usually implies 9:16 vertical, but "Warehouse" might be wide. 1080x1920 is standard for Shorts)
        height={1920}
      />
    </>
  );
};
