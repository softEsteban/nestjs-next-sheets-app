import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangingSheetTimesColumnsAndAddingPayRate1707970371113 implements MigrationInterface {
    name = 'ChangingSheetTimesColumnsAndAddingPayRate1707970371113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "hours"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "total_payed"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "check_date"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "sheet_state" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "sheet_hours" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "sheet_pay_rate" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "sheet_total_payed" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "sheet_check_date" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "sheet_check_date"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "sheet_total_payed"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "sheet_pay_rate"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "sheet_hours"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "sheet_state"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "check_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "total_payed" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "hours" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "state" character varying NOT NULL`);
    }

}
