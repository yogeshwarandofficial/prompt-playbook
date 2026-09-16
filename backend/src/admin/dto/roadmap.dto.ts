import { IsString, IsArray, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  audience: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prerequisites: string[];

  @IsArray()
  @IsOptional()
  tracks: any[];

  @IsArray()
  @IsOptional()
  modules: any[];

  @IsArray()
  @IsOptional()
  projects: any[];

  @IsArray()
  @IsOptional()
  resources: any[];

  @IsArray()
  @IsOptional()
  careers: any[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateRoadmapDto extends CreateRoadmapDto {}
