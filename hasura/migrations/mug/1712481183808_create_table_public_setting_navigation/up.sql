CREATE TABLE "public"."setting_navigation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "company" boolean NOT NULL DEFAULT true, "lesson" boolean NOT NULL DEFAULT true, "module" boolean NOT NULL DEFAULT true, "pathway" boolean NOT NULL DEFAULT true, "professor" boolean NOT NULL DEFAULT true, "room" boolean NOT NULL DEFAULT true, "student" boolean NOT NULL DEFAULT true, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_setting_navigation_updated_at"
BEFORE UPDATE ON "public"."setting_navigation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_setting_navigation_updated_at" ON "public"."setting_navigation"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
