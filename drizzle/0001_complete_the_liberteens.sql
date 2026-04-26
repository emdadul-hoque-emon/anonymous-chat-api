CREATE TABLE "rooms" (
	"name" varchar(24) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" uuid NOT NULL,
	CONSTRAINT "rooms_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;