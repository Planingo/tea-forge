CREATE TABLE "public"."sub_pathway" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "parent_pathway_id" uuid NOT NULL, "children_pathway_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("parent_pathway_id") REFERENCES "public"."pathway"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("children_pathway_id") REFERENCES "public"."pathway"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_sub_pathway_updated_at"
BEFORE UPDATE ON "public"."sub_pathway"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_sub_pathway_updated_at" ON "public"."sub_pathway"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
