import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './custom.entity';
import { Staff } from './staff.entity';

@Entity('StaffDocuments')
export class StaffDocument extends CustomEntity {
  @ManyToOne(() => Staff, staff => staff.documents)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ name: 'document_type', length: 100 })
  documentType: string;

  @Column({ name: 'document_number', length: 100, nullable: true })
  documentNumber: string;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: Date;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ name: 'file_path', length: 255 })
  filePath: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verification_date', type: 'date', nullable: true })
  verificationDate: Date;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy: number;

  @Column({ name: 'remarks', length: 255, nullable: true })
  remarks: string;
}