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

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fromUser!: number;

  @Column()
  read!: boolean;

  @Column()
  write!: boolean;

  @Column()
  auth!: boolean;

  @Column()
  shareCalendar!: number;

  @Column({ default: '' })
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: number;
}
