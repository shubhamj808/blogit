-- Create databases for each microservice
CREATE DATABASE blogit_user_db;
CREATE DATABASE blogit_post_db;
CREATE DATABASE blogit_interaction_db;
CREATE DATABASE blogit_notification_db;
CREATE DATABASE blogit_media_db;
CREATE DATABASE blogit_feed_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE blogit_user_db TO blogit;
GRANT ALL PRIVILEGES ON DATABASE blogit_post_db TO blogit;
GRANT ALL PRIVILEGES ON DATABASE blogit_interaction_db TO blogit;
GRANT ALL PRIVILEGES ON DATABASE blogit_notification_db TO blogit;
GRANT ALL PRIVILEGES ON DATABASE blogit_media_db TO blogit;
GRANT ALL PRIVILEGES ON DATABASE blogit_feed_db TO blogit;

-- User Service Database
\c user_db;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_following (
    follower_id UUID NOT NULL REFERENCES users(id),
    following_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

-- Post Service Database
\c post_db;

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    is_draft BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Interaction Service Database
\c interaction_db;

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    target_id UUID NOT NULL,
    target_type VARCHAR(10) NOT NULL CHECK (target_type IN ('POST', 'COMMENT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
