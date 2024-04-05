alter table "public"."calendar_pathway_lesson"
  add constraint "calendar_pathway_lesson_pathway_id_fkey"
  foreign key ("pathway_id")
  references "public"."pathway"
  ("id") on update cascade on delete cascade;
