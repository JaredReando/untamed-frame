import EXIF from "exif-js";

export const getEXIFImageTags = async (imageFile: File) => {
  const exifData = await new Promise((res, rej) => {
    //@ts-ignore
    EXIF.getData(imageFile, function () {
      try {
        //@ts-ignore
        const allTags = EXIF.getAllTags(this);
        res(allTags);
      } catch (e) {
        rej(e);
      }
    });
  });
  return exifData;
};

interface ImageConstraints {
    maxSizeInMb: number;
    minSizeInMb: number;
}

export const verifyImageFile = (imageFile: File, constraints: ImageConstraints) => { 
  if (imageFile.type.indexOf("image") === -1) {
    throw new Error("File is not an image");
  }
  const imageSizeInMb = imageFile.size / 1_000_000
  if (imageSizeInMb > constraints.maxSizeInMb || imageSizeInMb < constraints.minSizeInMb) {
    throw new Error(`Image size must be between ${constraints.minSizeInMb} and ${constraints.maxSizeInMb} MB`)
  }
  return true
}

export const drawImageToCanvas = (
    image: HTMLImageElement,
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Unkown error occurred. Please refresh page and try again");
    }
    canvas.width = image.naturalWidth + 100;
    canvas.height = image.naturalHeight + 100;
  
    ctx.drawImage(image, 50, 50);
  };

  export const saveImageToDataURL = (imageFile: File) => {
    return URL.createObjectURL(imageFile);
  }

  export const revokeImageDataURL = (imageDataURL: string) => {
    URL.revokeObjectURL(imageDataURL);
    return true;
  }