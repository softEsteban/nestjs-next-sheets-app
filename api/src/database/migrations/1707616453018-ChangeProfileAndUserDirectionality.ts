import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProfileAndUserDirectionality1707616453018 implements MigrationInterface {
    name = 'ChangeProfileAndUserDirectionality1707616453018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "generic"."users" DROP CONSTRAINT "REL_23371445bd80cb3e413089551b"`);
        await queryRunner.query(`ALTER TABLE "generic"."users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "generic"."profiles"("profile_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generic"."users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "generic"."users" ADD CONSTRAINT "REL_23371445bd80cb3e413089551b" UNIQUE ("profile_id")`);
        await queryRunner.query(`ALTER TABLE "generic"."users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "generic"."profiles"("profile_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
