import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsUrl } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  blogUrl: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
