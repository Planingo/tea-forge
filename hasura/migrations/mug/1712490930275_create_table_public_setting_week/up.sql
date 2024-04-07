CREATE TABLE "public"."setting_week" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "setting_id" uuid NOT NULL, "week_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("setting_id") REFERENCES "public"."setting"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("week_id") REFERENCES "public"."week"("id") ON UPDATE cascade ON DELETE cascade);
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
