
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn ,Column,ManyToOne} from 'typeorm';
import { User } from "./User";

@Entity()
export class Acheivment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: [ '1win', '5wins',"10wins","20wins","50wins"]})
  name:  '1win' | '5wins'|'10wins'|'20wins'|'50wins';
  @ManyToOne(() => User, (user) => user.acheivment, { onDelete: 'CASCADE' })
  belongs: User;
 
}
