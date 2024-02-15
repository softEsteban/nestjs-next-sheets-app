import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactoringEmployeeReferenceFromTimeSheets1707973492264 implements MigrationInterface {
    name = 'RefactoringEmployeeReferenceFromTimeSheets1707973492264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP CONSTRAINT "FK_9e5fee697c094868ed2e56b4e16"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP CONSTRAINT "REL_9e5fee697c094868ed2e56b4e1"`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" DROP COLUMN "employee_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD "employee_id" integer`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD CONSTRAINT "REL_9e5fee697c094868ed2e56b4e1" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_times" ADD CONSTRAINT "FK_9e5fee697c094868ed2e56b4e16" FOREIGN KEY ("employee_id") REFERENCES "generic"."employees"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
