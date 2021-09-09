import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import ActivityUser from "./ActivityUser";
import Location from "./Location";

@Entity("activities")
export default class Activity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    locationId: string;

    @Column()
    maxInscriptions: number;

    @Column()
    inscriptions: number;

    @Column()
    beginTime: Date;

    @Column()
    endTime: Date;

    @OneToMany(() => ActivityUser, (activityUser) => activityUser.activity)
    activityUser: ActivityUser;

    @ManyToOne(() => Location, (location) => location.activity, { eager: true })
    location: Location;

    static async getDays() {
      return await this.find({ select: ["beginTime"] });
    }

    static async getActivitiesByDay(day: string) {
      const response= await this.createQueryBuilder("activities").where("DATE(activities.beginTime) = :time", { time: day }).getMany();
      return response;
    }
}

