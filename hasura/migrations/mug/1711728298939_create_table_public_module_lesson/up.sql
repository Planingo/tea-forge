CREATE TABLE "public"."module_lesson" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "archived" boolean NOT NULL DEFAULT false, "module_id" uuid NOT NULL, "lesson_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("module_id") REFERENCES "public"."module"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_module_lesson_updated_at"
BEFORE UPDATE ON "public"."module_lesson"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_module_lesson_updated_at" ON "public"."module_lesson"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
