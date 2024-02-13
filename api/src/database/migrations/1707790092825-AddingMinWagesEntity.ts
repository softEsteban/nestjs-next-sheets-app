import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingMinWagesEntity1707790092825 implements MigrationInterface {
    name = 'AddingMinWagesEntity1707790092825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "generic"."minimum_wages" ("wage_id" SERIAL NOT NULL, "wage_name" character varying NOT NULL, "wage_value" integer NOT NULL, CONSTRAINT "PK_d7e81b8b0727c78281849e56758" PRIMARY KEY ("wage_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "generic"."minimum_wages"`);
    }

}
