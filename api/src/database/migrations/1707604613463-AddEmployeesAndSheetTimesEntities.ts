import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeesAndSheetTimesEntities1707604613463 implements MigrationInterface {
    name = 'AddEmployeesAndSheetTimesEntities1707604613463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "generic"."employees" ("employee_id" SERIAL NOT NULL, "employee_name" character varying NOT NULL, "employee_lastname" character varying NOT NULL, "employee_created_at" TIMESTAMP NOT NULL, "user_id" integer, CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id"), CONSTRAINT "PK_c9a09b8e6588fb4d3c9051c8937" PRIMARY KEY ("employee_id"))`);
        await queryRunner.query(`CREATE TABLE "generic"."sheet_time" ("sheet_id" SERIAL NOT NULL, "state" character varying NOT NULL, "hourly_rate" integer NOT NULL, "hours" integer NOT NULL, "total_payed" integer NOT NULL, "employee_id" integer, CONSTRAINT "REL_db92ac323bb3a2db1d76bec8d3" UNIQUE ("employee_id"), CONSTRAINT "PK_cedf4e731b8ad3040fef284f9d0" PRIMARY KEY ("sheet_id"))`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "generic"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "generic"."sheet_time" ADD CONSTRAINT "FK_db92ac323bb3a2db1d76bec8d3c" FOREIGN KEY ("employee_id") REFERENCES "generic"."employees"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."sheet_time" DROP CONSTRAINT "FK_db92ac323bb3a2db1d76bec8d3c"`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`);
        await queryRunner.query(`DROP TABLE "generic"."sheet_time"`);
        await queryRunner.query(`DROP TABLE "generic"."employees"`);
    }

}
