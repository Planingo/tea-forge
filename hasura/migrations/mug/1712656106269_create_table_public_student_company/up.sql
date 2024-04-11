CREATE TABLE "public"."student_company" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "student_id" uuid NOT NULL, "company_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_student_company_updated_at"
BEFORE UPDATE ON "public"."student_company"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_student_company_updated_at" ON "public"."student_company"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
