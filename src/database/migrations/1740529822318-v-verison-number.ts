import { MigrationInterface, QueryRunner } from "typeorm";

export class VVerisonNumber1740529822318 implements MigrationInterface {
    name = 'VVerisonNumber1740529822318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Departments" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "description" character varying(255), "code" character varying(20) NOT NULL, "manager_id" integer, CONSTRAINT "UQ_0b0f21ff0ddda5676ab476a2e4b" UNIQUE ("name"), CONSTRAINT "UQ_6e485203999b6f24b6312f57ecb" UNIQUE ("code"), CONSTRAINT "PK_bc2db2043c7e4f09f6965b50186" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "EmergencyContacts" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "relationship" character varying(50) NOT NULL, "phone_number" character varying(20) NOT NULL, "alternative_phone" character varying(20), "email" character varying(255), "address" character varying(255), "is_primary" boolean NOT NULL DEFAULT false, "staff_id" integer, CONSTRAINT "PK_d1ded3fef3a7d40d8eab40bbf79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "EmploymentDetails" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "position" character varying(100) NOT NULL, "employment_type" character varying(50) NOT NULL, "hire_date" date NOT NULL, "end_date" date, "status" character varying(20) NOT NULL DEFAULT 'active', "salary" numeric(10,2), "bank_name" character varying(100), "account_number" character varying(50), "tax_id" character varying(50), "social_security" character varying(50), "contract_file" character varying(255), "reporting_to" integer, "work_schedule" character varying(255), "leave_entitlement" integer NOT NULL DEFAULT '0', "staff_id" integer, CONSTRAINT "REL_462fe7f5acec8697bb6c18db0e" UNIQUE ("staff_id"), CONSTRAINT "PK_2136c650c2c354af68a2ab94af6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Staffs" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "staff_id" character varying(50) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "middle_name" character varying(100), "date_of_birth" date NOT NULL, "gender" character varying(20) NOT NULL, "marital_status" character varying(20), "nationality" character varying(100), "phone_number" character varying(20) NOT NULL, "alternative_email" character varying(255), "address" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "postal_code" character varying(20), "country" character varying(100) NOT NULL, "profile_picture" character varying(255), "user_id" integer, "department_id" integer, CONSTRAINT "UQ_47f3b7210a6640dfaac9c1c789a" UNIQUE ("staff_id"), CONSTRAINT "REL_92fa755a9c7266944992c60208" UNIQUE ("user_id"), CONSTRAINT "PK_144c7a0cd3ca6d3e410bfaecff3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "StaffDocuments" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "document_type" character varying(100) NOT NULL, "document_number" character varying(100), "issue_date" date, "expiry_date" date, "file_path" character varying(255) NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "verification_date" date, "verified_by" integer, "remarks" character varying(255), "staff_id" integer, CONSTRAINT "PK_dd4845a88756395dfa99f3f8189" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Departments" ADD CONSTRAINT "FK_1190092d97a5de68a174ec5daaf" FOREIGN KEY ("manager_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EmergencyContacts" ADD CONSTRAINT "FK_b5cd7f7e2989fc0dc0d1bc1c803" FOREIGN KEY ("staff_id") REFERENCES "Staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EmploymentDetails" ADD CONSTRAINT "FK_462fe7f5acec8697bb6c18db0e9" FOREIGN KEY ("staff_id") REFERENCES "Staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Staffs" ADD CONSTRAINT "FK_92fa755a9c7266944992c60208b" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Staffs" ADD CONSTRAINT "FK_241369c4cec273b50faaf7ec5db" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "StaffDocuments" ADD CONSTRAINT "FK_7bb8fe39ee5185fad0061e66434" FOREIGN KEY ("staff_id") REFERENCES "Staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "StaffDocuments" DROP CONSTRAINT "FK_7bb8fe39ee5185fad0061e66434"`);
        await queryRunner.query(`ALTER TABLE "Staffs" DROP CONSTRAINT "FK_241369c4cec273b50faaf7ec5db"`);
        await queryRunner.query(`ALTER TABLE "Staffs" DROP CONSTRAINT "FK_92fa755a9c7266944992c60208b"`);
        await queryRunner.query(`ALTER TABLE "EmploymentDetails" DROP CONSTRAINT "FK_462fe7f5acec8697bb6c18db0e9"`);
        await queryRunner.query(`ALTER TABLE "EmergencyContacts" DROP CONSTRAINT "FK_b5cd7f7e2989fc0dc0d1bc1c803"`);
        await queryRunner.query(`ALTER TABLE "Departments" DROP CONSTRAINT "FK_1190092d97a5de68a174ec5daaf"`);
        await queryRunner.query(`DROP TABLE "StaffDocuments"`);
        await queryRunner.query(`DROP TABLE "Staffs"`);
        await queryRunner.query(`DROP TABLE "EmploymentDetails"`);
        await queryRunner.query(`DROP TABLE "EmergencyContacts"`);
        await queryRunner.query(`DROP TABLE "Departments"`);
    }

}
