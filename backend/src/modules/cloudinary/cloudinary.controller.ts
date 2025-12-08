import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "./cloudinary.service";
import { UploadImageDto } from "./dto/upload-image.dto";
import * as multer from "multer";

@Controller("cloudinary")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { storage: multer.memoryStorage() }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto
  ) {
    if (!file) throw new Error("File is required");
    const result = await this.cloudinaryService.uploadImage(file, dto.folder);
    return result;
  }

  @Delete("delete")
  async deleteImage(@Query("publicId") publicId: string) {
    if (!publicId) throw new Error("publicId is required");
    return this.cloudinaryService.deleteImage(publicId);
  }
}
