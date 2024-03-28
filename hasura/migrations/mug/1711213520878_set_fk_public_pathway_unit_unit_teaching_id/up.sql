alter table "public"."pathway_unit"
  add constraint "pathway_unit_unit_teaching_id_fkey"
  foreign key ("unit_teaching_id")
  references "public"."teaching_unit"
  ("id") on update cascade on delete cascade;
