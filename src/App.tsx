import { SyntheticEvent, useState } from "react";
import "./styles.css";
import { getEXIFImageTags, verifyImageFile, drawImageToCanvas } from "./utils/image_utils";

export default function App() {
  const [statefulDataURl, setStatefulDataURL] = useState("");
  const handleFileChange = async (
    fileEvent: SyntheticEvent<HTMLInputElement>
  ) => {
    fileEvent.preventDefault();
    if (
      fileEvent.currentTarget.value.length === 0 ||
      !fileEvent.currentTarget.files
    ) {
      return;
    }
    const file = fileEvent.currentTarget.files[0];

    try {
      verifyImageFile(file, {maxSizeInMb: 20, minSizeInMb: 0.2});
    } catch(e) {
      console.error(e)
    }

    const exifData = await getEXIFImageTags(file);
    console.log("exif data: ", exifData);

    console.log("this is the file: ", file);
    const dataURL = URL.createObjectURL(file);
    if (statefulDataURl && statefulDataURl.includes("blob")) {
      URL.revokeObjectURL(statefulDataURl);
    }
    setStatefulDataURL(dataURL);
    console.log("file event: ", fileEvent);
  };
  return (
    <div className="App">
      <h1>Untamed Frame</h1>
      <h2>Fit an image to any picture frame size</h2>
      <div className="upload-container">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".png, .jpeg, .jpg"
        ></input>
        {statefulDataURl && (
          <img
            onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
              console.log("image load event: ", event);
              drawImageToCanvas(
                event.target as HTMLImageElement,
                document.querySelector("#preview-canvas") as HTMLCanvasElement
              );
            }}
            style={{
              border: "1px solid black",
              // width: "100%",
              height: "100%",
              maxHeight: "200px",
              objectFit: "contain"
            }}
            src={statefulDataURl}
            alt="upload preview"
          ></img>
        )}
        <div className='canvas-container'>
          <canvas id="preview-canvas"></canvas>
          <div className='photo-matte-overlay'/>
        </div>
      </div>
    </div>
  );
}
