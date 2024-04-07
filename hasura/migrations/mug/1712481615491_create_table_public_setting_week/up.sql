CREATE TABLE "public"."setting_week" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "monday_start" date, "monday_end" date, "tuesday_start" date, "tuesday_end" date, "wednesday_start" date, "wednesday_end" date, "thursday_start" date, "thursday_end" date, "friday_start" date, "friday_end" date, "saturday_start" date, "saturday_end" date, "sunday_start" date, "sunday_end" date, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_setting_week_updated_at"
BEFORE UPDATE ON "public"."setting_week"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_setting_week_updated_at" ON "public"."setting_week"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
