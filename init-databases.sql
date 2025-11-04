-- Create databases for each microservice
CREATE DATABASE blogit_user_db;
CREATE DATABASE blogit_post_db;
CREATE DATABASE blogit_interaction_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE blogit_user_db TO blogit;
GRANT ALL PRIVILEGES ON DATABASE blogit_post_db TO blogit;
GRANT ALL PRIVILEGES ON DATABASE blogit_interaction_db TO blogit;
