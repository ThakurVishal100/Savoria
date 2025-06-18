-- Create liked_items table
CREATE TABLE IF NOT EXISTS public.liked_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, menu_item_id)
);

-- Enable Row Level Security
ALTER TABLE public.liked_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own liked items"
    ON public.liked_items
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liked items"
    ON public.liked_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liked items"
    ON public.liked_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_liked_items_user_id ON public.liked_items(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_items_menu_item_id ON public.liked_items(menu_item_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; 