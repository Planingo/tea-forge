alter table "public"."lesson"
  add constraint "lesson_module_id_fkey"
  foreign key (module_id)
  references "public"."module"
  (id) on update cascade on delete cascade;
alter table "public"."lesson" alter column "module_id" drop not null;
alter table "public"."lesson" add column "module_id" uuid;
