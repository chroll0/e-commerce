import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

type Locale = "en" | "ka";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const enName = dto.translations.find((t) => t.locale === "en")?.name;
    const baseName = enName ?? dto.translations[0]?.name;

    if (!baseName) throw new BadRequestException("translations are required");

    const slug = dto.slug ?? this.slugify(baseName);

    return this.prisma.category.create({
      data: {
        slug,
        image: dto.image,
        parentId: dto.parentId ?? null,
        translations: { create: dto.translations },
      },
      include: {
        translations: true,
      },
    });
  }

  async findAll(locale?: Locale) {
    return this.prisma.category.findMany({
      include: {
        translations: locale ? { where: { locale } } : true,
        // პროდუქტები თუ გინდა აქვე:
        // products: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number, locale?: Locale) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        translations: locale ? { where: { locale } } : true,
        // products: true,
      },
    });

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.ensureExists(id);

    let translationOps:
      | {
          upsert: {
            where: {
              categoryId_locale: { categoryId: number; locale: string };
            };
            update: Record<string, string>;
            create: { locale: string; name: string };
          }[];
        }
      | undefined;

    if (dto.translations?.length) {
      const existing = await this.prisma.categoryTranslation.findMany({
        where: { categoryId: id },
        select: { locale: true },
      });
      const existingLocales = new Set(existing.map((x) => x.locale));

      const upsert = dto.translations.map((tr) => {
        const exists = existingLocales.has(tr.locale);

        const update: Record<string, string> = {};
        if (tr.name !== undefined) update.name = tr.name;

        if (!exists) {
          if (!tr.name) {
            throw new BadRequestException(
              `Translation for locale "${tr.locale}" requires name`
            );
          }
        }

        return {
          where: { categoryId_locale: { categoryId: id, locale: tr.locale } },
          update,
          create: { locale: tr.locale, name: tr.name ?? "" },
        };
      });

      translationOps = { upsert };
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
        ...(dto.image !== undefined ? { image: dto.image } : {}),
        ...(dto.parentId !== undefined ? { parentId: dto.parentId } : {}),
        ...(translationOps ? { translations: translationOps } : {}),
      },
      include: {
        translations: true,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.category.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists)
      throw new NotFoundException(`Category with id ${id} not found`);
  }

  private slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }
}
