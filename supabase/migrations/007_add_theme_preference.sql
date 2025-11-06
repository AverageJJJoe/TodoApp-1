-- Migration: Add theme_preference column to users table
-- Story: 7.7 - Pre-Launch - Dark Mode Support
-- Description: Adds theme_preference column to store user's theme preference (light, dark, or system)

-- Add theme_preference column with default 'system'
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS theme_preference VARCHAR(20) DEFAULT 'system' 
CHECK (theme_preference IN ('light', 'dark', 'system'));

-- Update existing users to have 'system' as default (if they don't have it set)
UPDATE users 
SET theme_preference = 'system' 
WHERE theme_preference IS NULL;

