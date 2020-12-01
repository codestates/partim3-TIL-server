import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import review from '../../controllers/calendar/review';
import { Review } from './Review';
import { Tag } from './Tag';

@Entity()
export class ReviewTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Tag, (tag) => tag.reviewTags, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tag!: number;

  @ManyToOne(() => Review, (review) => review.reviewTags, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  review!: number;
}
