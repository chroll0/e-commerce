import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder = "products") {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
    });
    return result;
  }

  async deleteImage(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }
}
