import { MigrationInterface, QueryRunner } from "typeorm";

export class Newmigrations1723899140030 implements MigrationInterface {
    name = 'Newmigrations1723899140030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "senderId" integer, "chatId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."room_member_role_enum" AS ENUM('owner', 'admin', 'default')`);
        await queryRunner.query(`CREATE TYPE "public"."room_member_status_enum" AS ENUM('muted', 'banned')`);
        await queryRunner.query(`CREATE TABLE "room_member" ("id" SERIAL NOT NULL, "role" "public"."room_member_role_enum" NOT NULL DEFAULT 'default', "status" "public"."room_member_status_enum", "acceptedtojoin" boolean NOT NULL DEFAULT true, "userId" integer, "roomId" integer, CONSTRAINT "PK_88c309dceb14799c91aa5eeb40d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notif_type_enum" AS ENUM('pending', 'message', 'roommessage')`);
        await queryRunner.query(`CREATE TABLE "notif" ("id" SERIAL NOT NULL, "type" "public"."notif_type_enum" NOT NULL, "isReaded" boolean NOT NULL, "userId" integer, "senderId" integer, "roomId" integer, CONSTRAINT "PK_18c8d66e394fdaa5af30a03649b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."room_type_enum" AS ENUM('public', 'protected', 'private')`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "roomname" character varying NOT NULL, "type" "public"."room_type_enum" NOT NULL DEFAULT 'public', "password" character varying, CONSTRAINT "UQ_7c646480b092a20dc25d518a592" UNIQUE ("roomname"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "friendsId" integer, "roomsId" integer, CONSTRAINT "REL_ec4051856bf02cb91f4c6358df" UNIQUE ("friendsId"), CONSTRAINT "REL_2817a2e8392862025abc84a325" UNIQUE ("roomsId"), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friends" ("id" SERIAL NOT NULL, "isAccepted" boolean NOT NULL DEFAULT false, "user1Id" integer, "user2Id" integer, CONSTRAINT "UQ_0b581e4dbdf838a684ec3476be6" UNIQUE ("user1Id", "user2Id"), CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blocked" ("id" SERIAL NOT NULL, "user1Id" integer, "user2Id" integer, CONSTRAINT "UQ_1924d149e91f90d9cdcec01433f" UNIQUE ("user1Id", "user2Id"), CONSTRAINT "PK_537b196b5b7e6aa56b637963a1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "score1" integer NOT NULL, "score2" integer NOT NULL, "player1Id" integer, "player2Id" integer, "winnerId" integer, "loserId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."acheivment_name_enum" AS ENUM('1win', '2wins', '3wins', '4wins', '5wins')`);
        await queryRunner.query(`CREATE TABLE "acheivment" ("id" SERIAL NOT NULL, "name" "public"."acheivment_name_enum" NOT NULL, "belongsId" integer, CONSTRAINT "PK_0e26c553240f4ee5690edebfc2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('online', 'offline', 'ingame')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying NOT NULL, "isNew" boolean NOT NULL DEFAULT true, "twoFactorAuthenticationSecret" character varying, "status" "public"."users_status_enum" NOT NULL DEFAULT 'offline', "isTwoFactorAuthenticationEnabled" boolean NOT NULL DEFAULT false, "HasAccess" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_members" ("room_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_d4ea360161fd5ff21a94ae9d8a6" PRIMARY KEY ("room_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e6cf45f179a524427ddf8bacd8" ON "room_members" ("room_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b2d15baf5b46ed9659bd71fbb4" ON "room_members" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_member" ADD CONSTRAINT "FK_6eb91357acd7efbd4f65d2375e1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_member" ADD CONSTRAINT "FK_6940db8d5a7d65b077ccfacf95d" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notif" ADD CONSTRAINT "FK_002fd04d260b40d4ac4f277b9ca" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notif" ADD CONSTRAINT "FK_156e313817145106b0a7cd4d23f" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notif" ADD CONSTRAINT "FK_f6afc21c3c925205fad542cc942" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_ec4051856bf02cb91f4c6358df6" FOREIGN KEY ("friendsId") REFERENCES "friends"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_2817a2e8392862025abc84a325f" FOREIGN KEY ("roomsId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_7aa51528da61b3e40a78710007e" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_bfc12f3db20b93759b75dc72956" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blocked" ADD CONSTRAINT "FK_e0508d0e15d3f496a3275e4a49e" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blocked" ADD CONSTRAINT "FK_9915ed07f5fd996ed58472e07f9" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_7b7f91302f66ab534423c96aa34" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_3b85329cbe5b9f9002f05018faf" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_534fe1b4be4a16b996ba7d78e76" FOREIGN KEY ("loserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "acheivment" ADD CONSTRAINT "FK_1fea3bff8770866269327349879" FOREIGN KEY ("belongsId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_members" ADD CONSTRAINT "FK_e6cf45f179a524427ddf8bacd8e" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_members" ADD CONSTRAINT "FK_b2d15baf5b46ed9659bd71fbb43" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_members" DROP CONSTRAINT "FK_b2d15baf5b46ed9659bd71fbb43"`);
        await queryRunner.query(`ALTER TABLE "room_members" DROP CONSTRAINT "FK_e6cf45f179a524427ddf8bacd8e"`);
        await queryRunner.query(`ALTER TABLE "acheivment" DROP CONSTRAINT "FK_1fea3bff8770866269327349879"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_534fe1b4be4a16b996ba7d78e76"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_3b85329cbe5b9f9002f05018faf"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_7b7f91302f66ab534423c96aa34"`);
        await queryRunner.query(`ALTER TABLE "blocked" DROP CONSTRAINT "FK_9915ed07f5fd996ed58472e07f9"`);
        await queryRunner.query(`ALTER TABLE "blocked" DROP CONSTRAINT "FK_e0508d0e15d3f496a3275e4a49e"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_bfc12f3db20b93759b75dc72956"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_7aa51528da61b3e40a78710007e"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_2817a2e8392862025abc84a325f"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_ec4051856bf02cb91f4c6358df6"`);
        await queryRunner.query(`ALTER TABLE "notif" DROP CONSTRAINT "FK_f6afc21c3c925205fad542cc942"`);
        await queryRunner.query(`ALTER TABLE "notif" DROP CONSTRAINT "FK_156e313817145106b0a7cd4d23f"`);
        await queryRunner.query(`ALTER TABLE "notif" DROP CONSTRAINT "FK_002fd04d260b40d4ac4f277b9ca"`);
        await queryRunner.query(`ALTER TABLE "room_member" DROP CONSTRAINT "FK_6940db8d5a7d65b077ccfacf95d"`);
        await queryRunner.query(`ALTER TABLE "room_member" DROP CONSTRAINT "FK_6eb91357acd7efbd4f65d2375e1"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2d15baf5b46ed9659bd71fbb4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e6cf45f179a524427ddf8bacd8"`);
        await queryRunner.query(`DROP TABLE "room_members"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "acheivment"`);
        await queryRunner.query(`DROP TYPE "public"."acheivment_name_enum"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "blocked"`);
        await queryRunner.query(`DROP TABLE "friends"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TYPE "public"."room_type_enum"`);
        await queryRunner.query(`DROP TABLE "notif"`);
        await queryRunner.query(`DROP TYPE "public"."notif_type_enum"`);
        await queryRunner.query(`DROP TABLE "room_member"`);
        await queryRunner.query(`DROP TYPE "public"."room_member_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."room_member_role_enum"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
