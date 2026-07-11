-- ============================================
-- MyTrackify — V1 Schema Migration
-- Reference file for PostgreSQL production setup
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Students table
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college_id VARCHAR(50) NOT NULL,
    graduation_year INTEGER NOT NULL,
    branch VARCHAR(100) NOT NULL,
    cgpa_range VARCHAR(20),
    anonymized_id VARCHAR(50) UNIQUE NOT NULL,
    leetcode_count INTEGER DEFAULT 0,
    leetcode_easy INTEGER DEFAULT 0,
    leetcode_medium INTEGER DEFAULT 0,
    leetcode_hard INTEGER DEFAULT 0,
    contest_rating INTEGER,
    skill_vector NUMERIC[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'STUDENT',
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT valid_graduation_year CHECK (graduation_year BETWEEN 2020 AND 2030)
);

CREATE INDEX idx_students_graduation_year ON students(graduation_year);
CREATE INDEX idx_students_anonymized_id ON students(anonymized_id);
CREATE INDEX idx_students_email ON students(email);

-- Companies table
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    sector VARCHAR(100),
    headquarters_location VARCHAR(255),
    website VARCHAR(500),
    visit_frequency VARCHAR(50),
    typical_roles TEXT[],
    avg_ctc_range VARCHAR(50),
    total_applications INTEGER DEFAULT 0,
    total_offers INTEGER DEFAULT 0,
    avg_success_rate NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_sector ON companies(sector);

-- Interview Processes table
CREATE TABLE interview_processes (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    semester VARCHAR(20),
    rounds JSONB NOT NULL,
    verified_count INTEGER DEFAULT 0,
    last_verified_at TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_company_year_semester UNIQUE(company_id, academic_year, semester)
);

CREATE INDEX idx_processes_company ON interview_processes(company_id);
CREATE INDEX idx_processes_year ON interview_processes(academic_year);

-- Application Journeys table
CREATE TABLE application_journeys (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    process_id BIGINT REFERENCES interview_processes(id),
    application_type VARCHAR(50),
    application_date DATE NOT NULL,
    final_outcome VARCHAR(50) NOT NULL,
    final_round_reached INTEGER,
    compensation_offered NUMERIC(10,2),
    role_offered VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_outcome CHECK (final_outcome IN ('Selected', 'Rejected', 'In Progress', 'Withdrew'))
);

CREATE INDEX idx_journeys_student ON application_journeys(student_id);
CREATE INDEX idx_journeys_process ON application_journeys(process_id);
CREATE INDEX idx_journeys_outcome ON application_journeys(final_outcome);

-- Round Attempts table
CREATE TABLE round_attempts (
    id BIGSERIAL PRIMARY KEY,
    journey_id BIGINT REFERENCES application_journeys(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    round_type VARCHAR(100),
    outcome VARCHAR(50) NOT NULL,
    difficulty_perceived INTEGER,
    attempted_at TIMESTAMP,
    result_received_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_difficulty CHECK (difficulty_perceived BETWEEN 1 AND 5),
    CONSTRAINT valid_round_outcome CHECK (outcome IN ('Passed', 'Failed', 'Pending'))
);

CREATE INDEX idx_attempts_journey ON round_attempts(journey_id);

-- Interview Experiences table
CREATE TABLE interview_experiences (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT REFERENCES round_attempts(id) ON DELETE CASCADE,
    questions_asked TEXT NOT NULL,
    topics TEXT[],
    interviewer_focus TEXT,
    preparation_tips TEXT,
    difficulty_rating INTEGER,
    helpful_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_exp_difficulty CHECK (difficulty_rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_experiences_attempt ON interview_experiences(attempt_id);
CREATE INDEX idx_experiences_topics ON interview_experiences USING gin(topics);
