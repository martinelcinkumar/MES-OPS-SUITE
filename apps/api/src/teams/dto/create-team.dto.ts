import { IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { SupportLevel } from '../../common/enums';

export class CreateTeamDto {
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase alphanumeric with hyphens only',
  })
  slug: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(SupportLevel)
  supportLevel?: SupportLevel;
}
