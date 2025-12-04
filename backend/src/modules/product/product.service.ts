import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const slug = createProductDto.slug ?? this.slugify(createProductDto.title);

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        slug,
      },
      include: { category: true },
    });
  }

  async findAll(search?: string) {
    return this.prisma.product.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      include: { category: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // check existence

    const slug =
      updateProductDto.slug ??
      (updateProductDto.title
        ? this.slugify(updateProductDto.title)
        : undefined);

    return this.prisma.product.update({
      where: { id },
      data: { ...updateProductDto, ...(slug ? { slug } : {}) },
      include: { category: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // check existence
    return this.prisma.product.delete({ where: { id } });
  }

  private slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }
}
