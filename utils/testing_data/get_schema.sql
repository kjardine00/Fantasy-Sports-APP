-- Query to get current database schema as JSON
-- Run this in your Supabase SQL editor

SELECT jsonb_build_object(
  'tables', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'table_name', table_name,
        'columns', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'column_name', column_name,
              'data_type', data_type,
              'is_nullable', is_nullable,
              'column_default', column_default
            )
          )
          FROM information_schema.columns c2
          WHERE c2.table_name = t.table_name
          AND c2.table_schema = 'public'
        )
      )
    )
    FROM information_schema.tables t
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  )
);
