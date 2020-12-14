import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { CalendarAuthority } from './CalendarAuthority';

@Entity()
export class UserCalendarAuthority {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  calenderAuthorityId!: number;

  @ManyToOne(() => User, (user) => user.userCalendarAuthorities, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user!: User;

  @ManyToOne(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.calendarAuthorityUsers,
    { primary: true, onDelete: 'CASCADE', nullable: true }
  )
  @JoinColumn()
  calenderAuthority!: CalendarAuthority;
}
