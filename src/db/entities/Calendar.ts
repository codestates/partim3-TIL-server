import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CalendarAuthority } from './CalendarAuthority';
import { User } from './User';
import { Todo } from './Todo';
import { Review } from './Review';

@Entity()
export class Calendar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.calendar
  )
  authorities!: CalendarAuthority[];

  @OneToMany(() => Todo, (todo) => todo.calendar)
  todos!: Todo[];

  @OneToMany(() => Review, (review) => review.calendar)
  reviews!: Review[];

  @ManyToOne(() => User, (user) => user.myCalendars, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner!: number;
}
