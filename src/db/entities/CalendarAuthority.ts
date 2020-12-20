import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
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

  @Column()
  ownerId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.CalendarAuthorities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user!: number;

  @ManyToOne(() => Calendar, (calendar) => calendar.authorities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  calendar!: number;
}
