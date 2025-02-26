import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './custom.entity';
import { Staff } from './staff.entity';

@Entity('EmergencyContacts')
export class EmergencyContact extends CustomEntity {
  @ManyToOne(() => Staff, (staff) => staff.emergencyContacts)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ name: 'name', length: 100 })
  name: string;

  @Column({ name: 'relationship', length: 50 })
  relationship: string;

  @Column({ name: 'phone_number', length: 20 })
  phoneNumber: string;

  @Column({ name: 'alternative_phone', length: 20, nullable: true })
  alternativePhone: string;

  @Column({ name: 'email', length: 255, nullable: true })
  email: string;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;
}
