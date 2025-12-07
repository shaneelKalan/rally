-- RSVP Platform Database Schema
-- Migration 001: Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (hosts)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wedding', 'trip', 'party', 'corporate', 'other')),
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location_summary TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_slug ON events(slug);

-- Event themes table
CREATE TABLE event_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#666666',
  background_style TEXT DEFAULT 'light' CHECK (background_style IN ('light', 'dark', 'photo', 'minimal')),
  font_style TEXT DEFAULT 'sans' CHECK (font_style IN ('serif', 'sans', 'mixed')),
  logo_url TEXT,
  hero_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id)
);

CREATE INDEX idx_event_themes_event_id ON event_themes(event_id);

-- Guest groups table
CREATE TABLE guest_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guest_groups_event_id ON guest_groups(event_id);

-- Households table
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  access_code TEXT UNIQUE NOT NULL,
  rsvp_token TEXT UNIQUE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_households_event_id ON households(event_id);
CREATE INDEX idx_households_access_code ON households(access_code);
CREATE INDEX idx_households_rsvp_token ON households(rsvp_token);

-- Guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  guest_group_id UUID REFERENCES guest_groups(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'primary' CHECK (role IN ('primary', 'plus_one', 'child', 'other')),
  side TEXT CHECK (side IN ('partner_a', 'partner_b', 'joint', 'other')),
  is_primary_contact BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_household_id ON guests(household_id);
CREATE INDEX idx_guests_guest_group_id ON guests(guest_group_id);

-- Event sessions table
CREATE TABLE event_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  location_name TEXT,
  location_address TEXT,
  dress_code TEXT,
  is_required BOOLEAN DEFAULT false,
  visibility_rules JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_sessions_event_id ON event_sessions(event_id);
CREATE INDEX idx_event_sessions_start_datetime ON event_sessions(start_datetime);

-- Session invitations table
CREATE TABLE session_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_session_id UUID NOT NULL REFERENCES event_sessions(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_session_id, guest_id)
);

CREATE INDEX idx_session_invitations_session_id ON session_invitations(event_session_id);
CREATE INDEX idx_session_invitations_guest_id ON session_invitations(guest_id);

-- RSVPs table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_session_id UUID NOT NULL REFERENCES event_sessions(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'no_response' CHECK (status IN ('attending', 'not_attending', 'maybe', 'no_response')),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_session_id, guest_id)
);

CREATE INDEX idx_rsvps_session_id ON rsvps(event_session_id);
CREATE INDEX idx_rsvps_guest_id ON rsvps(guest_id);
CREATE INDEX idx_rsvps_status ON rsvps(status);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  event_session_id UUID REFERENCES event_sessions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('single_choice', 'multi_choice', 'text', 'number', 'boolean')),
  is_required BOOLEAN DEFAULT false,
  options JSONB,
  visibility_condition JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_event_id ON questions(event_id);
CREATE INDEX idx_questions_session_id ON questions(event_session_id);

-- Responses table
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  event_session_id UUID REFERENCES event_sessions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_responses_question_id ON responses(question_id);
CREATE INDEX idx_responses_guest_id ON responses(guest_id);
CREATE INDEX idx_responses_session_id ON responses(event_session_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- Event themes policies
CREATE POLICY "Users can view themes for own events" ON event_themes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_themes.event_id AND events.user_id = auth.uid())
  );

CREATE POLICY "Users can manage themes for own events" ON event_themes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_themes.event_id AND events.user_id = auth.uid())
  );

-- Guest groups policies
CREATE POLICY "Users can manage guest groups for own events" ON guest_groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = guest_groups.event_id AND events.user_id = auth.uid())
  );

-- Households policies
CREATE POLICY "Users can manage households for own events" ON households
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = households.event_id AND events.user_id = auth.uid())
  );

-- Public access for RSVP via token
CREATE POLICY "Public can view household by token" ON households
  FOR SELECT USING (true);

-- Guests policies
CREATE POLICY "Users can manage guests for own events" ON guests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid())
  );

CREATE POLICY "Public can view guests by household token" ON guests
  FOR SELECT USING (true);

-- Event sessions policies
CREATE POLICY "Users can manage sessions for own events" ON event_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_sessions.event_id AND events.user_id = auth.uid())
  );

CREATE POLICY "Public can view sessions" ON event_sessions
  FOR SELECT USING (true);

-- Session invitations policies
CREATE POLICY "Users can manage invitations for own events" ON session_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM event_sessions es
      JOIN events e ON e.id = es.event_id
      WHERE es.id = session_invitations.event_session_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view invitations" ON session_invitations
  FOR SELECT USING (true);

-- RSVPs policies
CREATE POLICY "Users can view RSVPs for own events" ON rsvps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM event_sessions es
      JOIN events e ON e.id = es.event_id
      WHERE es.id = rsvps.event_session_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can create/update RSVPs" ON rsvps
  FOR ALL USING (true);

-- Questions policies
CREATE POLICY "Users can manage questions for own events" ON questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = questions.event_id AND events.user_id = auth.uid())
  );

CREATE POLICY "Public can view questions" ON questions
  FOR SELECT USING (true);

-- Responses policies
CREATE POLICY "Users can view responses for own events" ON responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM questions q
      JOIN events e ON e.id = q.event_id
      WHERE q.id = responses.question_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can create/update responses" ON responses
  FOR ALL USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_themes_updated_at BEFORE UPDATE ON event_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guest_groups_updated_at BEFORE UPDATE ON guest_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON households
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_sessions_updated_at BEFORE UPDATE ON event_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON rsvps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
