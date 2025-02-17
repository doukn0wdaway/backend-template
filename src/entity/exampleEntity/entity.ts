//INFO: for example typeorm definition of entity

// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";
//
// export enum ScreenshotType {
//   THROWING_SPOT = "throwing_spot",
//   LANDING_SPOT = "landing_spot",
//   NEAR_LANDING_SPOT = "near_landing_spot",
// }
//
// @Entity()
// export class exampleEntity {
//   @PrimaryGeneratedColumn()
//   id!: number;
//
//   @Column()
//   filename!: string;
//
//   @Column({ type: "simple-enum", enum: ScreenshotType })
//   type!: ScreenshotType;
//
//   @CreateDateColumn()
//   createdAt!: Date;
//
//   @UpdateDateColumn()
//   updatedAt!: Date;
// }
