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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { UserCalendarAuthority } from './UserCalendarAuthority';
import { Calendar } from './Calendar';

@Entity()
export class CalendarAuthority extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  read!: boolean;

  @Column()
  write!: boolean;

  @Column()
  auth!: boolean;

  @Column()
  ownerNickname!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(
    () => UserCalendarAuthority,
    (userCalendarAuthority) => userCalendarAuthority.calenderAuthority
  )
  authorityUsers!: UserCalendarAuthority[];

  @ManyToOne(() => User, (user) => user.myCalendarAuthorities)
  owner!: number;

  @ManyToOne(() => Calendar, (calendar) => calendar.authorities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  calendar!: number;
}
