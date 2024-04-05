alter table "public"."calendar_pathway"
  add constraint "calendar_pathway_calendar_id_fkey"
  foreign key ("calendar_id")
  references "public"."calendar"
  ("id") on update cascade on delete cascade;
