import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCountryDto, UpdateCountryDto,
  CreateStateDto, UpdateStateDto,
  CreateDistrictDto, UpdateDistrictDto,
  CreatePostalDto, UpdatePostalDto,
  CreatePlaceDto, UpdatePlaceDto,
  CreateLocalityDto, UpdateLocalityDto,
  CreateAreaDto, UpdateAreaDto,
  CreateDivisionDto, UpdateDivisionDto,
  CreateRegionDto, UpdateRegionDto,
  CreateZoneDto, UpdateZoneDto,
  CreateSectorDto, UpdateSectorDto,
  CreateFieldDto, UpdateFieldDto,
  CreateMarketDto, UpdateMarketDto,
  CreateLanguageDto, UpdateLanguageDto,
} from './dto';

@Injectable()
export class MasterService {
  constructor(private prisma: PrismaService) {}

  // ─── Country ────────────────────────────────────────────────────────────

  findAllCountries() {
    return this.prisma.country.findMany({ orderBy: { country: 'asc' } });
  }

  async findCountry(code: string) {
    const row = await this.prisma.country.findUnique({
      where: { countryCode: code.toUpperCase() },
      include: { states: true },
    });
    if (!row) throw new NotFoundException(`Country ${code} not found`);
    return row;
  }

  createCountry(dto: CreateCountryDto) {
    return this.prisma.country.create({
      data: { ...dto, countryCode: dto.countryCode.toUpperCase(), iso3: dto.iso3.toUpperCase() },
    });
  }

  async updateCountry(code: string, dto: UpdateCountryDto) {
    await this.findCountry(code);
    return this.prisma.country.update({
      where: { countryCode: code.toUpperCase() },
      data: dto,
    });
  }

  async deleteCountry(code: string) {
    await this.findCountry(code);
    return this.prisma.country.delete({ where: { countryCode: code.toUpperCase() } });
  }

  // ─── State ──────────────────────────────────────────────────────────────

  findAllStates(countryCode?: string) {
    return this.prisma.masterState.findMany({
      where: countryCode ? { countryCode: countryCode.toUpperCase() } : undefined,
      orderBy: { state: 'asc' },
    });
  }

  async findState(id: number) {
    const row = await this.prisma.masterState.findUnique({
      where: { stateid: id },
      include: { country: true, districts: true },
    });
    if (!row) throw new NotFoundException(`State ${id} not found`);
    return row;
  }

  createState(dto: CreateStateDto) {
    return this.prisma.masterState.create({
      data: { ...dto, countryCode: dto.countryCode.toUpperCase(), stateCode: dto.stateCode.toUpperCase() },
    });
  }

  async updateState(id: number, dto: UpdateStateDto) {
    await this.findState(id);
    return this.prisma.masterState.update({ where: { stateid: id }, data: dto });
  }

  async deleteState(id: number) {
    await this.findState(id);
    return this.prisma.masterState.delete({ where: { stateid: id } });
  }

  // ─── District ───────────────────────────────────────────────────────────

  findAllDistricts(stateid?: number, countryCode?: string) {
    return this.prisma.district.findMany({
      where: {
        ...(stateid && { stateid }),
        ...(countryCode && { countryCode: countryCode.toUpperCase() }),
      },
      orderBy: { district: 'asc' },
    });
  }

  async findDistrict(id: number) {
    const row = await this.prisma.district.findUnique({
      where: { districtid: id },
      include: { state: true, country: true },
    });
    if (!row) throw new NotFoundException(`District ${id} not found`);
    return row;
  }

  createDistrict(dto: CreateDistrictDto) {
    return this.prisma.district.create({
      data: { ...dto, countryCode: dto.countryCode.toUpperCase() },
    });
  }

  async updateDistrict(id: number, dto: UpdateDistrictDto) {
    await this.findDistrict(id);
    return this.prisma.district.update({ where: { districtid: id }, data: dto });
  }

  async deleteDistrict(id: number) {
    await this.findDistrict(id);
    return this.prisma.district.delete({ where: { districtid: id } });
  }

  // ─── Postal ─────────────────────────────────────────────────────────────

  findAllPostals(filters: { pincode?: string; districtid?: number; stateid?: number; countryCode?: string }) {
    return this.prisma.postal.findMany({
      where: {
        ...(filters.pincode && { pincode: filters.pincode }),
        ...(filters.districtid && { districtid: filters.districtid }),
        ...(filters.stateid && { stateid: filters.stateid }),
        ...(filters.countryCode && { countryCode: filters.countryCode.toUpperCase() }),
      },
      orderBy: { postoffice: 'asc' },
    });
  }

  async findPostal(id: number) {
    const row = await this.prisma.postal.findUnique({
      where: { postid: id },
      include: { district: true, state: true, country: true },
    });
    if (!row) throw new NotFoundException(`Postal ${id} not found`);
    return row;
  }

  createPostal(dto: CreatePostalDto) {
    return this.prisma.postal.create({
      data: { ...dto, countryCode: dto.countryCode.toUpperCase() },
    });
  }

  async updatePostal(id: number, dto: UpdatePostalDto) {
    await this.findPostal(id);
    return this.prisma.postal.update({ where: { postid: id }, data: dto });
  }

  async deletePostal(id: number) {
    await this.findPostal(id);
    return this.prisma.postal.delete({ where: { postid: id } });
  }

  // ─── Place ──────────────────────────────────────────────────────────────

  findAllPlaces(filters: { pincode?: string; districtid?: number; stateid?: number; countryCode?: string }) {
    return this.prisma.place.findMany({
      where: {
        ...(filters.pincode && { pincode: filters.pincode }),
        ...(filters.districtid && { districtid: filters.districtid }),
        ...(filters.stateid && { stateid: filters.stateid }),
        ...(filters.countryCode && { countryCode: filters.countryCode.toUpperCase() }),
      },
      orderBy: { place: 'asc' },
    });
  }

  async findPlace(id: bigint) {
    const row = await this.prisma.place.findUnique({
      where: { placeid: id },
      include: { country: true, state: true, district: true },
    });
    if (!row) throw new NotFoundException(`Place ${id} not found`);
    return row;
  }

  createPlace(dto: CreatePlaceDto) {
    return this.prisma.place.create({
      data: {
        ...dto,
        countryCode: dto.countryCode.toUpperCase(),
        userid: dto.userid ? BigInt(dto.userid) : null,
      },
    });
  }

  async updatePlace(id: bigint, dto: UpdatePlaceDto) {
    await this.findPlace(id);
    return this.prisma.place.update({
      where: { placeid: id },
      data: {
        ...dto,
        userid: dto.userid !== undefined ? (dto.userid ? BigInt(dto.userid) : null) : undefined,
      },
    });
  }

  async deletePlace(id: bigint) {
    await this.findPlace(id);
    return this.prisma.place.delete({ where: { placeid: id } });
  }

  // ─── Locality ───────────────────────────────────────────────────────────

  findAllLocalities() {
    return this.prisma.locality.findMany({ orderBy: { locality: 'asc' } });
  }

  async findLocality(id: number) {
    const row = await this.prisma.locality.findUnique({ where: { localityid: id } });
    if (!row) throw new NotFoundException(`Locality ${id} not found`);
    return row;
  }

  createLocality(dto: CreateLocalityDto) {
    return this.prisma.locality.create({
      data: {
        locality: dto.locality,
        placeid: dto.placeid ?? [],
        localAgency: dto.localAgency ? BigInt(dto.localAgency) : null,
      },
    });
  }

  async updateLocality(id: number, dto: UpdateLocalityDto) {
    await this.findLocality(id);
    return this.prisma.locality.update({
      where: { localityid: id },
      data: {
        ...(dto.locality !== undefined && { locality: dto.locality }),
        ...(dto.placeid !== undefined && { placeid: dto.placeid }),
        ...(dto.localAgency !== undefined && { localAgency: dto.localAgency ? BigInt(dto.localAgency) : null }),
      },
    });
  }

  async deleteLocality(id: number) {
    await this.findLocality(id);
    return this.prisma.locality.delete({ where: { localityid: id } });
  }

  // ─── Area ───────────────────────────────────────────────────────────────

  findAllAreas() {
    return this.prisma.area.findMany({ orderBy: { area: 'asc' } });
  }

  async findArea(id: number) {
    const row = await this.prisma.area.findUnique({ where: { areaid: id } });
    if (!row) throw new NotFoundException(`Area ${id} not found`);
    return row;
  }

  createArea(dto: CreateAreaDto) {
    return this.prisma.area.create({
      data: {
        area: dto.area,
        localityid: dto.localityid ?? [],
        areaAgency: dto.areaAgency ? BigInt(dto.areaAgency) : null,
      },
    });
  }

  async updateArea(id: number, dto: UpdateAreaDto) {
    await this.findArea(id);
    return this.prisma.area.update({
      where: { areaid: id },
      data: {
        ...(dto.area !== undefined && { area: dto.area }),
        ...(dto.localityid !== undefined && { localityid: dto.localityid }),
        ...(dto.areaAgency !== undefined && { areaAgency: dto.areaAgency ? BigInt(dto.areaAgency) : null }),
      },
    });
  }

  async deleteArea(id: number) {
    await this.findArea(id);
    return this.prisma.area.delete({ where: { areaid: id } });
  }

  // ─── Division ───────────────────────────────────────────────────────────

  findAllDivisions() {
    return this.prisma.division.findMany({ orderBy: { division: 'asc' } });
  }

  async findDivision(id: number) {
    const row = await this.prisma.division.findUnique({ where: { divisionid: id } });
    if (!row) throw new NotFoundException(`Division ${id} not found`);
    return row;
  }

  createDivision(dto: CreateDivisionDto) {
    return this.prisma.division.create({
      data: {
        division: dto.division,
        areaid: dto.areaid ?? [],
        divisionAgency: dto.divisionAgency ? BigInt(dto.divisionAgency) : null,
      },
    });
  }

  async updateDivision(id: number, dto: UpdateDivisionDto) {
    await this.findDivision(id);
    return this.prisma.division.update({
      where: { divisionid: id },
      data: {
        ...(dto.division !== undefined && { division: dto.division }),
        ...(dto.areaid !== undefined && { areaid: dto.areaid }),
        ...(dto.divisionAgency !== undefined && { divisionAgency: dto.divisionAgency ? BigInt(dto.divisionAgency) : null }),
      },
    });
  }

  async deleteDivision(id: number) {
    await this.findDivision(id);
    return this.prisma.division.delete({ where: { divisionid: id } });
  }

  // ─── Region ─────────────────────────────────────────────────────────────

  findAllRegions() {
    return this.prisma.masterRegion.findMany({ orderBy: { region: 'asc' } });
  }

  async findRegion(id: number) {
    const row = await this.prisma.masterRegion.findUnique({ where: { regionid: id } });
    if (!row) throw new NotFoundException(`Region ${id} not found`);
    return row;
  }

  createRegion(dto: CreateRegionDto) {
    return this.prisma.masterRegion.create({
      data: {
        region: dto.region,
        divisionid: dto.divisionid ?? [],
        regionAgency: dto.regionAgency ? BigInt(dto.regionAgency) : null,
      },
    });
  }

  async updateRegion(id: number, dto: UpdateRegionDto) {
    await this.findRegion(id);
    return this.prisma.masterRegion.update({
      where: { regionid: id },
      data: {
        ...(dto.region !== undefined && { region: dto.region }),
        ...(dto.divisionid !== undefined && { divisionid: dto.divisionid }),
        ...(dto.regionAgency !== undefined && { regionAgency: dto.regionAgency ? BigInt(dto.regionAgency) : null }),
      },
    });
  }

  async deleteRegion(id: number) {
    await this.findRegion(id);
    return this.prisma.masterRegion.delete({ where: { regionid: id } });
  }

  // ─── Zone ───────────────────────────────────────────────────────────────

  findAllZones() {
    return this.prisma.zone.findMany({ orderBy: { zone: 'asc' } });
  }

  async findZone(id: number) {
    const row = await this.prisma.zone.findUnique({ where: { zoneid: id } });
    if (!row) throw new NotFoundException(`Zone ${id} not found`);
    return row;
  }

  createZone(dto: CreateZoneDto) {
    return this.prisma.zone.create({
      data: {
        zone: dto.zone,
        zoneCode: dto.zoneCode.toUpperCase(),
        regionid: dto.regionid ?? [],
        zoneAgency: dto.zoneAgency ? BigInt(dto.zoneAgency) : null,
      },
    });
  }

  async updateZone(id: number, dto: UpdateZoneDto) {
    await this.findZone(id);
    return this.prisma.zone.update({
      where: { zoneid: id },
      data: {
        ...(dto.zone !== undefined && { zone: dto.zone }),
        ...(dto.zoneCode !== undefined && { zoneCode: dto.zoneCode.toUpperCase() }),
        ...(dto.regionid !== undefined && { regionid: dto.regionid }),
        ...(dto.zoneAgency !== undefined && { zoneAgency: dto.zoneAgency ? BigInt(dto.zoneAgency) : null }),
      },
    });
  }

  async deleteZone(id: number) {
    await this.findZone(id);
    return this.prisma.zone.delete({ where: { zoneid: id } });
  }

  // ─── Sector ─────────────────────────────────────────────────────────────

  findAllSectors(activeOnly = false, locale?: string) {
    return this.prisma.sector.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { sortOrder: 'asc' },
      include: {
        fields: { where: activeOnly ? { isActive: true } : undefined, orderBy: { sortOrder: 'asc' } },
        i18n: locale ? { where: { locale } } : true,
      },
    });
  }

  async findSector(id: number, locale?: string) {
    const row = await this.prisma.sector.findUnique({
      where: { sectorid: id },
      include: {
        fields: { orderBy: { sortOrder: 'asc' }, include: { i18n: locale ? { where: { locale } } : true } },
        i18n: locale ? { where: { locale } } : true,
      },
    });
    if (!row) throw new NotFoundException(`Sector ${id} not found`);
    return row;
  }

  async createSector(dto: CreateSectorDto) {
    const { i18n, ...data } = dto;
    return this.prisma.sector.create({
      data: {
        sector: data.sector,
        code: data.code.toUpperCase(),
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
        ...(i18n?.length && {
          i18n: {
            createMany: { data: i18n.map((e) => ({ locale: e.locale, name: e.name, description: e.description, isFallback: e.isFallback ?? false })) },
          },
        }),
      },
      include: { i18n: true },
    });
  }

  async updateSector(id: number, dto: UpdateSectorDto) {
    await this.findSector(id);
    const { i18n, ...data } = dto;

    // Upsert i18n entries if provided
    if (i18n?.length) {
      for (const entry of i18n) {
        await this.prisma.sectorI18n.upsert({
          where: { sectorid_locale: { sectorid: id, locale: entry.locale } },
          update: { name: entry.name, description: entry.description, isFallback: entry.isFallback ?? false },
          create: { sectorid: id, locale: entry.locale, name: entry.name, description: entry.description, isFallback: entry.isFallback ?? false },
        });
      }
    }

    return this.prisma.sector.update({
      where: { sectorid: id },
      data: {
        ...(data.sector !== undefined && { sector: data.sector }),
        ...(data.code !== undefined && { code: data.code.toUpperCase() }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: { i18n: true },
    });
  }

  // Soft delete
  async deleteSector(id: number) {
    await this.findSector(id);
    return this.prisma.sector.update({ where: { sectorid: id }, data: { isActive: false } });
  }

  // ─── Field ──────────────────────────────────────────────────────────────

  findAllFields(sectorid?: number, activeOnly = false, locale?: string) {
    return this.prisma.field.findMany({
      where: {
        ...(sectorid && { sectorid }),
        ...(activeOnly && { isActive: true }),
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        sector: true,
        i18n: locale ? { where: { locale } } : true,
      },
    });
  }

  async findField(id: number, locale?: string) {
    const row = await this.prisma.field.findUnique({
      where: { fieldid: id },
      include: {
        sector: true,
        i18n: locale ? { where: { locale } } : true,
      },
    });
    if (!row) throw new NotFoundException(`Field ${id} not found`);
    return row;
  }

  async createField(dto: CreateFieldDto) {
    const { i18n, ...data } = dto;
    return this.prisma.field.create({
      data: {
        field: data.field,
        sectorid: data.sectorid,
        code: data.code.toUpperCase(),
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
        ...(i18n?.length && {
          i18n: {
            createMany: { data: i18n.map((e) => ({ locale: e.locale, name: e.name, description: e.description, isFallback: e.isFallback ?? false })) },
          },
        }),
      },
      include: { i18n: true },
    });
  }

  async updateField(id: number, dto: UpdateFieldDto) {
    await this.findField(id);
    const { i18n, ...data } = dto;

    if (i18n?.length) {
      for (const entry of i18n) {
        await this.prisma.fieldI18n.upsert({
          where: { fieldid_locale: { fieldid: id, locale: entry.locale } },
          update: { name: entry.name, description: entry.description, isFallback: entry.isFallback ?? false },
          create: { fieldid: id, locale: entry.locale, name: entry.name, description: entry.description, isFallback: entry.isFallback ?? false },
        });
      }
    }

    return this.prisma.field.update({
      where: { fieldid: id },
      data: {
        ...(data.field !== undefined && { field: data.field }),
        ...(data.sectorid !== undefined && { sectorid: data.sectorid }),
        ...(data.code !== undefined && { code: data.code.toUpperCase() }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: { i18n: true },
    });
  }

  // Soft delete
  async deleteField(id: number) {
    await this.findField(id);
    return this.prisma.field.update({ where: { fieldid: id }, data: { isActive: false } });
  }

  // ─── Market ─────────────────────────────────────────────────────────────

  findAllMarkets(filters: { sectorid?: number; fieldid?: number; p_s_ps?: string; activeOnly?: boolean; locale?: string }) {
    return this.prisma.market.findMany({
      where: {
        ...(filters.sectorid && { sectorid: filters.sectorid }),
        ...(filters.fieldid && { fieldid: filters.fieldid }),
        ...(filters.p_s_ps && { p_s_ps: filters.p_s_ps.toUpperCase() }),
        ...(filters.activeOnly && { isActive: true }),
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        sector: true,
        field: true,
        i18n: filters.locale ? { where: { locale: filters.locale } } : true,
      },
    });
  }

  async findMarket(id: bigint, locale?: string) {
    const row = await this.prisma.market.findUnique({
      where: { marketid: id },
      include: {
        sector: true,
        field: true,
        i18n: locale ? { where: { locale } } : true,
      },
    });
    if (!row) throw new NotFoundException(`Market ${id} not found`);
    return row;
  }

  async createMarket(dto: CreateMarketDto) {
    const { i18n, ...data } = dto;
    return this.prisma.market.create({
      data: {
        sectorid: data.sectorid,
        fieldid: data.fieldid,
        p_s_ps: data.p_s_ps.toUpperCase(),
        item: data.item,
        code: data.code.toUpperCase(),
        deliveryMode: data.deliveryMode ?? 'PHYSICAL',
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
        ...(i18n?.length && {
          i18n: {
            createMany: { data: i18n.map((e) => ({ locale: e.locale, name: e.name, description: e.description, isFallback: e.isFallback ?? false })) },
          },
        }),
      },
      include: { i18n: true },
    });
  }

  async updateMarket(id: bigint, dto: UpdateMarketDto) {
    await this.findMarket(id);
    const { i18n, ...data } = dto;

    if (i18n?.length) {
      for (const entry of i18n) {
        await this.prisma.marketI18n.upsert({
          where: { marketid_locale: { marketid: id, locale: entry.locale } },
          update: { name: entry.name, description: entry.description, isFallback: entry.isFallback ?? false },
          create: { marketid: id, locale: entry.locale, name: entry.name, description: entry.description, isFallback: entry.isFallback ?? false },
        });
      }
    }

    return this.prisma.market.update({
      where: { marketid: id },
      data: {
        ...(data.sectorid !== undefined && { sectorid: data.sectorid }),
        ...(data.fieldid !== undefined && { fieldid: data.fieldid }),
        ...(data.p_s_ps !== undefined && { p_s_ps: data.p_s_ps.toUpperCase() }),
        ...(data.item !== undefined && { item: data.item }),
        ...(data.code !== undefined && { code: data.code.toUpperCase() }),
        ...(data.deliveryMode !== undefined && { deliveryMode: data.deliveryMode }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: { i18n: true },
    });
  }

  // Soft delete
  async deleteMarket(id: bigint) {
    await this.findMarket(id);
    return this.prisma.market.update({ where: { marketid: id }, data: { isActive: false } });
  }

  // ─── Language ───────────────────────────────────────────────────────────

  async findAllLanguages(page = 1, limit = 50, activeOnly = false) {
    const where = activeOnly ? { isActive: true } : {};
    const [data, total] = await Promise.all([
      this.prisma.language.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.language.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findLanguage(id: number) {
    const row = await this.prisma.language.findUnique({ where: { langid: id } });
    if (!row) throw new NotFoundException(`Language ${id} not found`);
    return row;
  }

  createLanguage(dto: CreateLanguageDto) {
    return this.prisma.language.create({
      data: {
        language: dto.language,
        locale: dto.locale,
        isRtl: dto.isRtl ?? false,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateLanguage(id: number, dto: UpdateLanguageDto) {
    await this.findLanguage(id);
    return this.prisma.language.update({ where: { langid: id }, data: dto });
  }

  // Soft delete — sets isActive=false
  async deleteLanguage(id: number) {
    await this.findLanguage(id);
    return this.prisma.language.update({
      where: { langid: id },
      data: { isActive: false },
    });
  }
}
