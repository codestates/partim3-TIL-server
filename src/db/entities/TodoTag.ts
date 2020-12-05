import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Tag } from './Tag';
import { Todo } from './Todo';

@Entity()
export class TodoTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Tag, (tag) => tag.todoTags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  tag!: number;

  @ManyToOne(() => Todo, (todo) => todo.todoTags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  todo!: number;
}
