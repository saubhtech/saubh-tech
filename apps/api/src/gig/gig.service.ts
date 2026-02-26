import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GigService {
  constructor(private prisma: PrismaService) {}

  // ─── Market Data (master schema) ─────────────────────────────────
  async getSectors() {
    return this.prisma.$queryRaw`
      SELECT sectorid, sector, code
      FROM master.sector
      WHERE is_active = true
      ORDER BY sort_order, sector
    `;
  }

  async getFieldsBySector(sectorid: number) {
    return this.prisma.$queryRaw`
      SELECT fieldid, field, sectorid, code
      FROM master.field
      WHERE sectorid = ${sectorid} AND is_active = true
      ORDER BY sort_order, field
    `;
  }

  async getMarketItems(sectorid: number, fieldid: number, p_s_ps?: string) {
    if (p_s_ps) {
      return this.prisma.$queryRaw`
        SELECT marketid, sectorid, fieldid, p_s_ps, item, delivery_mode, code
        FROM master.market
        WHERE sectorid = ${sectorid}
          AND fieldid = ${fieldid}
          AND p_s_ps = ${p_s_ps}
          AND is_active = true
        ORDER BY sort_order, item
      `;
    }
    return this.prisma.$queryRaw`
      SELECT marketid, sectorid, fieldid, p_s_ps, item, delivery_mode, code
      FROM master.market
      WHERE sectorid = ${sectorid}
        AND fieldid = ${fieldid}
        AND is_active = true
      ORDER BY sort_order, item
    `;
  }

  // Get distinct p_s_ps values for a sector+field combo
  async getProductServiceOptions(sectorid: number, fieldid: number) {
    return this.prisma.$queryRaw`
      SELECT DISTINCT p_s_ps
      FROM master.market
      WHERE sectorid = ${sectorid}
        AND fieldid = ${fieldid}
        AND is_active = true
      ORDER BY p_s_ps
    `;
  }

  // ─── Requirements CRUD ───────────────────────────────────────────
  async getRequirements(userid?: bigint) {
    if (userid) {
      return this.prisma.requirement.findMany({ where: { userid }, orderBy: { created_at: 'desc' } });
    }
    return this.prisma.requirement.findMany({ orderBy: { created_at: 'desc' } });
  }

  async getRequirementById(requirid: bigint) {
    return this.prisma.requirement.findUnique({ where: { requirid } });
  }

  async createRequirement(data: {
    userid: bigint;
    marketid: number;
    delivery_mode?: string;
    requirements?: string;
    eligibility?: string;
    doc_url?: string;
    audio_url?: string;
    video_url?: string;
    budget?: number;
    escrow?: number;
    bidate?: Date;
    delivdate?: Date;
  }) {
    return this.prisma.requirement.create({ data });
  }

  async updateRequirement(requirid: bigint, data: any) {
    return this.prisma.requirement.update({ where: { requirid }, data });
  }

  async deleteRequirement(requirid: bigint) {
    return this.prisma.requirement.delete({ where: { requirid } });
  }

  // ─── Offerings CRUD ──────────────────────────────────────────────
  async getOfferings(userid?: bigint) {
    if (userid) {
      return this.prisma.offering.findMany({ where: { userid }, orderBy: { created_at: 'desc' } });
    }
    return this.prisma.offering.findMany({ orderBy: { created_at: 'desc' } });
  }

  async createOffering(data: any) {
    return this.prisma.offering.create({ data });
  }

  async updateOffering(offerid: bigint, data: any) {
    return this.prisma.offering.update({ where: { offerid }, data });
  }

  async deleteOffering(offerid: bigint) {
    return this.prisma.offering.delete({ where: { offerid } });
  }

  // ─── Bids CRUD ───────────────────────────────────────────────────
  async getBids(requirid?: bigint) {
    if (requirid) {
      return this.prisma.bid.findMany({ where: { requirid }, orderBy: { created_at: 'desc' } });
    }
    return this.prisma.bid.findMany({ orderBy: { created_at: 'desc' } });
  }

  async createBid(data: any) {
    return this.prisma.bid.create({ data });
  }

  async updateBid(bidid: bigint, data: any) {
    return this.prisma.bid.update({ where: { bidid }, data });
  }

  async deleteBid(bidid: bigint) {
    return this.prisma.bid.delete({ where: { bidid } });
  }

  // ─── Agreements CRUD ─────────────────────────────────────────────
  async getAgreements(bidid?: bigint) {
    if (bidid) {
      return this.prisma.bidAgree.findMany({ where: { bidid }, orderBy: { created_at: 'desc' } });
    }
    return this.prisma.bidAgree.findMany({ orderBy: { created_at: 'desc' } });
  }

  async createAgreement(data: any) {
    return this.prisma.bidAgree.create({ data });
  }

  async updateAgreement(agreeid: bigint, data: any) {
    return this.prisma.bidAgree.update({ where: { agreeid }, data });
  }

  async deleteAgreement(agreeid: bigint) {
    return this.prisma.bidAgree.delete({ where: { agreeid } });
  }
}
