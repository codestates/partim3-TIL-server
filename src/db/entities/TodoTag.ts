import { Entity, BaseEntity, ManyToOne } from 'typeorm';
import { Tag } from './Tag';
import { Todo } from './Todo';

@Entity()
export class TodoTag extends BaseEntity {
  @ManyToOne(() => Tag, (tag) => tag.todoTags, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  tag!: number;

  @ManyToOne(() => Todo, (todo) => todo.todoTags, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  todo!: number;
}
