alter table "public"."account" drop constraint "account_user_id_key";
alter table "public"."account" alter column "user_id" set not null;
