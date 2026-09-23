import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";

@Injectable()
export class LabelService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const labels = await this.prisma.productLabel.findMany({
      orderBy: {
        slug: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return labels.map((label) => ({
      id: label.id,
      slug: label.slug,
      nameEn: label.nameEn,
      nameKa: label.nameKa,
      productCount: label._count.products,
    }));
  }

  async findOne(id: number) {
    const label = await this.prisma.productLabel.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    });

    if (!label) {
      throw new NotFoundException(`Label with id ${id} not found`);
    }

    return {
      id: label.id,
      slug: label.slug,
      nameEn: label.nameEn,
      nameKa: label.nameKa,
      products: label.products.map((item) => ({
        id: item.product.id,
        slug: item.product.slug,
        price: item.product.price,
        oldPrice: item.product.oldPrice,
        discount: item.product.discount,
        stock: item.product.stock,
        primaryImage: item.product.primaryImage,
        images: item.product.images,
        translations: item.product.translations,
      })),
    };
  }

  async create(dto: CreateLabelDto) {
    const existing = await this.prisma.productLabel.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(
        `Label with slug "${dto.slug}" already exists`,
      );
    }

    return this.prisma.productLabel.create({ data: dto });
  }

  async update(id: number, dto: UpdateLabelDto) {
    const existing = await this.prisma.productLabel.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Label with id ${id} not found`);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const conflict = await this.prisma.productLabel.findUnique({
        where: { slug: dto.slug },
      });
      if (conflict) {
        throw new ConflictException(
          `Label with slug "${dto.slug}" already exists`,
        );
      }
    }

    return this.prisma.productLabel.update({
      where: { id },
      data: {
        ...(dto.slug ? { slug: dto.slug } : {}),
        ...(dto.nameEn !== undefined ? { nameEn: dto.nameEn } : {}),
        ...(dto.nameKa !== undefined ? { nameKa: dto.nameKa } : {}),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.productLabel.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Label with id ${id} not found`);
    }

    try {
      return await this.prisma.productLabel.delete({ where: { id } });
    } catch {
      throw new BadRequestException("Unable to delete label");
    }
  }
}
