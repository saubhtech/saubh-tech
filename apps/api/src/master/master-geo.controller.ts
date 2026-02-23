import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { MasterService } from './master.service';

/**
 * Public Master Geo Controller — feeds cascade dropdowns on profile page.
 * No authentication required (public data).
 *
 * Routes:
 *   GET /api/master/geo/languages
 *   GET /api/master/geo/states
 *   GET /api/master/geo/districts?stateId=X
 *   GET /api/master/geo/pincodes?districtId=X
 *   GET /api/master/geo/places?pincode=X
 *
 * Reuses existing MasterService methods.
 * Does NOT modify master.controller.ts (admin-only endpoints).
 */
@Controller('master/geo')
export class MasterGeoController {
  constructor(private readonly svc: MasterService) {}

  // ─── Languages (active only) ────────────────────────────────────────────

  @Get('languages')
  async listLanguages() {
    const result = await this.svc.findAllLanguages(1, 500, true);
    return { success: true, data: result.data };
  }

  // ─── States (India only) ────────────────────────────────────────────────

  @Get('states')
  async listStates() {
    const data = await this.svc.findAllStates('IN');
    return { success: true, data };
  }

  // ─── Districts (by stateId) ─────────────────────────────────────────────

  @Get('districts')
  async listDistricts(@Query('stateId') stateId?: string) {
    if (!stateId) {
      return { success: true, data: [] };
    }
    const data = await this.svc.findAllDistricts(+stateId);
    return { success: true, data };
  }

  // ─── Pincodes (by districtId) ───────────────────────────────────────────

  @Get('pincodes')
  async listPincodes(@Query('districtId') districtId?: string) {
    if (!districtId) {
      return { success: true, data: [] };
    }
    const data = await this.svc.findAllPostals({
      districtid: +districtId,
    });
    return { success: true, data };
  }

  // ─── Places (by pincode string) ─────────────────────────────────────────

  @Get('places')
  async listPlaces(@Query('pincode') pincode?: string) {
    if (!pincode) {
      return { success: true, data: [] };
    }
    const data = await this.svc.findAllPlaces({ pincode });
    return { success: true, data };
  }
}
