import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStoreDto) {
    const slug = dto.slug?.trim() || this.slugify(dto.name);

    return this.prisma.store.create({
      data: {
        name: dto.name,
        slug,
        logo: dto.logo,
        banner: dto.banner,
      },
    });
  }

  async findAll(params?: {
    search?: string;
    limit?: number;
    sort?: "sales" | "rating" | "newest";
  }) {
    const where = params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" as const } },
            { slug: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    let orderBy: any = { createdAt: "desc" };

    if (params?.sort === "sales") {
      orderBy = [{ sales: "desc" }, { rating: "desc" }];
    } else if (params?.sort === "rating") {
      orderBy = [{ rating: "desc" }, { sales: "desc" }];
    } else if (params?.sort === "newest") {
      orderBy = [{ createdAt: "desc" }];
    }

    return this.prisma.store.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy,
      take: params?.limit,
    });
  }

  async findBySlug(
    slug: string,
    params?: { search?: string; categoryId?: number; locale?: string },
  ) {
    const productSearch = params?.search?.trim();
    const productFilter: any = {};

    if (productSearch) {
      productFilter.OR = [
        { slug: { contains: productSearch, mode: "insensitive" as const } },
        {
          translations: {
            some: {
              locale: params?.locale || "en",
              OR: [
                {
                  title: {
                    contains: productSearch,
                    mode: "insensitive" as const,
                  },
                },
                {
                  description: {
                    contains: productSearch,
                    mode: "insensitive" as const,
                  },
                },
              ],
            },
          },
        },
      ];
    }

    if (params?.categoryId) {
      productFilter.categoryId = params.categoryId;
    }

    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        products: {
          where: Object.keys(productFilter).length ? productFilter : undefined,
          include: {
            translations: true,
            category: { include: { translations: true } },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!store) {
      throw new NotFoundException(`Store with slug ${slug} not found`);
    }

    return store;
  }

  async findBestStores(limit: number = 10) {
    return this.prisma.store.findMany({
      where: {
        sales: {
          gt: 0,
        },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ rating: "desc" }, { sales: "desc" }],
      take: limit,
    });
  }

  async update(id: number, dto: UpdateStoreDto) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    const updateData: any = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.slug !== undefined) {
      updateData.slug =
        dto.slug?.trim() || this.slugify(dto.name || store.name);
    }

    if (dto.logo !== undefined) {
      updateData.logo = dto.logo;
    }

    if (dto.banner !== undefined) {
      updateData.banner = dto.banner;
    }

    return this.prisma.store.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    return this.prisma.store.delete({
      where: { id },
    });
  }

  private slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }
}
