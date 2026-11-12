import {
  IsInt,
  Min,
} from 'class-validator';

export class UpdateImpactStatsDto {
  @IsInt()
  @Min(0)
  vaccinated!: number;

  @IsInt()
  @Min(0)
  castrations!: number;

  @IsInt()
  @Min(0)
  tests!: number;

  @IsInt()
  @Min(0)
  sheltered!: number;

  @IsInt()
  @Min(0)
  citizens!: number;
}