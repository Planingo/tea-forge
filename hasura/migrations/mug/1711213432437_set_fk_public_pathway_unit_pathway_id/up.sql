alter table "public"."pathway_unit" drop constraint "pathway_module_pathway_id_fkey",
  add constraint "pathway_unit_pathway_id_fkey"
  foreign key ("pathway_id")
  references "public"."pathway"
  ("id") on update cascade on delete cascade;
