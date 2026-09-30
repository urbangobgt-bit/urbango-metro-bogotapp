-- =========================================================================
-- UrbanGo Metro de Bogotá - Esquema de Base de Datos y Políticas RLS
-- Ejecutar en Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. Crear tabla 'profiles' si no existe
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  name TEXT,
  avatar_url TEXT,
  avatar TEXT DEFAULT '👤',
  saldo NUMERIC DEFAULT 24500,
  estaciones_favoritas JSONB DEFAULT '["Patio Taller Bosa", "Calle 72", "Av. Primero de Mayo"]'::jsonb,
  configuracion JSONB DEFAULT '{"dark": false, "large_text": false, "high_contrast": false, "traffic_notifs": true, "language": "es"}'::jsonb,
  localidad TEXT DEFAULT 'Bogotá D.C.',
  transporte TEXT DEFAULT 'Metro / SITP',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asegurar columnas si la tabla ya existía previamente
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '👤';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS saldo NUMERIC DEFAULT 24500;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS estaciones_favoritas JSONB DEFAULT '["Patio Taller Bosa", "Calle 72", "Av. Primero de Mayo"]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS configuracion JSONB DEFAULT '{"dark": false, "large_text": false, "high_contrast": false, "traffic_notifs": true, "language": "es"}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS localidad TEXT DEFAULT 'Bogotá D.C.';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transporte TEXT DEFAULT 'Metro / SITP';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Habilitar RLS en 'profiles'
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tabla 'profiles'
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Crear Bucket de Storage 'avatars' para fotos de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Habilitar RLS en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para storage en bucket 'avatars'
DROP POLICY IF EXISTS "Acceso público de lectura a avatares" ON storage.objects;
CREATE POLICY "Acceso público de lectura a avatares"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir su avatar" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir su avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Usuarios pueden actualizar y reemplazar su avatar" ON storage.objects;
CREATE POLICY "Usuarios pueden actualizar y reemplazar su avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Usuarios pueden eliminar su avatar" ON storage.objects;
CREATE POLICY "Usuarios pueden eliminar su avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Trigger para crear automáticamente el perfil al registrar usuario en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    name, 
    avatar_url, 
    avatar, 
    saldo,
    created_at, 
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'avatar_url', '👤'),
    24500,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
