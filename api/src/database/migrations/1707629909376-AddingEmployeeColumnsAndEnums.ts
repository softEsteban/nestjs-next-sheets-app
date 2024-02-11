import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingEmployeeColumnsAndEnums1707629909376 implements MigrationInterface {
    name = 'AddingEmployeeColumnsAndEnums1707629909376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "generic"."employees_employee_pay_type_enum" AS ENUM('hourly', 'salary')`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD "employee_pay_type" "generic"."employees_employee_pay_type_enum" NOT NULL DEFAULT 'salary'`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD "employee_pay_rate" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."users" DROP COLUMN "user_type"`);
        await queryRunner.query(`CREATE TYPE "generic"."users_user_type_enum" AS ENUM('admin', 'client')`);
        await queryRunner.query(`ALTER TABLE "generic"."users" ADD "user_type" "generic"."users_user_type_enum" NOT NULL DEFAULT 'client'`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3"`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "generic"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "generic"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "generic"."users" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "generic"."users_user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "generic"."users" ADD "user_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP COLUMN "employee_pay_rate"`);
        await queryRunner.query(`ALTER TABLE "generic"."employees" DROP COLUMN "employee_pay_type"`);
        await queryRunner.query(`DROP TYPE "generic"."employees_employee_pay_type_enum"`);
    }

}
