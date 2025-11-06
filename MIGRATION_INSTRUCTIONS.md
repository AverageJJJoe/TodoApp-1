# Database Migration Instructions

## Migration: 007_add_theme_preference.sql

This migration adds the `theme_preference` column to the `users` table to support dark mode functionality.

### To Apply the Migration:

**Option 1: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/007_add_theme_preference.sql`
4. Paste and run the SQL in the SQL Editor
5. Click "Run" to execute

**Option 2: Using Supabase CLI**
```bash
# If you have Supabase CLI installed and linked to your project
supabase db push
```

**Option 3: Manual SQL Execution**
Run this SQL directly in your Supabase SQL Editor:

```sql
-- Add theme_preference column with default 'system'
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS theme_preference VARCHAR(20) DEFAULT 'system' 
CHECK (theme_preference IN ('light', 'dark', 'system'));

-- Update existing users to have 'system' as default (if they don't have it set)
UPDATE users 
SET theme_preference = 'system' 
WHERE theme_preference IS NULL;
```

### Verification

After running the migration, verify it worked by running:
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'theme_preference';
```

You should see the `theme_preference` column with default value 'system'.

