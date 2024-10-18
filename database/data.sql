-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

INSERT INTO "menuItems" ("name", "description", "price", "imageUrl", "createdAt")
VALUES
  ('Chicken Teriyaki', 'Grilled chicken served with steamed vegetables and rice.', 12.99, '/images/chicken-teriyaki.jpeg', NOW()),
  ('Beef Yakitori', 'Skewered beef grilled to perfection, served with dipping sauce.', 14.99, '/images/beef-yakitori.jpeg', NOW()),
  ('Shrimp Tempura', 'Deep fried shrimp in a crispy tempura batter, served with dipping sauce.', 15.99, '/images/shrimp-tempura.jpeg', NOW()),
  ('Vegetable Stir Fry', 'Fresh vegetables stir-fried with a savory sauce, served with rice.', 10.99, '/images/vegetable-stir-fry.jpeg', NOW()),
  ('Salmon Sashimi', 'Thinly sliced fresh salmon, served with soy sauce and wasabi.', 18.99, '/images/salmon-sashimi.jpeg', NOW());

INSERT INTO "users" ("userId", "username", "hashedPassword")
VALUES
(1, 'Bryant', 'potato')
