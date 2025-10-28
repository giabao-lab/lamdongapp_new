-- Add missing notes column to orders table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'notes'
    ) THEN
        ALTER TABLE orders ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Verify the orders table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;