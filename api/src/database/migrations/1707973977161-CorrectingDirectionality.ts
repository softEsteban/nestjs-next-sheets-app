import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectingDirectionality1707973977161 implements MigrationInterface {
    name = 'CorrectingDirectionality1707973977161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "employee_id" integer`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD CONSTRAINT "FK_9e5fee697c094868ed2e56b4e16" FOREIGN KEY ("employee_id") REFERENCES "generic"."employees"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP CONSTRAINT "FK_9e5fee697c094868ed2e56b4e16"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "employee_id"`);
    }

}
