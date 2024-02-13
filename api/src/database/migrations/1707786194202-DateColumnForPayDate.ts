import { MigrationInterface, QueryRunner } from "typeorm";

export class DateColumnForPayDate1707786194202 implements MigrationInterface {
    name = 'DateColumnForPayDate1707786194202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "check_date"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "check_date" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "check_date"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "check_date" TIMESTAMP NOT NULL`);
    }

}
