-- Insert categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Jeux Vidéo', 'jeux-video', 'Clés de jeux vidéo pour toutes les plateformes', '/placeholder.svg?height=300&width=400'),
('22222222-2222-2222-2222-222222222222', 'Cartes Cadeaux', 'cartes-cadeaux', 'Cartes cadeaux pour vos services préférés', '/placeholder.svg?height=300&width=400'),
('33333333-3333-3333-3333-333333333333', 'Recharges Mobile', 'recharges-mobile', 'Recharges pour opérateurs gabonais', '/placeholder.svg?height=300&width=400'),
('44444444-4444-4444-4444-444444444444', 'Accessoires Gaming', 'accessoires-gaming', 'Accessoires pour gamers', '/placeholder.svg?height=300&width=400');

-- Insert products
INSERT INTO products (id, category_id, name, slug, description, price, stock, platform, region, type, image_url, is_featured) VALUES
-- Video Games
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'EA SPORTS FC 25', 'ea-sports-fc-25', 'Le nouveau jeu de football d''EA Sports avec des graphismes améliorés et de nouveaux modes de jeu.', 45000, 50, 'PC', 'Global', 'digital', '/placeholder.svg?height=400&width=600', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Call of Duty: Modern Warfare III', 'cod-mw3', 'Le dernier opus de la franchise Call of Duty avec un mode multijoueur intense.', 50000, 30, 'PC', 'Global', 'digital', '/placeholder.svg?height=400&width=600', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Grand Theft Auto V', 'gta-v', 'Le jeu d''action en monde ouvert le plus populaire de Rockstar Games.', 25000, 100, 'PC', 'Global', 'digital', '/placeholder.svg?height=400&width=600', false),
-- Gift Cards
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'PlayStation Store 10€', 'playstation-10', 'Carte cadeau PlayStation Store de 10€ pour acheter des jeux et du contenu.', 6500, 200, 'PlayStation', 'Europe', 'digital', '/placeholder.svg?height=400&width=600', true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'Xbox Gift Card 25€', 'xbox-25', 'Carte cadeau Xbox de 25€ pour le Microsoft Store.', 16000, 150, 'Xbox', 'Global', 'digital', '/placeholder.svg?height=400&width=600', false),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Steam Wallet 20€', 'steam-20', 'Code Steam Wallet de 20€ pour votre compte Steam.', 13000, 300, 'PC', 'Global', 'digital', '/placeholder.svg?height=400&width=600', true),
-- Mobile Recharge
('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'Airtel Gabon 5000 FCFA', 'airtel-5000', 'Recharge mobile Airtel Gabon de 5000 FCFA.', 5000, 500, 'Airtel', 'Gabon', 'digital', '/placeholder.svg?height=400&width=600', false),
('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'Moov Gabon 10000 FCFA', 'moov-10000', 'Recharge mobile Moov Gabon de 10000 FCFA.', 10000, 500, 'Moov', 'Gabon', 'digital', '/placeholder.svg?height=400&width=600', false);
