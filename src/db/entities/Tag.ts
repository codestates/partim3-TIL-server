import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { TodoTag } from './TodoTag';
import { ReviewTag } from './ReviewTag';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tagName!: string;

  @Column()
  tagColor!: string;

  @Column()
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.tags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: number;

  @OneToMany(() => TodoTag, (todoTag) => todoTag.tag)
  todoTags!: TodoTag[];

  @OneToMany(() => ReviewTag, (reviewTag) => reviewTag.tag)
  reviewTags!: ReviewTag[];
}
