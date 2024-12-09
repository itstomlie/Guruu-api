CREATE TYPE post_visibility AS ENUM ('public', 'private');

CREATE TYPE post_status AS ENUM (
    'waiting-for-approval',
    'approved',
    'rejected',
    'draft',
    'posted',
    'banned'
);

CREATE TYPE user_role AS ENUM (
    'super_admin',
    'moderator',
    'user'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  profile_picture_url TEXT,
  bio TEXT,
  role user_role NOT NULL DEFAULT 'user',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  CONSTRAINT fk_role CHECK (role IN ('super_admin', 'moderator', 'user'))
);


CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    video_url TEXT UNIQUE NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    caption TEXT,
    visibility post_visibility NOT NULL DEFAULT 'public',
    status post_status NOT NULL DEFAULT 'posted',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    
    -- Foreign key constraint
    CONSTRAINT fk_posts_users
        FOREIGN KEY(user_id) 
            REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);


CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE question_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(), 
    updated_at TIMESTAMP
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Using UUIDs for the primary key
    quiz_id uuid NOT NULL, -- Foreign key referencing the quizzes table
    category_id uuid NOT NULL, -- Foreign key referencing the question_categories table
    title TEXT NOT NULL, -- The actual question text
    created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the question is created
    updated_at TIMESTAMP DEFAULT NULL, -- Optional timestamp for when the question is updated
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE, -- Define foreign key relationship to quizzes
    FOREIGN KEY (category_id) REFERENCES question_categories(id) ON DELETE CASCADE -- Define foreign key relationship to question_categories
);

CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Using UUIDs for the primary key
    question_id uuid NOT NULL, -- Foreign key referencing the questions table
    option TEXT NOT NULL, -- The option text
    created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the option is created
    updated_at TIMESTAMP DEFAULT NULL, -- Optional timestamp for when the option is updated
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE -- Define foreign key relationship to questions
);

CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Using UUIDs for the primary key
    question_id uuid NOT NULL, -- Foreign key referencing the questions table
    answer TEXT NOT NULL, -- The answer text
    created_at TIMESTAMP DEFAULT NOW(), -- Timestamp for when the answer is created
    updated_at TIMESTAMP DEFAULT NULL, -- Optional timestamp for when the answer is updated
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE -- Define foreign key relationship to questions
);

CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level INT DEFAULT 1,
  title VARCHAR(100),
  health INT DEFAULT 5,
  max_health INT DEFAULT 5,
  experience INT DEFAULT 0,
  max_experience INT DEFAULT 25,
  coins INT DEFAULT 0,
  gems INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE waitlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  message TEXT,
  creator BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid NOT NULL, 
  tag_id uuid NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

INSERT INTO
  question_categories (
    id,
    TYPE,
    created_at,
    updated_at
  )
VALUES
  (DEFAULT, 'multiple-choice', NOW(), NULL),
  (DEFAULT, 'true-false', NOW(), NULL);