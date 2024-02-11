import { MigrationInterface, QueryRunner } from "typeorm";

export class JsonbInProfile1707595573958 implements MigrationInterface {
    name = 'JsonbInProfile1707595573958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."profiles" DROP COLUMN "profile_config"`);
        await queryRunner.query(`ALTER TABLE "generic"."profiles" ADD "profile_config" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."profiles" DROP COLUMN "profile_config"`);
        await queryRunner.query(`ALTER TABLE "generic"."profiles" ADD "profile_config" character varying NOT NULL`);
    }

}
