import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import LocationInterface from "@/interfaces/location";

@Entity("locations")
export default class Location extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    static async createNew(name: string) {  
      const newLocation = this.create({ name });
      await newLocation.save();
      return newLocation;
    }

    static async getLocations() {
      return await this.find();
    }
}
