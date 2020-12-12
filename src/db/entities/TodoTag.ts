import { Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from './Tag';
import { Todo } from './Todo';

@Entity()
export class TodoTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Tag, (tag) => tag.todoTags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  tag!: number;

  @ManyToOne(() => Todo, (todo) => todo.todoTags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  todo!: number;
}
