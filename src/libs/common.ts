const crypto = require("crypto");
import { writeFile, createReadStream, unlink } from "fs";
import AWS from "aws-sdk";
import dotenv from "dotenv";
const ical = require("ical-generator").default;

dotenv.config();
const s3bucket = new AWS.S3({
  params: { Bucket: process.env.AWS_BUCKET },
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
export const generateSalt = (rounds = 16) => {
  return crypto
    .randomBytes(Math.ceil(rounds / 2))
    .toString("hex")
    .slice(0, rounds);
};

// export hash password function
export const hashPassword = (password, salt) => {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const hashedPassword = hash.digest("hex");
  return hashedPassword;
};

export const isPasswordValid = (
  storedHashedPassword,
  storedSalt,
  inputPassword
) => {
  const hashedPassword = hashPassword(inputPassword, storedSalt);
  return storedHashedPassword === hashedPassword;
};

export function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export async function uploadFile(uploadPath: string, fileName: string) {
  try {
    let s3Link = uploadPath;
    // s3 upload
    const readStream = createReadStream(`public/${fileName}`);
    const params = {
      Bucket: uploadPath,
      Key: fileName,
      Body: readStream,
    };
    const path = readStream.path;
    await new Promise((resolve, reject) => {
      s3bucket.upload(params, function (err, data) {
        readStream.destroy();
        if (err) {
          s3Link = null;
          reject(err);
        }
        //s3Link = "s3://" + data["Bucket"] + "/" + data["Key"];
        s3Link = data["Location"] || "";
        return resolve(data);
      });
    });

    return {
      path: path,
      s3Link: s3Link,
    };
  } catch (err) {
    throw err;
  }
}

export async function getIcalObjectInstance(
  starttime,
  endtime,
  summary,
  description,
  location,
  url,
  name,
  email
) {
  try {
    const calendar = ical({
      domain: "mytestwebsite.com",
      name: "My test calendar event",
    });

    calendar.createEvent({
      start: starttime, // e.g., moment()
      end: endtime, // e.g., moment().add(1, 'days')
      summary: summary, // 'Summary of your event'
      description: description, // 'More description'
      location: location, // 'Delhi'
      url: url, // 'event url'
      organizer: {
        name: name,
        email: email,
      },
    });

    return calendar;
  } catch (err) {
    throw err;
  }
}
