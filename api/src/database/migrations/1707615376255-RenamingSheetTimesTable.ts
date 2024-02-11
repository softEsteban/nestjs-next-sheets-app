import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamingSheetTimesTable1707615376255 implements MigrationInterface {
    name = 'RenamingSheetTimesTable1707615376255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "generic"."sheet_times" ("sheet_id" SERIAL NOT NULL, "state" character varying NOT NULL, "hourly_rate" integer NOT NULL, "hours" integer NOT NULL, "total_payed" integer NOT NULL, "employee_id" integer, CONSTRAINT "REL_9e5fee697c094868ed2e56b4e1" UNIQUE ("employee_id"), CONSTRAINT "PK_89a1d2248860f201b2b4c9175e6" PRIMARY KEY ("sheet_id"))`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD CONSTRAINT "FK_9e5fee697c094868ed2e56b4e16" FOREIGN KEY ("employee_id") REFERENCES "generic"."employees"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP CONSTRAINT "FK_9e5fee697c094868ed2e56b4e16"`);
        await queryRunner.query(`DROP TABLE "generic"."sheet_times"`);
    }

}
