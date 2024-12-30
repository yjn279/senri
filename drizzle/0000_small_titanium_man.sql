CREATE TABLE "daily_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"life_goal_id" uuid,
	"yearly_goal_id" uuid,
	"monthly_goal_id" uuid,
	"day" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"created" timestamp DEFAULT now(),
	"updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "life_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monthly_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"life_goal_id" uuid,
	"yearly_goal_id" uuid,
	"month" integer NOT NULL,
	"title" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yearly_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"life_goal_id" uuid,
	"year" integer NOT NULL,
	"title" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"updated" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "daily_goals" ADD CONSTRAINT "daily_goals_life_goal_id_life_goals_id_fk" FOREIGN KEY ("life_goal_id") REFERENCES "public"."life_goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_goals" ADD CONSTRAINT "daily_goals_yearly_goal_id_yearly_goals_id_fk" FOREIGN KEY ("yearly_goal_id") REFERENCES "public"."yearly_goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_goals" ADD CONSTRAINT "daily_goals_monthly_goal_id_monthly_goals_id_fk" FOREIGN KEY ("monthly_goal_id") REFERENCES "public"."monthly_goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_goals" ADD CONSTRAINT "monthly_goals_life_goal_id_life_goals_id_fk" FOREIGN KEY ("life_goal_id") REFERENCES "public"."life_goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_goals" ADD CONSTRAINT "monthly_goals_yearly_goal_id_yearly_goals_id_fk" FOREIGN KEY ("yearly_goal_id") REFERENCES "public"."yearly_goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yearly_goals" ADD CONSTRAINT "yearly_goals_life_goal_id_life_goals_id_fk" FOREIGN KEY ("life_goal_id") REFERENCES "public"."life_goals"("id") ON DELETE no action ON UPDATE no action;