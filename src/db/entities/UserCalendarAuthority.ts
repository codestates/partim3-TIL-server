import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { CalendarAuthority } from './CalendarAuthority';

@Entity()
export class UserCalendarAuthority extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userAuthorities, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user!: number;

  @ManyToOne(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.authorityUsers,
    { onDelete: 'CASCADE', nullable: false }
  )
  @JoinColumn()
  calenderAuthority!: number;
}
