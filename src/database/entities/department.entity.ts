import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CustomEntity } from './custom.entity';
import { Staff } from './staff.entity';
import { User } from './user.entity';

@Entity('Departments')
export class Department extends CustomEntity {
  @Column({ name: 'name', length: 100, unique: true })
  name: string;

  @Column({ name: 'description', length: 255, nullable: true })
  description: string;

  @Column({ name: 'code', length: 20, unique: true })
  code: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @OneToMany(() => Staff, (staff) => staff.department)
  staffs: Staff[];
}
