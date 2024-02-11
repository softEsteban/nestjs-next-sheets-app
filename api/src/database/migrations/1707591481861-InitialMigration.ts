import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1707591481861 implements MigrationInterface {
    name = 'InitialMigration1707591481861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "generic"."profiles" ("profile_id" SERIAL NOT NULL, "profile_name" character varying NOT NULL, "profile_config" character varying NOT NULL, CONSTRAINT "PK_6a23df60690da92fd263eca2e93" PRIMARY KEY ("profile_id"))`);
        await queryRunner.query(`CREATE TABLE "generic"."users" ("user_id" SERIAL NOT NULL, "user_name" character varying NOT NULL, "user_lastname" character varying NOT NULL, "user_type" character varying NOT NULL, "user_email" character varying NOT NULL, "user_password" character varying NOT NULL, "user_created_at" TIMESTAMP NOT NULL, "profile_id" integer NOT NULL, "user_avatar" character varying NOT NULL, CONSTRAINT "REL_23371445bd80cb3e413089551b" UNIQUE ("profile_id"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "generic"."users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "generic"."profiles"("profile_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`DROP TABLE "generic"."users"`);
        await queryRunner.query(`DROP TABLE "generic"."profiles"`);
    }

}
