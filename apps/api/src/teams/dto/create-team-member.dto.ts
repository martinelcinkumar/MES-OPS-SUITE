import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AvatarColor, MemberRole } from '../../common/enums';

export class CreateTeamMemberDto {
  @IsString()
  @MaxLength(80)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @IsEmail()
  email: string;

  @IsEnum(MemberRole)
  role: MemberRole;

  @IsOptional()
  @IsEnum(AvatarColor)
  avatarColor?: AvatarColor;
}
