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
        ON DELETE CASCADE
);

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
        ON DELETE CASCADE,
    CONSTRAINT unique_driver_name_internal UNIQUE (driver_name)
);

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
        ON DELETE SET NULL,
    CONSTRAINT unique_rs_name_link UNIQUE (rs_name)
);

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
        ON DELETE CASCADE
);

CREATE TABLE Motorcycle (
    vehicle_id NUMBER PRIMARY KEY,
    engine_cc NUMBER CHECK (engine_cc BETWEEN 100 AND 3000),
    motorcycle_type VARCHAR2(50),
    CONSTRAINT fk_motorcycle_vehicle FOREIGN KEY (vehicle_id)
        REFERENCES Vehicle(vehicle_id)
        ON DELETE CASCADE
);

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

INSERT INTO Team_Principal (team_principal, team_name) VALUES ('Toto Wolf', 'Mercedes AMG Petronas');
INSERT INTO Team (team_principal, year_founded) VALUES ('Toto Wolf', 1970);

INSERT INTO Team_Principal (team_principal, team_name) VALUES ('Christian Horner', 'Red Bull Racing');
INSERT INTO Team (team_principal, year_founded) VALUES ('Christian Horner', 2004);

INSERT INTO Team_Principal (team_principal, team_name) VALUES ('Frederic Vasseur', 'Scuderia Ferrari');
INSERT INTO Team (team_principal, year_founded) VALUES ('Frederic Vasseur', 1929);

INSERT INTO Team_Principal (team_principal, team_name) VALUES ('Mike Krack', 'Aston Martin F1');
INSERT INTO Team (team_principal, year_founded) VALUES ('Mike Krack', 2021);

INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Bronze', 100000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Silver', 500000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Gold', 1000000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Platinum', 5000000);
INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES ('Diamond', 10000000);

INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Petronas', 'Diamond', 'Razlan Razali');
INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Ineos', 'Platinum', 'Jim Ratcliffe');
INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Oracle', 'Diamond', 'Larry Ellison');
INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Tag Heuer', 'Gold', 'Frederic Arnault');
INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Shell', 'Platinum', 'Ben van Beurden');
INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Santander', 'Gold', 'Ana Botin');
INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Aramco', 'Diamond', 'Amin H. Nasser');
INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) VALUES ('Cognizant', 'Platinum', 'Brian Humphries');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Lewis Hamilton', 44);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Lewis Hamilton', 'UK');

INSERT INTO Driver (driver_name, driver_number) VALUES ('George Russell', 63);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('George Russell', 'UK');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Max Verstappen', 1);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Max Verstappen', 'Netherlands');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Sergio Perez', 11);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Sergio Perez', 'Mexico');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Charles Leclerc', 16);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Charles Leclerc', 'Monaco');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Carlos Sainz Jr.', 55);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Carlos Sainz Jr.', 'Spain');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Fernando Alonso', 14);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Fernando Alonso', 'Spain');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Lance Stroll', 18);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Lance Stroll', 'Canada');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Valentino Rossi', 46);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Valentino Rossi', 'Italy');

INSERT INTO Driver (driver_name, driver_number) VALUES ('Marc Marquez', 93);
INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES ('Marc Marquez', 'Spain');

INSERT INTO Racing (rs_name, division, governing_body) VALUES ('Formula 1 World Championship', 'Elite', 'FIA');
INSERT INTO Racing_Series (rs_name) VALUES ('Formula 1 World Championship');

INSERT INTO Racing (rs_name, division, governing_body) VALUES ('MotoGP World Championship', 'Elite', 'FIM');
INSERT INTO Racing_Series (rs_name) VALUES ('MotoGP World Championship');

INSERT INTO Racing (rs_name, division, governing_body) VALUES ('World Endurance Championship', 'Endurance', 'FIA');
INSERT INTO Racing_Series (rs_name) VALUES ('World Endurance Championship');

INSERT INTO Racing (rs_name, division, governing_body) VALUES ('Formula 2 Championship', 'Feeder', 'FIA');
INSERT INTO Racing_Series (rs_name) VALUES ('Formula 2 Championship');

INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Mercedes High Performance Powertrains', 'Engine', 'Brixworth, UK');
INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Mercedes Aerodynamics Dept', 'Aerodynamics', 'Brackley, UK');
INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Red Bull Powertrains', 'Engine', 'Milton Keynes, UK');
INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Red Bull Aerodynamics Dept', 'Aerodynamics', 'Milton Keynes, UK');
INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Ferrari Gestione Sportiva', 'Engine', 'Maranello, Italy');
INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Ferrari Aerodynamics Dept', 'Aerodynamics', 'Maranello, Italy');
INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Honda Racing Corporation', 'Engine', 'Asaka, Japan');
INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES ('Yamaha Factory Racing', 'Chassis', 'Lesmo, Italy');

INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Andy Cowell', 'Expert', 20, 1);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Hywel Thomas', 'Senior', 15, 1);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('James Allison', 'Expert', 25, 2);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Mike Elliott', 'Senior', 18, 2);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Ben Hodgkinson', 'Expert', 22, 3);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Adrian Newey', 'Legend', 35, 4);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Pierre Wache', 'Senior', 16, 4);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Rory McIlroy', 'Junior', 5, 4);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Enrico Gualtieri', 'Expert', 19, 5);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('David Sanchez', 'Senior', 14, 6);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Shinichi Kokubu', 'Expert', 28, 7);
INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) VALUES ('Massimo Meregalli', 'Senior', 20, 8);

INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Mercedes-AMG F1 W14', 2014, 1, 1);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (1, 'RWD', 'Formula 1');
INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Mercedes-AMG F1 W14', 2014, 1, 2);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (2, 'RWD', 'Formula 1');

INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Red Bull RB19', 2013, 2, 3);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (3, 'RWD', 'Formula 1');
INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Red Bull RB19', 2013, 2, 4);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (4, 'RWD', 'Formula 1');

INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Ferrari SF-23', 2015, 3, 5);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (5, 'RWD', 'Formula 1');
INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Ferrari SF-23', 2015, 3, 6);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (6, 'RWD', 'Formula 1');

INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Aston Martin AMR23', 2012, 4, 7);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (7, 'RWD', 'Formula 1');
INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Aston Martin AMR23', 2012, 4, 8);
INSERT INTO Car (vehicle_id, drivetrain, car_type) VALUES (8, 'RWD', 'Formula 1');

INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Yamaha YZR-M1', 2002, 3, 9);
INSERT INTO Motorcycle (vehicle_id, engine_cc, motorcycle_type) VALUES (9, 1000, 'MotoGP');
INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Honda RC213V', 2012, 2, 10);
INSERT INTO Motorcycle (vehicle_id, engine_cc, motorcycle_type) VALUES (10, 1000, 'MotoGP');
INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id) VALUES ('Ducati Desmosedici GP23', 2015, 3, NULL);
INSERT INTO Motorcycle (vehicle_id, engine_cc, motorcycle_type) VALUES (11, 1000, 'MotoGP');

INSERT INTO Project (upgrade, duration, status, vehicle_id, eng_team_id) VALUES ('Front Wing Redesign', 45, 'Completed', 1, 2);
INSERT INTO Upgrade (brand, part_number, project_id, status) VALUES ('MercAero', 1401, 1, 'Installed');
INSERT INTO Upgrade (brand, part_number, project_id, status) VALUES ('MercAero', 1402, 1, 'Installed');

INSERT INTO Project (upgrade, duration, status, vehicle_id, eng_team_id) VALUES ('Floor Edge Update', 30, 'In Progress', 3, 4);
INSERT INTO Upgrade (brand, part_number, project_id, status) VALUES ('RBAero', 1905, 2, 'Fabricating');
INSERT INTO Upgrade (brand, part_number, project_id, status) VALUES ('RBAero', 1906, 2, 'Pending');

INSERT INTO Project (upgrade, duration, status, vehicle_id, eng_team_id) VALUES ('ERS Power Output Increase', 90, 'Testing', 5, 5);
INSERT INTO Upgrade (brand, part_number, project_id, status) VALUES ('FerrariEng', 2310, 3, 'Bench Tested');

INSERT INTO Project (upgrade, duration, status, vehicle_id, eng_team_id) VALUES ('Swingarm Stiffness Mod', 60, 'Completed', 9, 8);
INSERT INTO Upgrade (brand, part_number, project_id, status) VALUES ('YamahaFac', 1001, 4, 'Installed');

INSERT INTO Project (upgrade, duration, status, vehicle_id, eng_team_id) VALUES ('ICE Reliability Fix', 20, 'Completed', 1, 1);
INSERT INTO Upgrade (brand, part_number, project_id, status) VALUES ('MercEng', 1455, 5, 'Installed');

INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (1, 1, TO_DATE('2022-01-01', 'YYYY-MM-DD'), TO_DATE('2026-12-31', 'YYYY-MM-DD'));
INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (2, 1, TO_DATE('2020-01-01', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'));

INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (3, 2, TO_DATE('2023-01-01', 'YYYY-MM-DD'), TO_DATE('2027-12-31', 'YYYY-MM-DD'));
INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (4, 2, TO_DATE('2016-01-01', 'YYYY-MM-DD'), TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (5, 3, TO_DATE('1996-01-01', 'YYYY-MM-DD'), TO_DATE('2028-12-31', 'YYYY-MM-DD'));
INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (6, 3, TO_DATE('2022-01-01', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'));
INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (4, 3, TO_DATE('2024-01-01', 'YYYY-MM-DD'), TO_DATE('2026-12-31', 'YYYY-MM-DD'));

INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (7, 4, TO_DATE('2022-01-01', 'YYYY-MM-DD'), TO_DATE('2027-12-31', 'YYYY-MM-DD'));
INSERT INTO Funds (sponsor_id, team_id, contract_start_date, contract_end_date) VALUES (8, 4, TO_DATE('2021-01-01', 'YYYY-MM-DD'), TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (1, 1, 3);
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (2, 1, 1);
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (3, 1, 2);
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (4, 1, 4);

INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (3, 2, 1);
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (2, 2, 2);

INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (3, 3, 1);

INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (1, 4, 5);
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (3, 4, 2);

-- This is for demoing the last divsion query added can add more later 
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (2, 3, 2);
INSERT INTO Competes_In (team_id, racing_series_id, ranking_in_series) VALUES (2, 4, 3);

COMMIT;
