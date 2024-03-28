alter table "public"."account"
  add constraint "account_roles_id_fkey"
  foreign key (roles_id)
  references "public"."role"
  (id) on update cascade on delete cascade;
alter table "public"."account" alter column "roles_id" drop not null;
alter table "public"."account" add column "roles_id" uuid;
