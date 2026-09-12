import { IsArray, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class ReorderPhasesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  /** Ordered array of phase IDs — first element = phaseOrder 1 */
  phaseIds: string[];
}
