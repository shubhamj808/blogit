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
