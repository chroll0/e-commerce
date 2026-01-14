import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Locale } from "../../common/types/locale.types";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const enTitle = dto.translations.find((t) => t.locale === "en")?.title;
    const baseTitle = enTitle ?? dto.translations[0]?.title;

    if (!baseTitle) {
      throw new BadRequestException("translations are required");
    }

    const slug = dto.slug ?? this.slugify(baseTitle);

    return this.prisma.product.create({
      data: {
        slug,
        price: dto.price,
        oldPrice: dto.oldPrice,
        discount: dto.discount,
        isFeatured: dto.isFeatured ?? false,
        stock: dto.stock ?? 0,
        images: dto.images,
        categoryId: dto.categoryId,
        translations: {
          create: dto.translations,
        },
      },
      include: {
        translations: true,
        category: { include: { translations: true } },
      },
    });
  }

  async findAll(search?: string, categorySlug?: string, locale: Locale = "en") {
    return this.prisma.product.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  {
                    slug: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    translations: {
                      some: {
                        locale,
                        OR: [
                          {
                            title: { contains: search, mode: "insensitive" },
                          },
                          {
                            description: {
                              contains: search,
                              mode: "insensitive",
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    category: {
                      translations: {
                        some: {
                          locale,
                          name: { contains: search, mode: "insensitive" },
                        },
                      },
                    },
                  },
                ],
              }
            : {},
          categorySlug
            ? {
                category: {
                  slug: categorySlug,
                },
              }
            : {},
        ],
      },
      include: {
        category: { include: { translations: true } },
        translations: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number, locale: Locale = "en") {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            translations: { where: { locale } },
          },
        },
        translations: { where: { locale } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.ensureExists(id);

    // slug: explicit > generate from EN title (if provided) > keep
    const enTitle = dto.translations?.find((t) => t.locale === "en")?.title;
    const slug = dto.slug ?? (enTitle ? this.slugify(enTitle) : undefined);

    // translations: upsert with safety
    // rule: if translation row doesn't exist yet, create requires BOTH title + description
    let translationOps:
      | {
          upsert: {
            where: { productId_locale: { productId: number; locale: string } };
            update: Record<string, string>;
            create: { locale: string; title: string; description: string };
          }[];
        }
      | undefined;

    if (dto.translations?.length) {
      // find existing locales for this product
      const existing = await this.prisma.productTranslation.findMany({
        where: { productId: id },
        select: { locale: true },
      });
      const existingLocales = new Set(existing.map((x) => x.locale));

      const upsert = dto.translations.map((tr) => {
        const exists = existingLocales.has(tr.locale);

        // update payload can be partial
        const update: Record<string, string> = {};
        if (tr.title !== undefined) update.title = tr.title;
        if (tr.description !== undefined) update.description = tr.description;

        // create requires full
        if (!exists) {
          if (!tr.title || !tr.description) {
            throw new BadRequestException(
              `Translation for locale "${tr.locale}" requires both title and description`
            );
          }
        }

        return {
          where: {
            productId_locale: { productId: id, locale: tr.locale },
          },
          update,
          create: {
            locale: tr.locale,
            title: tr.title ?? "",
            description: tr.description ?? "",
          },
        };
      });

      translationOps = { upsert };
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(slug ? { slug } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.oldPrice !== undefined ? { oldPrice: dto.oldPrice } : {}),
        ...(dto.discount !== undefined ? { discount: dto.discount } : {}),
        ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
        ...(dto.stock !== undefined ? { stock: dto.stock } : {}),
        ...(dto.images !== undefined ? { images: dto.images } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
        ...(translationOps ? { translations: translationOps } : {}),
      },
      include: {
        category: { include: { translations: true } },
        translations: true,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.product.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Product with id ${id} not found`);
  }

  private slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }
}
