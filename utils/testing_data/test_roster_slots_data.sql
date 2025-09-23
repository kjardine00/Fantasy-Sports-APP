-- Test data for roster_slots table
-- Sample entry showing a roster slot with a player assigned

INSERT INTO roster_slots (league_id, user_id, player_id, slot_role, slot_number, locked) VALUES
-- Example: User's roster with different slot numbers to avoid unique constraint violation
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', '22d63830-0005-451e-8b57-75871fe42691', 'pitcher', 1, false),
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', '147557d0-89f9-4891-a416-0ee60287593c', 'batter', 2, false),
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', '42448919-19e2-4aee-a922-990b52f19c1b', 'batter', 3, false),
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', '79b7e393-13c8-4001-bcce-1b532bd85320', 'batter', 4, false),
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', '8ce62993-2a79-4550-b9c6-f275d8f2a055', 'batter', 5, false),
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', '215ade7a-2c56-4609-9f39-e15091ccd609', 'benched', 6, false),
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', 'd8dc0fd5-e25b-47a6-80b6-0247cccaff69', 'benched', 7, false),
('880e8400-e29b-41d4-a716-446655440001', '2f8e5809-ee99-4088-bff4-f975191350db', '22d63830-0005-451e-8b57-75871fe42691', 'benched', 8, false);