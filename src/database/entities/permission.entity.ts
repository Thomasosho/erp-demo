import { Entity, Column, ManyToMany } from 'typeorm';
import { CustomEntity } from './custom.entity';
import { Role } from './role.entity';

@Entity()
export class Permission extends CustomEntity {
  @Column()
  name: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}