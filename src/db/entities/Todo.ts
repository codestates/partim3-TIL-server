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
import { TodoTag } from './TodoTag';

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  scheduleDate!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Calendar, (calendar) => calendar.todos, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  calendar!: number;

  @OneToMany(() => TodoTag, (todoTag) => todoTag.todo)
  todoTags!: TodoTag[];
}
