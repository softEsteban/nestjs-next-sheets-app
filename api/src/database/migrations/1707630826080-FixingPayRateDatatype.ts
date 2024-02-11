import { MigrationInterface, QueryRunner } from "typeorm";

export class FixingPayRateDatatype1707630826080 implements MigrationInterface {
    name = 'FixingPayRateDatatype1707630826080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP COLUMN "employee_pay_rate"`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD "employee_pay_rate" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP COLUMN "employee_pay_rate"`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD "employee_pay_rate" character varying NOT NULL`);
    }

}
