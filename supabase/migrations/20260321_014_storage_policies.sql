begin;

alter table storage.objects enable row level security;

drop policy if exists game_assets_select_owned_objects on storage.objects;
create policy game_assets_select_owned_objects
on storage.objects
for select
to authenticated
using (
  bucket_id = 'game-assets'
  and (
    app_private.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
);

drop policy if exists game_assets_insert_owned_objects on storage.objects;
create policy game_assets_insert_owned_objects
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'game-assets'
  and split_part(name, '/', 2) = auth.uid()::text
);

drop policy if exists game_assets_update_owned_objects on storage.objects;
create policy game_assets_update_owned_objects
on storage.objects
for update
to authenticated
using (
  bucket_id = 'game-assets'
  and (
    app_private.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
)
with check (
  bucket_id = 'game-assets'
  and (
    app_private.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
);

drop policy if exists game_assets_delete_owned_objects on storage.objects;
create policy game_assets_delete_owned_objects
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'game-assets'
  and (
    app_private.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
);

commit;
