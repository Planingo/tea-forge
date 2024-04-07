CREATE TABLE "public"."setting_navigation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "setting_id" uuid NOT NULL, "navigation_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("setting_id") REFERENCES "public"."setting"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("navigation_id") REFERENCES "public"."navigation"("id") ON UPDATE cascade ON DELETE cascade);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_created_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."created_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_setting_navigation_created_at"
BEFORE UPDATE ON "public"."setting_navigation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_created_at"();
COMMENT ON TRIGGER "set_public_setting_navigation_created_at" ON "public"."setting_navigation"
IS 'trigger to set value of column "created_at" to current timestamp on row update';

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
