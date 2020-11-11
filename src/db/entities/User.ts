import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

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
  createAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
