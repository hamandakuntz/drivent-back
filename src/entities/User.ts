import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, getConnection } from "typeorm";
import bcrypt from "bcrypt";
import EmailNotAvailableError from "@/errors/EmailNotAvailable";
import ActivityUser from "./ActivityUser";
import PasswordRecoveryInterface from "@/interfaces/passwordRecovery";

@Entity("users")
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToMany(() => ActivityUser, (activityUser) => activityUser.user)
  activityUser: ActivityUser;

  static async createNew(email: string, password: string) {
    await this.validateDuplicateEmail(email);
    const hashedPassword = this.hashPassword(password);

    const newUser = this.create({ email, password: hashedPassword });
    await newUser.save();

    return newUser;
  }

  static hashPassword(password: string) {
    return bcrypt.hashSync(password, 12);
  }

  static async validateDuplicateEmail(email: string) {
    const user = await this.findOne({ email });

    if(user) {
      throw new EmailNotAvailableError(email);
    }
  }  

  static async findByEmailAndPassword(email: string, password: string) {
    const user = await this.findOne({ email });
    
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    
    return null;
  }

  static async getUserById(id: number) {
    return await this.findOne({ id });
  }

  static async setNewPassword(passwordData: PasswordRecoveryInterface) {
    const hashedPassword = this.hashPassword(passwordData.password);
    return await this
      .createQueryBuilder()
      .update(User)
      .set({ password: hashedPassword })
      .where("email = :email", { email: passwordData.email })
      .execute();
  }
}

