CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar" varchar(255),
	"credits" integer DEFAULT 0,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wireframeToCode" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wireframeToCode_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" varchar(255) NOT NULL,
	"imageUrl" varchar,
	"aiModel" varchar,
	"description" varchar,
	"code" json,
	"createdBy" varchar,
	CONSTRAINT "wireframeToCode_uid_unique" UNIQUE("uid")
);
