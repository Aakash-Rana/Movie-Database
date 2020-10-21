const express = require('express');
const db = require('./db');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setting EJS as view engine
app.set('view engine', 'ejs');

// Serving static files from public folder
app.use(express.static(__dirname + '/public'));

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

// Search Routes
app.get('/movie', (req, res) => {
    db.searchMovieByName(req.query.movie, (foundMovies) => {
        if(foundMovies.length === 0) {
            return res.render('movieSearch', {data: foundMovies});
        }
        let finalMovieData = foundMovies;
        // Run query to find actor
        for(let i = 0; i < foundMovies.length; i++) {
            finalMovieData[i].actors = [];
            finalMovieData[i].genres = [];
            // find cast for each movie found from search
            db.castSearch(foundMovies[i].movie_id, (foundActors) => {
                for(let j = 0; j < foundActors.length; j++) {
                    finalMovieData[i].actors.push(foundActors[j]);        
                }
                // find movie genres
                db.genreSearch(foundMovies[i].movie_id, (foundGenres) => {
                    for(let k = 0; k < foundGenres.length; k++) {
                        finalMovieData[i].genres.push(foundGenres[k]);
                    }
                    // find director
                    db.findMovieDir(foundMovies[i].movie_id, (foundDirector) => {
                        finalMovieData[i].director = foundDirector[0].director_name;
                        // find pc
                        db.findMoviePC(foundMovies[i].movie_id, (foundPC) => {
                            finalMovieData[i].pc = foundPC[0].pc_name;
                            if(i === foundMovies.length - 1) {
                                res.render('movieSearch', {data: finalMovieData});
                            }
                        });
                    });
                });
            });
        } 
    });
});

app.get('/actor', (req, res) => {
    db.searchByActorName(req.query.actor, (foundActor) => {
        res.render('actorSearch', {data: foundActor});
    });
});

app.get('/director', (req, res) => {
    db.searchByDirectorName(req.query.director, (foundDirector) => {
        res.render('directorSearch', {data: foundDirector});
    });
});

app.get('/productioncompany', (req, res) => {
    db.searchByProductionCompany(req.query.pc, (foundPC) => {
        res.render('productionCompanySearch', {data: foundPC});
    });
});



// Form display route
app.get('/new', (req, res) => {
    res.render('new');
});

// Submit routes
app.post('/new', (req, res) => {
    /* Basic tables that don't have data-integrity constraints */
    let movieTableData = [req.body.title, req.body.runtime, req.body.plot, req.body.releaseYear];
    /* Check if movie with exact details already present */
    db.checkDuplicateMovie(req.body.releaseYear, req.body.plot, req.body.title, function(r) {
        if(r.length !== 0) {
            console.log(r.length);
           return res.send('We already have details about the movie. Try searching the title.');
        } else {
            let productionCompanyData = [req.body.pcName, req.body.pcAddr, req.body.pcOwner];
            let directorName = req.body.director;
            /* Data associated with integrity constraints, need to capture movie_id,
            pc_id, director_id first as they are foreign keys for following data */
            let genres = [];
            if(req.body.genreSelect1 !== undefined) {
                genres.push(req.body.genreSelect1);
            }
            if(req.body.genreSelect2 !== undefined) {
                genres.push(req.body.genreSelect2);
            }
            if(req.body.genreSelect3 !== undefined) {
                genres.push(req.body.genreSelect3);
            }
            if(req.body.genreSelect4 !== undefined) {
                genres.push(req.body.genreSelect4);
            }
            let castData = [req.body.cast_str, req.body.cast_mgr];
            let actors = [];
            for(let counter = 0; counter < req.body.cast_str; counter++) {
                actors.push(req.body[`actor${counter}`]);
            }
            // Calling functions that work on db
            // Welcome to call back hell *_*
            let movieId = -1, pcId = -1, dirId = -1;
            db.createMovieRow(movieTableData, (id) => {
                movieId = id;
                db.createPCRow(productionCompanyData, (id) => {
                    pcId = id;
                    // Create association between movie and productioncompany
                    db.associateMovieToProductionCompany([movieId, pcId]);
                });
                db.createDirectorRow(directorName,  (id) => {
                    dirId = id;
                    // Create association between movie and director
                    db.associateMovieToDirector([movieId, dirId]);
                });
                // Add genres of movie to movie_genre table
                db.createMovieGenres(movieId, genres);
                // Create Cast Table
                castData.push(movieId);
                db.createCast(castData);
                // Add data to actors table
                db.createActors(movieId, actors);
            });
            res.render('submit');
                }
        });
});



app.listen(4567, () => {
    console.log('Listening at port 4567.');
});