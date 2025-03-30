-- =====================================
-- DROP TABLES FIRST (ORDERED FOR FK CONSTRAINTS)
-- =====================================
DROP TABLE Competes_In CASCADE CONSTRAINTS;
DROP TABLE Funds CASCADE CONSTRAINTS;
DROP TABLE Upgrade CASCADE CONSTRAINTS;
DROP TABLE Project CASCADE CONSTRAINTS;
DROP TABLE Car CASCADE CONSTRAINTS;
DROP TABLE Motorcycle CASCADE CONSTRAINTS;
DROP TABLE Vehicle CASCADE CONSTRAINTS;
DROP TABLE Driver_Internal CASCADE CONSTRAINTS;
DROP TABLE Driver CASCADE CONSTRAINTS;
DROP TABLE Engineer_Assignment CASCADE CONSTRAINTS;
DROP TABLE Engineering_Team CASCADE CONSTRAINTS;
DROP TABLE Team CASCADE CONSTRAINTS;
DROP TABLE Team_Principal CASCADE CONSTRAINTS;
DROP TABLE Sponsor CASCADE CONSTRAINTS;
DROP TABLE Sponsor_Tier CASCADE CONSTRAINTS;
DROP TABLE Racing_Series CASCADE CONSTRAINTS;
DROP TABLE Racing CASCADE CONSTRAINTS;

-- =====================================
-- CREATE TABLES
-- =====================================

-- Team and Team Principal
CREATE TABLE Team_Principal (
    team_principal VARCHAR2(100) PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE
);

CREATE TABLE Team(
    team_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_principal VARCHAR2(100),
    year_founded NUMBER(4) CHECK (year_founded BETWEEN 1000 AND 9999),
    CONSTRAINT fk_team_principal FOREIGN KEY (team_principal)
        REFERENCES Team_Principal (team_principal)
        ON DELETE SET NULL
);

-- Sponsor and Sponsor_Tier
CREATE TABLE Sponsor_Tier (
    tier_level VARCHAR2(50),
    amount_contributed NUMBER CHECK (amount_contributed >= 0),
    CONSTRAINT sponsor_tier_pk PRIMARY KEY (tier_level),
    CONSTRAINT unique_amount_contributed UNIQUE (amount_contributed)
);

CREATE TABLE Sponsor(
    sponsor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sponsor_name VARCHAR2(50) NOT NULL,
    tier_level VARCHAR2(50),
    point_of_contact VARCHAR2(100),
    CONSTRAINT unique_sponsor_name UNIQUE (sponsor_name),
    CONSTRAINT fk_sponsor_tier FOREIGN KEY (tier_level)
        REFERENCES Sponsor_Tier(tier_level)
        ON DELETE SET NULL
);

-- Driver and Driver_Internal
CREATE TABLE Driver (
    driver_name VARCHAR2(100) PRIMARY KEY,
    driver_number NUMBER NOT NULL
);

CREATE TABLE Driver_Internal (
    driver_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    driver_name VARCHAR2(100),
    country_of_origin VARCHAR2(50),
    CONSTRAINT fk_name FOREIGN KEY (driver_name)
        REFERENCES Driver(driver_name)
        ON DELETE CASCADE
);

-- Racing and Racing_Series
CREATE TABLE Racing (
    rs_name VARCHAR2(100) PRIMARY KEY,
    division VARCHAR2(50),
    governing_body VARCHAR2(100)
);

CREATE TABLE Racing_Series (
    rs_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rs_name VARCHAR2(100),
    CONSTRAINT fk_racing_series_name FOREIGN KEY (rs_name)
        REFERENCES Racing(rs_name)
        ON DELETE SET NULL
);

-- Engineering_Team and Engineer_Assignment
CREATE TABLE Engineering_Team (
    eng_team_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_name VARCHAR2(100),
    department VARCHAR2(100),
    HQ_address VARCHAR2(100)
);

CREATE TABLE Engineer_Assignment (
    eng_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100),
    proficiency VARCHAR2(50),
    years_experience NUMBER,
    eng_team_id NUMBER,
    CONSTRAINT fk_eng_team_id FOREIGN KEY (eng_team_id)
        REFERENCES Engineering_Team(eng_team_id)
        ON DELETE SET NULL
);

-- Vehicle, Car, Motorcycle
CREATE TABLE Vehicle (
    vehicle_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    model VARCHAR2(100),
    year_first_produced NUMBER(4) CHECK (year_first_produced BETWEEN 1000 AND 2015),
    team_id NUMBER,
    driver_id NUMBER,
    CONSTRAINT fk_team FOREIGN KEY (team_id) 
        REFERENCES Team(team_id) 
        ON DELETE SET NULL,
    CONSTRAINT fk_driver FOREIGN KEY (driver_id)
        REFERENCES Driver_Internal(driver_id)
        ON DELETE SET NULL
);

CREATE TABLE Car (
    vehicle_id NUMBER PRIMARY KEY,
    drivetrain CHAR(3) CHECK (drivetrain IN ('FWD', 'RWD', '4WD', 'AWD')),
    car_type VARCHAR2(50),
    CONSTRAINT fk_car_vehicle FOREIGN KEY (vehicle_id)
        REFERENCES Vehicle(vehicle_id)
        ON DELETE SET NULL
);

CREATE TABLE Motorcycle (
    vehicle_id NUMBER PRIMARY KEY,
    engine_cc NUMBER CHECK (engine_cc BETWEEN 100 AND 3000),
    motorcycle_type VARCHAR2(50),
    CONSTRAINT fk_motorcycle_vehicle FOREIGN KEY (vehicle_id)
        REFERENCES Vehicle(vehicle_id)
        ON DELETE SET NULL
);

-- Project
CREATE TABLE Project (
    project_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    upgrade VARCHAR2(50),
    duration NUMBER,
    status VARCHAR2(50),
    vehicle_id NUMBER NOT NULL,
    eng_team_id NUMBER,
    CONSTRAINT fk_vehicle_id FOREIGN KEY (vehicle_id)
        REFERENCES Vehicle(vehicle_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_eng_team FOREIGN KEY (eng_team_id)
        REFERENCES Engineering_Team(eng_team_id)
        ON DELETE SET NULL
);

-- Upgrade (weak entity)
CREATE TABLE Upgrade (
    brand VARCHAR2(50),
    part_number NUMBER,
    project_id NUMBER,
    status VARCHAR2(50),
    PRIMARY KEY (brand, part_number, project_id),
    CONSTRAINT fk_project_id FOREIGN KEY (project_id)
        REFERENCES Project(project_id)
        ON DELETE CASCADE
);

-- Funds (Sponsor funds Team)
CREATE TABLE Funds (
    sponsor_id NUMBER,
    team_id NUMBER,
    PRIMARY KEY (sponsor_id, team_id),
    contract_start_date DATE,
    contract_end_date DATE,
    CONSTRAINT fk_sponsor_id FOREIGN KEY (sponsor_id) 
        REFERENCES Sponsor(sponsor_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_funds_team_id FOREIGN KEY (team_id)
        REFERENCES Team(team_id)
        ON DELETE CASCADE
);

-- Competes_In (Team competes in Racing_Series)
CREATE TABLE Competes_In (
    team_id NUMBER,
    racing_series_id NUMBER,
    PRIMARY KEY (team_id, racing_series_id),
    ranking_in_series NUMBER,
    CONSTRAINT fk_competes_team_id FOREIGN KEY (team_id)
        REFERENCES Team(team_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_rs_id FOREIGN KEY (racing_series_id)
        REFERENCES Racing_Series(rs_id)
        ON DELETE CASCADE
);



-- =====================================
-- INSERT DUMMY DATA
-- =====================================

-- Team Principal & Team
INSERT INTO Team_Principal (team_principal, team_name) VALUES ('tp001', 'SpeedTech Racing');
INSERT INTO Team (team_principal, year_founded) VALUES ('tp001', 1999);

-- Sponsor Tier & Sponsor
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Bronze', 100000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Silver', 500000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Gold', 1000000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Platinum', 5000000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Diamond', 10000000);

INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) 
VALUES ('FastFuel Corp', 'Gold', 'Alice Morgan');

-- Driver & Driver_Internal
INSERT INTO Driver (driver_name, driver_number) VALUES ('John Blaze', 27);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('John Blaze', 'USA');

-- Racing & Racing_Series
INSERT INTO Racing (rs_name, division, governing_body) 
VALUES ('World GP', 'Elite', 'WGP Federation');
INSERT INTO Racing_Series (rs_name) VALUES ('World GP');

-- Engineering Team & Assignment
INSERT INTO Engineering_Team (team_name, department, HQ_address) 
VALUES ('Alpha Devs', 'Aerodynamics', 'Munich');
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id)
VALUES ('Sophie Lin', 'Expert', 8, 1);

-- Vehicle, Car, Motorcycle
INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id)
VALUES ('Dodge Viper', 2010, 1, 1);
INSERT INTO Car (vehicle_id, drivetrain, car_type)
VALUES (1, 'RWD', 'GT3');

-- Project & Upgrade
INSERT INTO Project (upgrade, duration, status, vehicle_id, eng_team_id)
VALUES ('Turbo Boost System', 120, 'In Progress', 1, 1);
INSERT INTO Upgrade (brand, part_number, project_id, status)
VALUES ('BoostCo', 777, 1, 'Installed');

-- Funds
INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date)
VALUES (1, 1, TO_DATE('2023-01-01', 'YYYY-MM-DD'), TO_DATE('2026-01-01', 'YYYY-MM-DD'));

-- Competes In
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series)
VALUES (1, 1, 2);

