import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Locale } from "../../common/types/locale.types";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const baseName =
      dto.translations.find((t) => t.locale === "en")?.name ??
      dto.translations[0]?.name;

    if (!baseName) {
      throw new BadRequestException("translations are required");
    }

    const slug = dto.slug ?? this.slugify(baseName);

    return this.prisma.category.create({
      data: {
        slug,
        image: dto.image,
        parentId: dto.parentId ?? undefined,
        translations: {
          create: dto.translations.map((t) => {
            if (!t.name) {
              throw new BadRequestException("Translation name is required");
            }

            return {
              locale: t.locale,
              name: t.name,
              slug: this.slugify(t.name),
            };
          }),
        },
      },
    });
  }

  async findAll(locale?: Locale) {
    const categories = await this.prisma.category.findMany({
      include: {
        translations: {
          where: locale ? { locale } : undefined,
        },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return categories.map((cat) => {
      const t =
        cat.translations?.[0] ??
        cat.translations.find((tr) => tr.locale === locale) ??
        cat.translations[0];

      return this.mapCategory(cat, t);
    });
  }

  async findBySlug(slug: string, locale?: Locale) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { slug },
          {
            translations: {
              some: {
                slug,
                ...(locale ? { locale } : {}),
              },
            },
          },
        ],
      },
      include: {
        translations: {
          where: locale ? { locale } : undefined,
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    const t =
      category.translations?.[0] ??
      category.translations.find((tr) => tr.locale === locale) ??
      category.translations[0];

    return this.mapCategory(category, t);
  }

  async findOne(id: number, locale?: Locale) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        translations: {
          where: locale ? { locale } : undefined,
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const t =
      category.translations?.[0] ??
      category.translations.find((tr) => tr.locale === locale) ??
      category.translations[0];

    return this.mapCategory(category, t);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.ensureExists(id);

    let translationOps;

    if (dto.translations?.length) {
      const existing = await this.prisma.categoryTranslation.findMany({
        where: { categoryId: id },
        select: { locale: true },
      });

      const existingLocales = new Set(existing.map((x) => x.locale));

      translationOps = {
        upsert: dto.translations.map((tr) => {
          if (!tr.name) {
            throw new BadRequestException("Translation name is required");
          }

          return {
            where: {
              categoryId_locale: {
                categoryId: id,
                locale: tr.locale,
              },
            },
            update: {
              name: tr.name,
              slug: this.slugify(tr.name),
            },
            create: {
              locale: tr.locale,
              name: tr.name,
              slug: this.slugify(tr.name),
            },
          };
        }),
      };
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.slug ? { slug: dto.slug } : {}),
        ...(dto.image ? { image: dto.image } : {}),
        parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
        ...(translationOps && { translations: translationOps }),
      },
      include: {
        translations: true,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);

    const [childrenCount, productsCount] = await Promise.all([
      this.prisma.category.count({ where: { parentId: id } }),
      this.prisma.product.count({ where: { categoryId: id } }),
    ]);

    if (childrenCount > 0) {
      throw new BadRequestException({ code: "hasChildren" });
    }

    if (productsCount > 0) {
      throw new BadRequestException({ code: "hasProducts" });
    }

    await this.prisma.categoryTranslation.deleteMany({
      where: { categoryId: id },
    });

    return this.prisma.category.delete({ where: { id } });
  }

  private mapCategory(cat: any, t?: any) {
    return {
      id: cat.id,
      slug: t?.slug ?? cat.slug,
      image: cat.image,
      parentId: cat.parentId,
      productCount: cat._count?.products ?? 0,
      name: t?.name ?? "",
    };
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }

  private slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }
}
