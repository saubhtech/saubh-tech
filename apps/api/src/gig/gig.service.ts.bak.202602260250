import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GigService {
  constructor(private prisma: PrismaService) {}

  // Requirements
  async getRequirements(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.requirement.findMany({ skip, take: limit, orderBy: { created_at: 'desc' }, include: { bids: true } }),
      this.prisma.requirement.count(),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getRequirement(id: bigint) {
    return this.prisma.requirement.findUniqueOrThrow({ where: { requirid: id }, include: { bids: { include: { bid_agree: true } } } });
  }

  async createRequirement(dto: any) {
    return this.prisma.requirement.create({ data: dto });
  }

  async updateRequirement(id: bigint, dto: any) {
    return this.prisma.requirement.update({ where: { requirid: id }, data: dto });
  }

  async deleteRequirement(id: bigint) {
    return this.prisma.requirement.delete({ where: { requirid: id } });
  }

  // Offerings
  async getOfferings(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.offering.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
      this.prisma.offering.count(),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getOffering(id: bigint) {
    return this.prisma.offering.findUniqueOrThrow({ where: { offerid: id } });
  }

  async createOffering(dto: any) {
    return this.prisma.offering.create({ data: dto });
  }

  async updateOffering(id: bigint, dto: any) {
    return this.prisma.offering.update({ where: { offerid: id }, data: dto });
  }

  async deleteOffering(id: bigint) {
    return this.prisma.offering.delete({ where: { offerid: id } });
  }

  // Bids
  async getBids(requirid?: bigint, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = requirid ? { requirid } : {};
    const [data, total] = await Promise.all([
      this.prisma.bid.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' }, include: { requirement: true, bid_agree: true } }),
      this.prisma.bid.count({ where }),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async createBid(dto: any) {
    return this.prisma.bid.create({ data: dto, include: { requirement: true } });
  }

  async updateBid(id: bigint, dto: any) {
    return this.prisma.bid.update({ where: { bidid: id }, data: dto });
  }

  async deleteBid(id: bigint) {
    return this.prisma.bid.delete({ where: { bidid: id } });
  }

  // Agreements
  async getAgreements(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.bidAgree.findMany({ skip, take: limit, orderBy: { created_at: 'desc' }, include: { bid: { include: { requirement: true } } } }),
      this.prisma.bidAgree.count(),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async createAgreement(dto: any) {
    return this.prisma.bidAgree.create({ data: dto, include: { bid: true } });
  }

  async updateAgreement(id: bigint, dto: any) {
    return this.prisma.bidAgree.update({ where: { agreeid: id }, data: dto });
  }

  async deleteAgreement(id: bigint) {
    return this.prisma.bidAgree.delete({ where: { agreeid: id } });
  }
}
