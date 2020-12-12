import { Entity, BaseEntity, ManyToOne } from 'typeorm';
import { User } from './User';
import { CalendarAuthority } from './CalendarAuthority';

@Entity()
export class UserCalendarAuthority extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userAuthorities, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: User;

  @ManyToOne(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.authorityUsers,
    { primary: true, onDelete: 'CASCADE', nullable: false }
  )
  calenderAuthority!: CalendarAuthority;
}
