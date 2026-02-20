import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MasterService } from './master.service';
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
} from './dto';
import { KeycloakAuthGuard, RolesGuard, Roles, MASTER_DATA_MANAGER } from '../auth';

@Controller('master')
@UseGuards(KeycloakAuthGuard, RolesGuard)
@Roles(MASTER_DATA_MANAGER)
export class MasterController {
  constructor(private readonly svc: MasterService) {}

  // ─── Country ────────────────────────────────────────────────────────────

  @Get('countries')
  listCountries() {
    return this.svc.findAllCountries();
  }

  @Get('countries/:code')
  getCountry(@Param('code') code: string) {
    return this.svc.findCountry(code);
  }

  @Post('countries')
  createCountry(@Body() dto: CreateCountryDto) {
    return this.svc.createCountry(dto);
  }

  @Patch('countries/:code')
  updateCountry(@Param('code') code: string, @Body() dto: UpdateCountryDto) {
    return this.svc.updateCountry(code, dto);
  }

  @Delete('countries/:code')
  deleteCountry(@Param('code') code: string) {
    return this.svc.deleteCountry(code);
  }

  // ─── State ──────────────────────────────────────────────────────────────

  @Get('states')
  listStates(@Query('country_code') countryCode?: string) {
    return this.svc.findAllStates(countryCode);
  }

  @Get('states/:id')
  getState(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findState(id);
  }

  @Post('states')
  createState(@Body() dto: CreateStateDto) {
    return this.svc.createState(dto);
  }

  @Patch('states/:id')
  updateState(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStateDto) {
    return this.svc.updateState(id, dto);
  }

  @Delete('states/:id')
  deleteState(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteState(id);
  }

  // ─── District ───────────────────────────────────────────────────────────

  @Get('districts')
  listDistricts(
    @Query('stateid') stateid?: string,
    @Query('country_code') countryCode?: string,
  ) {
    return this.svc.findAllDistricts(stateid ? +stateid : undefined, countryCode);
  }

  @Get('districts/:id')
  getDistrict(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findDistrict(id);
  }

  @Post('districts')
  createDistrict(@Body() dto: CreateDistrictDto) {
    return this.svc.createDistrict(dto);
  }

  @Patch('districts/:id')
  updateDistrict(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDistrictDto) {
    return this.svc.updateDistrict(id, dto);
  }

  @Delete('districts/:id')
  deleteDistrict(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteDistrict(id);
  }

  // ─── Postal ─────────────────────────────────────────────────────────────

  @Get('postals')
  listPostals(
    @Query('pincode') pincode?: string,
    @Query('districtid') districtid?: string,
    @Query('stateid') stateid?: string,
    @Query('country_code') countryCode?: string,
  ) {
    return this.svc.findAllPostals({
      pincode,
      districtid: districtid ? +districtid : undefined,
      stateid: stateid ? +stateid : undefined,
      countryCode,
    });
  }

  @Get('postals/:id')
  getPostal(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findPostal(id);
  }

  @Post('postals')
  createPostal(@Body() dto: CreatePostalDto) {
    return this.svc.createPostal(dto);
  }

  @Patch('postals/:id')
  updatePostal(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostalDto) {
    return this.svc.updatePostal(id, dto);
  }

  @Delete('postals/:id')
  deletePostal(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deletePostal(id);
  }

  // ─── Place ──────────────────────────────────────────────────────────────

  @Get('places')
  listPlaces(
    @Query('pincode') pincode?: string,
    @Query('districtid') districtid?: string,
    @Query('stateid') stateid?: string,
    @Query('country_code') countryCode?: string,
  ) {
    return this.svc.findAllPlaces({
      pincode,
      districtid: districtid ? +districtid : undefined,
      stateid: stateid ? +stateid : undefined,
      countryCode,
    });
  }

  @Get('places/:id')
  getPlace(@Param('id') id: string) {
    return this.svc.findPlace(BigInt(id));
  }

  @Post('places')
  createPlace(@Body() dto: CreatePlaceDto) {
    return this.svc.createPlace(dto);
  }

  @Patch('places/:id')
  updatePlace(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.svc.updatePlace(BigInt(id), dto);
  }

  @Delete('places/:id')
  deletePlace(@Param('id') id: string) {
    return this.svc.deletePlace(BigInt(id));
  }

  // ─── Locality ───────────────────────────────────────────────────────────

  @Get('localities')
  listLocalities() {
    return this.svc.findAllLocalities();
  }

  @Get('localities/:id')
  getLocality(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findLocality(id);
  }

  @Post('localities')
  createLocality(@Body() dto: CreateLocalityDto) {
    return this.svc.createLocality(dto);
  }

  @Patch('localities/:id')
  updateLocality(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLocalityDto) {
    return this.svc.updateLocality(id, dto);
  }

  @Delete('localities/:id')
  deleteLocality(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteLocality(id);
  }

  // ─── Area ───────────────────────────────────────────────────────────────

  @Get('areas')
  listAreas() {
    return this.svc.findAllAreas();
  }

  @Get('areas/:id')
  getArea(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findArea(id);
  }

  @Post('areas')
  createArea(@Body() dto: CreateAreaDto) {
    return this.svc.createArea(dto);
  }

  @Patch('areas/:id')
  updateArea(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAreaDto) {
    return this.svc.updateArea(id, dto);
  }

  @Delete('areas/:id')
  deleteArea(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteArea(id);
  }

  // ─── Division ───────────────────────────────────────────────────────────

  @Get('divisions')
  listDivisions() {
    return this.svc.findAllDivisions();
  }

  @Get('divisions/:id')
  getDivision(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findDivision(id);
  }

  @Post('divisions')
  createDivision(@Body() dto: CreateDivisionDto) {
    return this.svc.createDivision(dto);
  }

  @Patch('divisions/:id')
  updateDivision(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDivisionDto) {
    return this.svc.updateDivision(id, dto);
  }

  @Delete('divisions/:id')
  deleteDivision(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteDivision(id);
  }

  // ─── Region ─────────────────────────────────────────────────────────────

  @Get('regions')
  listRegions() {
    return this.svc.findAllRegions();
  }

  @Get('regions/:id')
  getRegion(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findRegion(id);
  }

  @Post('regions')
  createRegion(@Body() dto: CreateRegionDto) {
    return this.svc.createRegion(dto);
  }

  @Patch('regions/:id')
  updateRegion(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRegionDto) {
    return this.svc.updateRegion(id, dto);
  }

  @Delete('regions/:id')
  deleteRegion(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteRegion(id);
  }

  // ─── Zone ───────────────────────────────────────────────────────────────

  @Get('zones')
  listZones() {
    return this.svc.findAllZones();
  }

  @Get('zones/:id')
  getZone(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findZone(id);
  }

  @Post('zones')
  createZone(@Body() dto: CreateZoneDto) {
    return this.svc.createZone(dto);
  }

  @Patch('zones/:id')
  updateZone(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateZoneDto) {
    return this.svc.updateZone(id, dto);
  }

  @Delete('zones/:id')
  deleteZone(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteZone(id);
  }

  // ─── Sector ─────────────────────────────────────────────────────────────

  @Get('sectors')
  listSectors() {
    return this.svc.findAllSectors();
  }

  @Get('sectors/:id')
  getSector(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findSector(id);
  }

  @Post('sectors')
  createSector(@Body() dto: CreateSectorDto) {
    return this.svc.createSector(dto);
  }

  @Patch('sectors/:id')
  updateSector(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSectorDto) {
    return this.svc.updateSector(id, dto);
  }

  @Delete('sectors/:id')
  deleteSector(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteSector(id);
  }

  // ─── Field ──────────────────────────────────────────────────────────────

  @Get('fields')
  listFields(@Query('sectorid') sectorid?: string) {
    return this.svc.findAllFields(sectorid ? +sectorid : undefined);
  }

  @Get('fields/:id')
  getField(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findField(id);
  }

  @Post('fields')
  createField(@Body() dto: CreateFieldDto) {
    return this.svc.createField(dto);
  }

  @Patch('fields/:id')
  updateField(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFieldDto) {
    return this.svc.updateField(id, dto);
  }

  @Delete('fields/:id')
  deleteField(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteField(id);
  }

  // ─── Market ─────────────────────────────────────────────────────────────

  @Get('markets')
  listMarkets(
    @Query('sectorid') sectorid?: string,
    @Query('fieldid') fieldid?: string,
    @Query('p_s_ps') p_s_ps?: string,
  ) {
    return this.svc.findAllMarkets({
      sectorid: sectorid ? +sectorid : undefined,
      fieldid: fieldid ? +fieldid : undefined,
      p_s_ps,
    });
  }

  @Get('markets/:id')
  getMarket(@Param('id') id: string) {
    return this.svc.findMarket(BigInt(id));
  }

  @Post('markets')
  createMarket(@Body() dto: CreateMarketDto) {
    return this.svc.createMarket(dto);
  }

  @Patch('markets/:id')
  updateMarket(@Param('id') id: string, @Body() dto: UpdateMarketDto) {
    return this.svc.updateMarket(BigInt(id), dto);
  }

  @Delete('markets/:id')
  deleteMarket(@Param('id') id: string) {
    return this.svc.deleteMarket(BigInt(id));
  }
}
