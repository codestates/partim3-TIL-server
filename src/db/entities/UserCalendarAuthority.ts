import { Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { CalendarAuthority } from './CalendarAuthority';

@Entity()
export class UserCalendarAuthority extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userAuthorities, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: User;

  @ManyToOne(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.userAuthorities,
    { primary: true, onDelete: 'CASCADE', nullable: false }
  )
  calenderAuthority!: CalendarAuthority;
}
