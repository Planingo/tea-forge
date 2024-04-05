CREATE TABLE "public"."student_calendar" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "archived" boolean NOT NULL DEFAULT false, "student_id" uuid NOT NULL, "calendar_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("calendar_id") REFERENCES "public"."calendar"("id") ON UPDATE cascade ON DELETE cascade);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_student_calendar_updated_at"
BEFORE UPDATE ON "public"."student_calendar"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_student_calendar_updated_at" ON "public"."student_calendar"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
