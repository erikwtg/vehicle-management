CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"placa" varchar(255) NOT NULL,
	"chassi" varchar(255) NOT NULL,
	"renavam" varchar(255) NOT NULL,
	"modelo" varchar(255) NOT NULL,
	"marca" varchar(255) NOT NULL,
	"ano" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "placa_idx" ON "vehicles" USING btree ("placa");