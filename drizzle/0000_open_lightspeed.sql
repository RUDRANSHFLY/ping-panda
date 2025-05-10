CREATE TYPE "public"."eventStatusEnum" AS ENUM('pending', 'delivered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."planEnum" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "eventCategory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" integer NOT NULL,
	"emoji" text NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formattedMessage" text NOT NULL,
	"fields" json NOT NULL,
	"deliveryStatus" "eventStatusEnum" DEFAULT 'pending' NOT NULL,
	"user" uuid NOT NULL,
	"eventCategory" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quota" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" uuid NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" text,
	"quotaLimit" integer,
	"name" text NOT NULL,
	"plan" "planEnum" DEFAULT 'free' NOT NULL,
	"email" text NOT NULL,
	"apiKey" uuid DEFAULT gen_random_uuid() NOT NULL,
	"discordId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_externalId_unique" UNIQUE("externalId"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_apiKey_unique" UNIQUE("apiKey")
);
--> statement-breakpoint
ALTER TABLE "eventCategory" ADD CONSTRAINT "eventCategory_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_eventCategory_eventCategory_id_fk" FOREIGN KEY ("eventCategory") REFERENCES "public"."eventCategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quota" ADD CONSTRAINT "quota_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "EventCategory_name_idx" ON "eventCategory" USING btree ("name");--> statement-breakpoint
CREATE INDEX "EventCategory_userId_idx" ON "eventCategory" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "EventCategory_name_userId_unique" ON "eventCategory" USING btree ("name","userId");--> statement-breakpoint
CREATE INDEX "Event_userId_idx" ON "event" USING btree ("user");--> statement-breakpoint
CREATE INDEX "Event_eventCategory_idx" ON "event" USING btree ("eventCategory");--> statement-breakpoint
CREATE INDEX "Event_createdAt_idx" ON "event" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "Quota_userId_idx" ON "quota" USING btree ("user");--> statement-breakpoint
CREATE INDEX "User_name_idx" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "User_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "User_apiKey_idx" ON "users" USING btree ("apiKey");