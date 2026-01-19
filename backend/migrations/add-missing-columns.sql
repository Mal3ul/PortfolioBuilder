-- Migration: Ajout des colonnes manquantes
-- Date: 2026-01-19

-- 1. Ajouter les colonnes manquantes dans projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS github_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS live_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- 2. Ajouter la colonne details dans activities
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS details TEXT;

-- Vérifier les résultats
SELECT 'Projects columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

SELECT 'Activities columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'activities' 
ORDER BY ordinal_position;
