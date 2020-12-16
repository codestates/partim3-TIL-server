import { Entity, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { CalendarAuthority } from './CalendarAuthority';

@Entity()
export class UserCalendarAuthority extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userCalendarAuthorities, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: number;

  @ManyToOne(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.calendarAuthorityUsers,
    { primary: true, onDelete: 'CASCADE', nullable: false }
  )
  calenderAuthority!: number;
}
