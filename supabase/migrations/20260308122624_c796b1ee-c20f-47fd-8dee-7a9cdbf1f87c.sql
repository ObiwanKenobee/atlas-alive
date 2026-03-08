
-- ===== ENUM TYPES =====
CREATE TYPE public.app_role AS ENUM ('executive', 'operator', 'investor', 'government', 'admin');
CREATE TYPE public.trend_direction AS ENUM ('accelerating', 'stable', 'stalling', 'reversing');
CREATE TYPE public.data_availability AS ENUM ('available', 'estimated', 'unavailable', 'under_review');
CREATE TYPE public.confidence_level AS ENUM ('satellite', 'field', 'community', 'model', 'audited');
CREATE TYPE public.project_status AS ENUM ('active', 'watch', 'critical');
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high');

-- ===== PROFILES TABLE =====
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  organisation TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ===== USER ROLES TABLE =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
);

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get primary role
CREATE OR REPLACE FUNCTION public.get_primary_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'admin' THEN 1
    WHEN 'operator' THEN 2
    WHEN 'investor' THEN 3
    WHEN 'executive' THEN 4
    WHEN 'government' THEN 5
    ELSE 6
  END
  LIMIT 1
$$;

-- ===== PROJECTS TABLE =====
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  type TEXT NOT NULL,
  baseline TEXT NOT NULL,
  current_state TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  value_estimate TEXT,
  trend trend_direction NOT NULL DEFAULT 'stable',
  risk_level risk_level NOT NULL DEFAULT 'medium',
  last_verified TIMESTAMP WITH TIME ZONE,
  status project_status NOT NULL DEFAULT 'active',
  operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  district TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are publicly readable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Operators can insert their projects" ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = operator_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Operators can update their projects" ON public.projects FOR UPDATE
  USING (auth.uid() = operator_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ===== IMPACT METRICS TABLE =====
CREATE TABLE public.impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  source_type confidence_level NOT NULL DEFAULT 'model',
  availability data_availability NOT NULL DEFAULT 'available',
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Impact metrics are publicly readable" ON public.impact_metrics FOR SELECT USING (true);
CREATE POLICY "Operators can insert metrics for their projects" ON public.impact_metrics FOR INSERT
  WITH CHECK (
    auth.uid() = submitted_by OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.operator_id = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Operators can update their own metrics" ON public.impact_metrics FOR UPDATE
  USING (
    auth.uid() = submitted_by OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.operator_id = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  );

-- ===== TIME SERIES TABLE =====
CREATE TABLE public.time_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  period TEXT NOT NULL,
  period_date DATE NOT NULL,
  actual NUMERIC,
  target NUMERIC,
  forecast NUMERIC,
  lower_bound NUMERIC,
  upper_bound NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.time_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Time series are publicly readable" ON public.time_series FOR SELECT USING (true);
CREATE POLICY "Operators can insert time series" ON public.time_series FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.operator_id = auth.uid()) OR
    public.has_role(auth.uid(), 'admin') OR
    project_id IS NULL
  );

-- ===== VERIFICATION RECORDS TABLE =====
CREATE TABLE public.verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  verification_type confidence_level NOT NULL,
  verifier_name TEXT,
  methodology_version TEXT,
  coverage NUMERIC(3,2),
  last_verified_at TIMESTAMP WITH TIME ZONE,
  next_review_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  evidence_urls TEXT[],
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.verification_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verification records are publicly readable" ON public.verification_records FOR SELECT USING (true);
CREATE POLICY "Operators can submit verification records" ON public.verification_records FOR INSERT
  WITH CHECK (
    auth.uid() = submitted_by OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.operator_id = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Operators can update their verification records" ON public.verification_records FOR UPDATE
  USING (
    auth.uid() = submitted_by OR
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.operator_id = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  );

-- ===== AUTO-PROFILE CREATION TRIGGER =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'operator')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== UPDATED_AT TRIGGERS =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_impact_metrics_updated_at
  BEFORE UPDATE ON public.impact_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_verification_records_updated_at
  BEFORE UPDATE ON public.verification_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== INDEXES =====
CREATE INDEX idx_projects_operator ON public.projects(operator_id);
CREATE INDEX idx_projects_region ON public.projects(region);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_impact_metrics_project ON public.impact_metrics(project_id);
CREATE INDEX idx_impact_metrics_type ON public.impact_metrics(metric_type);
CREATE INDEX idx_time_series_project ON public.time_series(project_id);
CREATE INDEX idx_time_series_metric ON public.time_series(metric_type);
CREATE INDEX idx_time_series_date ON public.time_series(period_date);
CREATE INDEX idx_verification_records_project ON public.verification_records(project_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
