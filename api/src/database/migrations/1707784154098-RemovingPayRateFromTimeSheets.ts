import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovingPayRateFromTimeSheets1707784154098 implements MigrationInterface {
    name = 'RemovingPayRateFromTimeSheets1707784154098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "hourly_rate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "hourly_rate" integer NOT NULL`);
    }

}
