import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { CalendarAuthority } from './CalendarAuthority';

@Entity()
export class UserCalendarAuthority extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  calenderAuthorityId!: number;

  @ManyToOne(() => User, (user) => user.userCalendarAuthorities, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user!: User;

  @ManyToOne(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.calendarAuthorityUsers,
    { primary: true, onDelete: 'CASCADE', nullable: false }
  )
  @JoinColumn()
  calenderAuthority!: CalendarAuthority;
}
