
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    reset_password_token VARCHAR(255),
    reset_password_expiry BIGINT,
    last_login_at TIMESTAMP,
    inactivity_warning_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE portfolios (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    title VARCHAR(255),
    bio TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);


CREATE TABLE projects (
    id BIGINT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies VARCHAR(500),
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    image_url VARCHAR(500),
    created_at TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);


CREATE TABLE experiences (
    id BIGINT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);


CREATE TABLE education (
    id BIGINT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    diploma VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);


CREATE TABLE certifications (
    id BIGINT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    date DATE,
    description TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);


CREATE TABLE media (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    linkedin VARCHAR(500),
    github VARCHAR(500),
    twitter VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);


CREATE TABLE websites (
    id BIGSERIAL PRIMARY KEY,
    media_id BIGINT NOT NULL,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);


CREATE TABLE links (
    id BIGSERIAL PRIMARY KEY,
    media_id BIGINT NOT NULL,
    url VARCHAR(500) NOT NULL,
    label VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);


CREATE TABLE activities (
    id BIGINT PRIMARY KEY,
    portfolio_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    name VARCHAR(255),
    timestamp BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_login_at ON users(last_login_at);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_skills_portfolio_id ON skills(portfolio_id);
CREATE INDEX idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX idx_experiences_portfolio_id ON experiences(portfolio_id);
CREATE INDEX idx_education_portfolio_id ON education(portfolio_id);
CREATE INDEX idx_certifications_portfolio_id ON certifications(portfolio_id);
CREATE INDEX idx_media_portfolio_id ON media(portfolio_id);
CREATE INDEX idx_activities_portfolio_id ON activities(portfolio_id);
