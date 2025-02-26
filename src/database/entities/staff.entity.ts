import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CustomEntity } from './custom.entity';
import { User } from './user.entity';
import { Department } from './department.entity';
import { StaffDocument } from './staff-document.entity';
import { EmergencyContact } from './emergency-contact.entity';
import { EmploymentDetail } from './employment-detail.entity';

@Entity('Staffs')
export class Staff extends CustomEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'staff_id', length: 50, unique: true })
  staffId: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'middle_name', length: 100, nullable: true })
  middleName: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'gender', length: 20 })
  gender: string;

  @Column({ name: 'marital_status', length: 20, nullable: true })
  maritalStatus: string;

  @Column({ name: 'nationality', length: 100, nullable: true })
  nationality: string;

  @Column({ name: 'phone_number', length: 20 })
  phoneNumber: string;

  @Column({ name: 'alternative_email', length: 255, nullable: true })
  alternativeEmail: string;

  @Column({ name: 'address', length: 255 })
  address: string;

  @Column({ name: 'city', length: 100 })
  city: string;

  @Column({ name: 'state', length: 100 })
  state: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ name: 'country', length: 100 })
  country: string;

  @Column({ name: 'profile_picture', length: 255, nullable: true })
  profilePicture: string;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => StaffDocument, (document) => document.staff)
  documents: StaffDocument[];

  @OneToMany(() => EmergencyContact, (contact) => contact.staff)
  emergencyContacts: EmergencyContact[];

  @OneToOne(
    () => EmploymentDetail,
    (employmentDetail) => employmentDetail.staff,
  )
  employmentDetail: EmploymentDetail;
}
