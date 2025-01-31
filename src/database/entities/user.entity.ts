import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { CustomEntity } from './custom.entity';
import { Role } from './role.entity';

@Entity('Users')
export class User extends CustomEntity {
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'password', length: 255, nullable: true })
  password: string;

  @Column({ name: 'email', length: 255, unique: true })
  email: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
