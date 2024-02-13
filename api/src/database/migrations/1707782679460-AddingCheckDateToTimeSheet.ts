import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCheckDateToTimeSheet1707782679460 implements MigrationInterface {
    name = 'AddingCheckDateToTimeSheet1707782679460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "check_date" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "check_date"`);
    }

}
