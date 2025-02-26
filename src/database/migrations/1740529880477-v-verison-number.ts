import { MigrationInterface, QueryRunner } from "typeorm";

export class VVerisonNumber1740529880477 implements MigrationInterface {
    name = 'VVerisonNumber1740529880477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "EmploymentDetails" DROP COLUMN "tax_id"`);
        await queryRunner.query(`ALTER TABLE "EmploymentDetails" DROP COLUMN "social_security"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "EmploymentDetails" ADD "social_security" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "EmploymentDetails" ADD "tax_id" character varying(50)`);
    }

}
