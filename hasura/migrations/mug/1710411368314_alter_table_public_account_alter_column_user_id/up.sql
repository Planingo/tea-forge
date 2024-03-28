alter table "public"."account" alter column "user_id" drop not null;
alter table "public"."account" add constraint "account_user_id_key" unique ("user_id");
