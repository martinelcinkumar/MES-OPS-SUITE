import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepo: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly membersRepo: Repository<TeamMember>,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.teamsRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepo.findOne({ where: { id } });
    if (!team) throw new NotFoundException(`Team ${id} not found`);
    return team;
  }

  async create(dto: CreateTeamDto): Promise<Team> {
    const existing = await this.teamsRepo.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Team slug "${dto.slug}" already exists`);
    }
    const team = this.teamsRepo.create(dto);
    return this.teamsRepo.save(team);
  }

  async update(id: string, dto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    if (dto.slug && dto.slug !== team.slug) {
      const existing = await this.teamsRepo.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Team slug "${dto.slug}" already exists`);
      }
    }
    Object.assign(team, dto);
    return this.teamsRepo.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamsRepo.remove(team);
  }

  // ── Team members (nested under a team) ───────────────────────────
  async findMembers(teamId: string): Promise<TeamMember[]> {
    await this.findOne(teamId);
    return this.membersRepo.find({
      where: { teamId },
      order: { firstName: 'ASC' },
    });
  }

  async findMember(teamId: string, memberId: string): Promise<TeamMember> {
    const member = await this.membersRepo.findOne({
      where: { id: memberId, teamId },
    });
    if (!member) {
      throw new NotFoundException(
        `Member ${memberId} not found on team ${teamId}`,
      );
    }
    return member;
  }

  async addMember(
    teamId: string,
    dto: CreateTeamMemberDto,
  ): Promise<TeamMember> {
    await this.findOne(teamId);
    const existing = await this.membersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" is already in use`);
    }
    const member = this.membersRepo.create({ ...dto, teamId });
    return this.membersRepo.save(member);
  }

  async updateMember(
    teamId: string,
    memberId: string,
    dto: UpdateTeamMemberDto,
  ): Promise<TeamMember> {
    const member = await this.findMember(teamId, memberId);
    if (dto.email && dto.email !== member.email) {
      const existing = await this.membersRepo.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException(`Email "${dto.email}" is already in use`);
      }
    }
    Object.assign(member, dto);
    return this.membersRepo.save(member);
  }

  async removeMember(teamId: string, memberId: string): Promise<void> {
    const member = await this.findMember(teamId, memberId);
    await this.membersRepo.remove(member);
  }
}
