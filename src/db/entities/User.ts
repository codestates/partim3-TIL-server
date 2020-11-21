import { join } from "path";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Todo } from "./Todo";
import { Review } from "./Review";

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
    nullable: true,
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

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany((type) => Todo, (todo) => todo.user)
  @JoinColumn()
  todos!: Todo[];

  @OneToMany((type) => Review, (review) => review.user)
  @JoinColumn()
  reviews!: Review[];
}
