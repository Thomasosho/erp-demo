import { MigrationInterface, QueryRunner } from "typeorm";

export class VVerisonNumber1738285929925 implements MigrationInterface {
    name = 'VVerisonNumber1738285929925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "module"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "UQ_240853a0c3353c25fb12434ad33"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "module" character varying NOT NULL`);
    }

}
