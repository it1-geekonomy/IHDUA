import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ImpactCardPosition } from '../../../common/enums/impact-card-position.enum';

export class CreateImpactStatDto {
  @ApiProperty({
    enum: ImpactCardPosition,
    example: ImpactCardPosition.FIRST,
    description:
      'Card position and theme on the website (first = purple, second = yellow, third = purple, fourth = yellow)',
  })
  @IsEnum(ImpactCardPosition)
  @IsNotEmpty()
  cardPosition: ImpactCardPosition;

  @ApiProperty({
    example: 'Villages Reached',
    description: 'Name/title of the metric',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  metricName: string;

  @ApiProperty({
    example: '202+',
    description:
      'Formatted string value of the metric (e.g. 202+, 600+, ₹9.14 Cr, 3,487+)',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  metricValue: string;
}
