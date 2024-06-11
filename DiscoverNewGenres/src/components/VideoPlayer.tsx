import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedVideo } from "@cloudinary/react";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLD,
  },
});

const VideoPlayer = (props) => {
  const { width, height, id } = props;

  return (
    <>
      {id && (
        <AdvancedVideo
          cldVid={cld.video(id).quality("auto")}
          width={width}
          height={height}
          controls
          {...props}
        />
      )}
    </>
  );
};

export default VideoPlayer;
