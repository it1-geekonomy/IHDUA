import { ApiProperty } from '@nestjs/swagger';

/** One card on a category landing page. */
export class ImpactInitiativeCardDto {
  @ApiProperty({
    example: 'Vinayaka Jnana Vidyashale',
    description: 'Title to show: cardTitle, or name when no card title is set',
  })
  title: string;

  @ApiProperty({
    example: 'https://cdn.example.com/impact-initiatives/card.webp',
    nullable: true,
    description:
      'Image to show: cardImageUrl, or heroImageUrl when no card image is set',
  })
  imageUrl: string | null;

  @ApiProperty({
    example: 'vinayaka-jnana-vidyashale-mysuru',
    description: 'Website URL is /{slug}',
  })
  slug: string;

  @ApiProperty({
    example: 1,
    description: 'Display order set in the CMS; cards are already sorted by it',
  })
  displayOrder: number;

  @ApiProperty({
    example: 'Vinayaka Jnana Vidyashale',
    nullable: true,
    description: 'Card title set in the CMS (null when empty)',
  })
  cardTitle: string | null;

  @ApiProperty({
    example: 'https://cdn.example.com/impact-initiatives/card.webp',
    nullable: true,
    description: 'Card image set in the CMS (null when empty)',
  })
  cardImageUrl: string | null;

  @ApiProperty({
    example: 'Vinayaka Jnana Vidyashale, Mysuru',
    description: 'Page name, the fallback for title',
  })
  name: string;

  @ApiProperty({
    example: 'https://cdn.example.com/impact-initiatives/hero.webp',
    nullable: true,
    description: 'Banner desktop image, the fallback for imageUrl',
  })
  heroImageUrl: string | null;
}
