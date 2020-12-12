import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { UserCalendarAuthority } from './UserCalendarAuthority';
import { CalendarAuthority } from './CalendarAuthority';
import { Calendar } from './Calendar';
import { Tag } from './Tag';
import { Message } from './Message';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: true,
  })
  email!: string;

  @Column({
    nullable: true,
  })
  password!: string;

  @Column({
    nullable: false,
  })
  nickname!: string;

  @Column({
    nullable: true,
  })
  oauthType!: string;

  @Column({
    nullable: true,
  })
  socialId!: string;

  @Column({
    nullable: true,
  })
  token!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(
    () => UserCalendarAuthority,
    (userCalendarAuthority) => userCalendarAuthority.user
  )
  userAuthorities!: UserCalendarAuthority[];

  @OneToMany(
    () => CalendarAuthority,
    (calendarAuthority) => calendarAuthority.owner
  )
  myCalendarAuthorities!: CalendarAuthority[];

  @OneToMany(() => Calendar, (calendar) => calendar.owner)
  myCalendars!: Calendar[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags!: Tag[];

  @OneToMany(() => Message, (message) => message.user)
  messages!: Message[];
}
