import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import multer from "multer";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { openAsBlob } from "fs";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2";
import exif from "jpeg-exif";
import util from "util";
import sizeOf from "buffer-image-size";

import { encode } from "blurhash";
import sharp from "sharp";

const maxAllowedFiles = Number(process.env.maxAllowedFiles);

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY!;
const secretAccessKey = process.env.SECRET_ACCESS_KEY!;
const s3Url = process.env.S3URL;
const cloudfrontUrl = process.env.CLOUDFRONT_URL;
/// DB config
const db = mysql
  .createPool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Increase the connection pool size if necessary
    idleTimeout: 10000, // 30 seconds acquisition timeout
    connectTimeout: 10000, // 10 seconds connection timeout
    keepAliveInitialDelay: 30000,
  })
  .promise();

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
  maxAttempts: 3,
});

//! If we encode the space inside filename to "%20" before uploading the image to S3, S3 will encode it again to "%2520"
function randomImageCode(bytes: number = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

function encodeFileName(originalName: string) {
  return encodeURIComponent(originalName);
}

function flattenObj(object: Record<string, any>) {
  if (typeof object !== "object" || object === null) {
    return object;
  }

  for (const key in object) {
    if (!object.hasOwnProperty(key)) continue;

    if (typeof object[key] == "object" && object[key] != null) {
      flattenObj(object[key]);
    }
    if (Array.isArray(object[key]) && object[key].length === 1) {
      object[key] = object[key][0];
    }
  }
  return object;
}

function handleShutter(shutter: number) {
  const shutterSpeed = `1/${Math.round(1 / shutter)}`;
  return shutterSpeed;
}

//* Encode image to blurhash for lazy loading placeholder
async function encodeImageToBlurhash(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    sharp(buffer)
      .raw()
      .ensureAlpha()
      .resize(32, null)
      .toBuffer((err, resizedBuffer, { width, height }) => {
        if (err) return reject(err);
        const blurhash = encode(
          new Uint8ClampedArray(resizedBuffer),
          width,
          height,
          4,
          4
        );
        resolve(blurhash);
      });
  });
}

router.get("/", (req: Request, res: Response) => {
  console.log(maxAllowedFiles);
  res.send("this is the upload api");
});

//* Image upload API
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: maxAllowedFiles }]),
  async (req: Request, res: Response) => {
    if (!req.files || !("image" in req.files)) {
      return res.status(400).json({ message: "Please select an image" });
    }
    if (req.files && "image" in req.files) {
      const images = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      ).image;
      console.log(req.files.image);
      console.log("photographer: ", req.body.photographer);
      console.log(`bucketRegion: ${bucketRegion}`);

      try {
        /// initialize response insertIds array
        let insertIds: number[] = [];
        //* for each image
        for (const image of images) {
          /// extract photo metadata with jpeg-exif
          image.originalname = Buffer.from(
            image.originalname,
            "latin1"
          ).toString("utf8");
          let metadata = exif.fromBuffer(image.buffer);

          if (metadata) {
            /// Flatten metadata
            metadata = flattenObj(metadata);
          } else {
            metadata = {};
          }
          console.log("metadata:", metadata);

          if (metadata && metadata.SubExif && metadata.SubExif.ExposureTime) {
            /// Handle shutter speed
            metadata.SubExif.ExposureTime = handleShutter(
              metadata.SubExif.ExposureTime
            );
          }

          //! Fix the resolution data for image edited in LR, Lightroom Classic does not write the Pixel*Dimension tags.
          //! https://www.reddit.com/r/Lightroom/comments/yheq9r/image_dimensions_not_included_in_exif_data_for/

          /// Use <buffer-image-size> for image dimension data instead

          const dimensionWidth = sizeOf(image.buffer).width;
          const dimensionHeight = sizeOf(image.buffer).height;
          console.log(
            `dimensionW: ${dimensionWidth}, dimensionH: ${dimensionHeight}`
          );
          metadata.XDimension = dimensionWidth;
          metadata.YDimension = dimensionHeight;

          const photographer =
            req.body.photographer ||
            metadata.Artist ||
            metadata.Copyright ||
            null;
          console.log(image);
          console.log("metadata:", metadata);
          /// random file name
          const randomCode = randomImageCode();
          const fileName =
            encodeFileName(image.originalname) + "_" + randomCode;
          const params = {
            Bucket: bucketName,
            Key: image.originalname + "_" + randomCode,
            Body: image.buffer,
            ContentType: image.mimetype,
          };
          console.log(`fileName: ${fileName}`);
          const command = new PutObjectCommand(params);
          //* send to s3
          await s3.send(command);

          //* Send image info, EXIF, blurhash to DB

          /// Generate BlurHash
          const blurhash = await encodeImageToBlurhash(image.buffer);

          const url: string = cloudfrontUrl + fileName;
          console.log(`url: ${url}`);
          const query = `insert into photos(url, photographer, original_name, exif, blurhash) values(?, ?, ?, ?, ?)`;
          // TODO: Handle EXIF, photographer and info
          const [row] = await db.query<ResultSetHeader>(query, [
            url,
            photographer,
            image.originalname,
            JSON.stringify(metadata),
            blurhash,
          ]);
          insertIds.push(row.insertId);
          console.log(
            `upload result: ${util.inspect(row, {
              showHidden: false,
              depth: null,
              colors: true,
            })}`
          );
        }

        // const [[exifData]] = await db.query<RowDataPacket[]>(
        //   "select exif from photos where id = ?",
        //   [4]
        // );
        // console.log(
        //   "exifData:",
        //   util.inspect(exifData, { showHidden: false, depth: null })
        // );
        /// Success response message
        res
          .status(200)
          .json({ message: "Upload success!", insertIds: insertIds });
      } catch (err) {
        console.log(`Error uploading image: ${err}`);

        /// Failed response message
        res.status(500).json({ message: `${err}` });
      }
    }
  }
);

export default router;
