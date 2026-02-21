import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  IsEnum,
  Length,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── Country ────────────────────────────────────────────────────────────────

export class CreateCountryDto {
  @IsString()
  @Length(2, 2)
  countryCode: string;

  @IsString()
  @MaxLength(100)
  country: string;

  @IsString()
  @Length(3, 3)
  iso3: string;

  @IsString()
  @MaxLength(10)
  isd: string;

  @IsString()
  @MaxLength(8)
  flag: string;
}

export class UpdateCountryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  iso3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  isd?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  flag?: string;
}

// ─── State ──────────────────────────────────────────────────────────────────

export class CreateStateDto {
  @IsString()
  @MaxLength(100)
  state: string;

  @IsString()
  @Length(2, 2)
  stateCode: string;

  @IsString()
  @Length(2, 2)
  countryCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;
}

export class UpdateStateDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  stateCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;
}

// ─── District ───────────────────────────────────────────────────────────────

export class CreateDistrictDto {
  @IsString()
  @MaxLength(100)
  district: string;

  @IsInt()
  @Type(() => Number)
  stateid: number;

  @IsString()
  @Length(2, 2)
  countryCode: string;
}

export class UpdateDistrictDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stateid?: number;
}

// ─── Postal ─────────────────────────────────────────────────────────────────

export class CreatePostalDto {
  @IsString()
  @MaxLength(10)
  pincode: string;

  @IsString()
  @MaxLength(150)
  postoffice: string;

  @IsInt()
  @Type(() => Number)
  districtid: number;

  @IsInt()
  @Type(() => Number)
  stateid: number;

  @IsString()
  @Length(2, 2)
  countryCode: string;
}

export class UpdatePostalDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pincode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  postoffice?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  districtid?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stateid?: number;
}

// ─── Place ──────────────────────────────────────────────────────────────────

export class CreatePlaceDto {
  @IsString()
  @Length(2, 2)
  countryCode: string;

  @IsInt()
  @Type(() => Number)
  stateid: number;

  @IsInt()
  @Type(() => Number)
  districtid: number;

  @IsString()
  @MaxLength(10)
  pincode: string;

  @IsString()
  @MaxLength(200)
  place: string;

  @IsOptional()
  @Type(() => Number)
  userid?: number;
}

export class UpdatePlaceDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pincode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  place?: string;

  @IsOptional()
  @Type(() => Number)
  userid?: number;
}

// ─── Locality ───────────────────────────────────────────────────────────────

export class CreateLocalityDto {
  @IsString()
  @MaxLength(200)
  locality: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  placeid?: number[];

  @IsOptional()
  @Type(() => Number)
  localAgency?: number;
}

export class UpdateLocalityDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  locality?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  placeid?: number[];

  @IsOptional()
  @Type(() => Number)
  localAgency?: number;
}

// ─── Area ───────────────────────────────────────────────────────────────────

export class CreateAreaDto {
  @IsString()
  @MaxLength(200)
  area: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  localityid?: number[];

  @IsOptional()
  @Type(() => Number)
  areaAgency?: number;
}

export class UpdateAreaDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  area?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  localityid?: number[];

  @IsOptional()
  @Type(() => Number)
  areaAgency?: number;
}

// ─── Division ───────────────────────────────────────────────────────────────

export class CreateDivisionDto {
  @IsString()
  @MaxLength(200)
  division: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  areaid?: number[];

  @IsOptional()
  @Type(() => Number)
  divisionAgency?: number;
}

export class UpdateDivisionDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  division?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  areaid?: number[];

  @IsOptional()
  @Type(() => Number)
  divisionAgency?: number;
}

// ─── Region ─────────────────────────────────────────────────────────────────

export class CreateRegionDto {
  @IsString()
  @MaxLength(200)
  region: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  divisionid?: number[];

  @IsOptional()
  @Type(() => Number)
  regionAgency?: number;
}

export class UpdateRegionDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  region?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  divisionid?: number[];

  @IsOptional()
  @Type(() => Number)
  regionAgency?: number;
}

// ─── Zone ───────────────────────────────────────────────────────────────────

export class CreateZoneDto {
  @IsString()
  @Length(2, 2)
  zoneCode: string;

  @IsString()
  @MaxLength(200)
  zone: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  regionid?: number[];

  @IsOptional()
  @Type(() => Number)
  zoneAgency?: number;
}

export class UpdateZoneDto {
  @IsOptional()
  @IsString()
  @Length(2, 2)
  zoneCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  zone?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  regionid?: number[];

  @IsOptional()
  @Type(() => Number)
  zoneAgency?: number;
}

// ─── I18n DTO (shared shape) ────────────────────────────────────────────────

export class I18nEntryDto {
  @IsString()
  @MaxLength(10)
  locale: string;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFallback?: boolean;
}

// ─── Sector ─────────────────────────────────────────────────────────────────

export class CreateSectorDto {
  @IsString()
  @MaxLength(200)
  sector: string;

  @IsString()
  @MaxLength(50)
  code: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => I18nEntryDto)
  i18n?: I18nEntryDto[];
}

export class UpdateSectorDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  sector?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => I18nEntryDto)
  i18n?: I18nEntryDto[];
}

// ─── Field ──────────────────────────────────────────────────────────────────

export class CreateFieldDto {
  @IsString()
  @MaxLength(200)
  field: string;

  @IsInt()
  @Type(() => Number)
  sectorid: number;

  @IsString()
  @MaxLength(50)
  code: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => I18nEntryDto)
  i18n?: I18nEntryDto[];
}

export class UpdateFieldDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  field?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sectorid?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => I18nEntryDto)
  i18n?: I18nEntryDto[];
}

// ─── Market ─────────────────────────────────────────────────────────────────

export enum DeliveryModeEnum {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  PHYGITAL = 'PHYGITAL',
}

export class CreateMarketDto {
  @IsInt()
  @Type(() => Number)
  sectorid: number;

  @IsInt()
  @Type(() => Number)
  fieldid: number;

  @IsString()
  @Length(1, 2)
  @Matches(/^(P|S|PS)$/, { message: 'p_s_ps must be P, S, or PS' })
  p_s_ps: string;

  @IsString()
  @MaxLength(200)
  item: string;

  @IsString()
  @MaxLength(50)
  code: string;

  @IsOptional()
  @IsEnum(DeliveryModeEnum)
  deliveryMode?: DeliveryModeEnum;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => I18nEntryDto)
  i18n?: I18nEntryDto[];
}

export class UpdateMarketDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sectorid?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  fieldid?: number;

  @IsOptional()
  @IsString()
  @Length(1, 2)
  @Matches(/^(P|S|PS)$/, { message: 'p_s_ps must be P, S, or PS' })
  p_s_ps?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  item?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsEnum(DeliveryModeEnum)
  deliveryMode?: DeliveryModeEnum;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => I18nEntryDto)
  i18n?: I18nEntryDto[];
}

// ─── Language ───────────────────────────────────────────────────────────────

export class CreateLanguageDto {
  @IsString()
  @MaxLength(200)
  language: string;

  @IsString()
  @MaxLength(10)
  locale: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRtl?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export class UpdateLanguageDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRtl?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}
