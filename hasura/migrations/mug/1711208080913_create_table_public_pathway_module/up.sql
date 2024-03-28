CREATE TABLE "public"."pathway_module" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "module_id" uuid NOT NULL, "pathway_id" uuid NOT NULL, "archived" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("module_id") REFERENCES "public"."module"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("pathway_id") REFERENCES "public"."pathway"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_pathway_module_updated_at"
BEFORE UPDATE ON "public"."pathway_module"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_pathway_module_updated_at" ON "public"."pathway_module"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
