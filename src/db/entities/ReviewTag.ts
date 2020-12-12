import { Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';
import { Tag } from './Tag';

@Entity()
export class ReviewTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Tag, (tag) => tag.reviewTags, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  tag!: number;

  @ManyToOne(() => Review, (review) => review.reviewTags, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  review!: number;
}
