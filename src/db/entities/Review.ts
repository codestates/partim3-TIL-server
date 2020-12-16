import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Calendar } from './Calendar';
import { ReviewTag } from './ReviewTag';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  context!: string;

  @Column()
  imageUrl!: string;

  @Column()
  scheduleDate!: string;

  @Column()
  scheduleTime!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Calendar, (calendar) => calendar.reviews, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  calendar!: number;

  @OneToMany(() => ReviewTag, (reviewTag) => reviewTag.review)
  reviewTags!: ReviewTag[];
}
