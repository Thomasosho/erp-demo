import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CustomEntity } from './custom.entity';
import { Staff } from './staff.entity';

@Entity('EmploymentDetails')
export class EmploymentDetail extends CustomEntity {
  @OneToOne(() => Staff, (staff) => staff.employmentDetail)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ name: 'position', length: 100 })
  position: string;

  @Column({ name: 'employment_type', length: 50 })
  employmentType: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'status', length: 20, default: 'active' })
  status: string;

  @Column({
    name: 'salary',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  salary: number;

  @Column({ name: 'bank_name', length: 100, nullable: true })
  bankName: string;

  @Column({ name: 'account_number', length: 50, nullable: true })
  accountNumber: string;

//   @Column({ name: 'tax_id', length: 50, nullable: true })
//   taxId: string;

//   @Column({ name: 'social_security', length: 50, nullable: true })
//   socialSecurity: string;

  @Column({ name: 'contract_file', length: 255, nullable: true })
  contractFile: string;

  @Column({ name: 'reporting_to', nullable: true })
  reportingTo: number;

  @Column({ name: 'work_schedule', length: 255, nullable: true })
  workSchedule: string;

  @Column({ name: 'leave_entitlement', type: 'int', default: 0 })
  leaveEntitlement: number;
}
