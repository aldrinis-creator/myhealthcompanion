
-- Create face-scans storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('face-scans', 'face-scans', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload face scans"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'face-scans' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to view their own uploads
CREATE POLICY "Users can view own face scans"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'face-scans' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own face scans"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'face-scans' AND (storage.foldername(name))[1] = auth.uid()::text);
