
-- ==========================================
-- Jogadores de demonstração
-- ==========================================

INSERT INTO players (email, password, created_at)
VALUES
    ('bruno@rushb.com', 'senha123', CURRENT_TIMESTAMP),
    ('bruce@rushb.com', 'senha123', CURRENT_TIMESTAMP),
    ('samuel@rushb.com', 'senha123', CURRENT_TIMESTAMP),
    ('gabriel@rushb.com', 'senha123', CURRENT_TIMESTAMP),
    ('luis@rushb.com', 'senha123', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;


-- ==========================================
-- Skins de demonstração
-- ==========================================
-- A associação dos jogadores é feita pelo e-mail.
-- IS NOT DISTINCT FROM também permite comparar
-- corretamente os valores NULL de player_id.

INSERT INTO skins (name, float_value, price, rarity, weapon, player_id)
SELECT
    seed.name,
    seed.float_value,
    seed.price,
    seed.rarity,
    seed.weapon,
    p.id
FROM (
    VALUES
        ('AK-47 | Redline', '0.15', 45.99, 'Classified', 'AK-47', 'bruno@rushb.com'),
        ('AWP | Dragon Lore', '0.03', 2500.00, 'Covert', 'AWP', 'bruno@rushb.com'),
        ('M4A4 | Howl', '0.07', 1800.00, 'Contraband', 'M4A4', 'bruno@rushb.com'),
        ('Glock-18 | Fade', '0.01', 350.00, 'Restricted', 'Glock-18', 'bruce@rushb.com'),
        ('Desert Eagle | Blaze', '0.008', 520.00, 'Restricted', 'Desert Eagle', 'bruce@rushb.com'),
        ('USP-S | Kill Confirmed', '0.12', 180.00, 'Covert', 'USP-S', NULL),
        ('Karambit | Doppler', '0.02', 950.00, 'Covert', 'Knife', NULL),
        ('M4A1-S | Hyper Beast', '0.18', 65.00, 'Covert', 'M4A1-S', NULL),
        ('AK-47 | Fire Serpent', '0.10', 850.00, 'Covert', 'AK-47', NULL),
        ('AWP | Asiimov', '0.25', 95.00, 'Covert', 'AWP', NULL),
        ('P90 | Asiimov', '0.20', 25.00, 'Covert', 'P90', NULL),
        ('Butterfly Knife | Fade', '0.01', 1250.00, 'Covert', 'Knife', NULL),
        ('Five-Seven | Case Hardened', '0.35', 45.00, 'Restricted', 'Five-Seven', NULL),
        ('MAC-10 | Neon Rider', '0.15', 18.00, 'Classified', 'MAC-10', NULL),
        ('SSG 08 | Blood in the Water', '0.08', 125.00, 'Classified', 'SSG 08', NULL)
) AS seed(name, float_value, price, rarity, weapon, player_email)
LEFT JOIN players p ON p.email = seed.player_email
WHERE NOT EXISTS (
    SELECT 1
    FROM skins s
    WHERE s.name = seed.name
      AND s.player_id IS NOT DISTINCT FROM p.id
);
