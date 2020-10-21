-- Movie
CREATE TABLE movie (
    movie_id int NOT NULL AUTO_INCREMENT ,
    plot varchar(255) NOT NULL,
    runtime VARCHAR(10) NOT NULL,
    release_year year(4) NOT NULL,
    title varchar(50) NOT NULL ,
    PRIMARY KEY(movie_id)
);

-- Movie Genres
CREATE TABLE movie_genre (
    movie_id int,
    genre varchar(30) NOT NULL,
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(movie_id, genre)
);

-- Production Company
CREATE TABLE production_company (
    pc_id int AUTO_INCREMENT PRIMARY KEY,
    pc_name varchar(75) NOT NULL,
    pc_address varchar(100),
    pc_owner varchar(40) NOT NULL
);

-- Movie - ProductionCompany Relation
create table produced_by(
    movie_id int,
    pc_id int,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pc_id) REFERENCES production_company(pc_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(movie_id, pc_id)
);

-- Reviews
CREATE TABLE reviews(
    review_id int AUTO_INCREMENT PRIMARY KEY,
    rating int NOT NULL,
    reviewed_by varchar(30) DEFAULT 'Anonymous',
    review_desc varchar(255) NOT NULL
);

-- Movie - Reviews relation -> rated
CREATE TABLE rated(
    review_id int,
    movie_id int,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id)
    ON DELETE CASCADE ON UPDATE CASCADE, 
    PRIMARY KEY (movie_id,review_id)
);

-- Director
CREATE TABLE director(
    director_name varchar(40) NOT NULL,
    director_id int AUTO_INCREMENT PRIMARY KEY
);

-- Movie - Director Relation -> directedby
CREATE TABLE directed_by (
    director_id int,
    movie_id int,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (director_id) REFERENCES director(director_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (director_id,movie_id)
);

-- Movie Cast Tabel
CREATE TABLE cast_of_movie(
    movie_id int,
    cast_strength int NOT NULL,
    casting_manager varchar(250) NOT NULL, 
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (movie_id)
);

-- Cast Actor Table
CREATE TABLE cast_actor(
    movie_id int,
    actor_name varchar(250) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (actor_name,movie_id)
);
