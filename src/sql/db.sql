-- users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_confirmed_phone BOOLEAN DEFAULT false,
    is_confirmed_email BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- users trigger updated_at
CREATE FUNCTION update_timestamp() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- users index
CREATE INDEX idx_users_login ON users (login);

-- delete all for users
-- DROP TRIGGER IF EXISTS trigger_update_timestamp ON users;
-- DROP FUNCTION IF EXISTS update_timestamp;
-- DROP INDEX IF EXISTS idx_users_login;
-- DROP TABLE IF EXISTS users CASCADE;



-- files
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT CHECK (file_type IN ('jpg', 'png', 'mp4', 'mov', 'avi')),  
    file_size BIGINT NOT NULL,       
    file_url TEXT NOT NULL UNIQUE,      
    width INT,                     
    height INT,                         
    duration INT, 
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- files trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON files
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- delete all for files
-- DROP TRIGGER IF EXISTS trigger_update_updated_at ON files;
-- DROP FUNCTION IF EXISTS update_updated_at_column;
-- DROP INDEX IF EXISTS idx_files_file_url;
-- DROP INDEX IF EXISTS idx_files_user_id;
-- DROP TABLE IF EXISTS files CASCADE;


-- verification_codes
CREATE TABLE verification_codes (
    id SERIAL PRIMARY KEY,
    user_login VARCHAR(50) NOT NULL REFERENCES users(login) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('phone', 'email')),
    value VARCHAR(100) NOT NULL,
    code VARCHAR(4) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);