const request = require("supertest");
const app = require("../src/app");
const { seedDatabase, instance } = require("../src/config/db");

// Tests unitarios de la aplicación
// Los casos que se repiten, como "bad movieId format", solo se prueban una vez
//  en lugar de repetirse en cada ruta, para no hacer tests redundantes

describe("App", () => {
    let authToken;

    beforeEach(async () => {
        // Limpiamos e inicializamos la base de datos
        await instance.sync({ force: true });
        await seedDatabase();

        // Obtenemos el token de acceso
        const response = await request(app)
            .post("/sessions")
            .send({
                username: "user1",
                password: "12345678",
            });

        authToken = response.body.token;
    });

    // Rutas de películas
    describe("Movie Routes", () => {
        it("should get all movies", async () => {
            const response = await request(app)
                .get("/movies")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();
        });
        it("should filter movies by exact title", async () => {
            const response = await request(app)
                .get("/movies?title=Rec")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe("Rec");
        });

        it("should filter movies by title coincidence", async () => {
            const response = await request(app)
                .get("/movies?title=Re")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();
            response.body.forEach(movie => {
                expect(movie.title.toLowerCase()).toContain("re");
            });
        });

        it("should filter movies by genre", async () => {
            const response = await request(app)
                .get("/movies?genre=Terror")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();    
            expect(response.body.length).toBeGreaterThan(0);
            response.body.forEach(movie => {
                expect(movie.genre).toBe("Terror");
            });
        });

        it("should filter movies by duration", async () => {
            const response = await request(app)
                .get("/movies?duration=78")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();    
            expect(response.body[0].duration).toBe(78);
        });

        it("should filter movies by rating", async () => {
            const response = await request(app)
                .get("/movies?rating=4.9")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();    
            expect(response.body.length).toBeGreaterThan(0);
            response.body.forEach(movie => {
                expect(movie.rating).toBe(4.9);
            });
        });

        it("should filter movies by multiple criteria", async () => {
            const response = await request(app)
                .get("/movies?title=Rec&genre=Terror&duration=78&rating=4.5")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();    
            const movie = response.body[0];
            expect(movie.title).toBe("Rec");
            expect(movie.genre).toBe("Terror");
            expect(movie.duration).toBe(78);
            expect(movie.rating).toBe(4.5);
        });

        it("should paginate movies", async () => {
            const response = await request(app)
                .get("/movies?page=2&limit=5")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.length).toBe(5);
            const movieIds = response.body.map(movie => movie.id);
            expect(movieIds).toEqual([6, 7, 8, 9, 10]);
        });
    });

    // Rutas de valoraciones
    describe("Rating Routes", () => {
        it("should NOT get all movie ratings -> bad movieId format", async () => {
            const movieId = "invalid";
            const response = await request(app)
                .get(`/movies/${movieId}/ratings`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should NOT get all movie ratings -> movie not found", async () => {
            const movieId = "999";
            const response = await request(app)
                .get(`/movies/${movieId}/ratings`)
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body).toHaveProperty("error");
        });

        it("should get all movie ratings", async () => {
            const movieId = "1";
            const response = await request(app)
                .get(`/movies/${movieId}/ratings`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();
        });

        it("should NOT create a movie rating -> invalid or missing token", async () => {
            const movieId = "1";
            await request(app)
                .post(`/movies/${movieId}/ratings`)
                // No se envía el token de acceso
                //.set("Authorization", `Bearer ${authToken}`)
                .send({
                    rating: 5,
                    comment: "Great movie!",
                })
                .expect("Content-Type", /json/)
                .expect(401);
        });

        it("should NOT create a movie rating -> bad payload", async () => {
            const movieId = "1";
            const response = await request(app)
                .post(`/movies/${movieId}/ratings`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    rating: 6, // Valoración no permitida, no está en el rango 0-5
                    comment: "Great movie!",
                })
                .expect("Content-Type", /json/)
                .expect(422);

            expect(response.body).toHaveProperty("error");
        });

        it("should create a movie rating", async () => {
            const movieId = "1";
            const response = await request(app)
                .post(`/movies/${movieId}/ratings`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    rating: 5,
                    comment: "Great movie!",
                })
                .expect("Content-Type", /json/)
                .expect(201);

            expect(response.body).toHaveProperty("rating");
            expect(response.body).toHaveProperty("comment");
        });

        it("should NOT get a specific movie rating -> bad ratingId format", async () => {
            const movieId = "1";
            const ratingId = "invalid";
            const response = await request(app)
                .get(`/movies/${movieId}/ratings/${ratingId}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should NOT get a specific movie rating -> rating not found", async () => {
            const movieId = "1";
            const ratingId = "999";
            const response = await request(app)
                .get(`/movies/${movieId}/ratings/${ratingId}`)
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body).toHaveProperty("error");
        });

        it("should get a specific movie rating", async () => {
            const movieId = "1";
            const ratingId = "1";
            const response = await request(app)
                .get(`/movies/${movieId}/ratings/${ratingId}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveProperty("rating");
            expect(response.body).toHaveProperty("comment");
        });

        it("should update a specific movie rating", async () => {
            const movieId = "1";
            const ratingId = "1";

            const response = await request(app)
                .patch(`/movies/${movieId}/ratings/${ratingId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    rating: 4,
                    comment: "Updated comment",
                })
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveProperty("rating");
            expect(response.body).toHaveProperty("comment");
        });

        it("should delete a specific movie rating", async () => {
            const movieId = "1";
            const ratingId = "1";

            await request(app)
                .delete(`/movies/${movieId}/ratings/${ratingId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(204);
        });
    });

    describe("Watchlist Routes", () => {
        it("should get a specific user's watchlist", async () => {
            const userId = "1";
            const response = await request(app)
                .get(`/watchlist/${userId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();
        });

        it("should NOT add a movie to a specific user's watchlist -> bad userId format", async () => {
            const userId = "invalid";
            const response = await request(app)
                .post(`/watchlist/${userId}/items`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    movieId: 1,
                })
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should NOT add a movie to a specific user's watchlist -> movie already in the watchlist", async () => {
            const userId = "1";
            const previousResponse = await request(app)
                .post(`/watchlist/${userId}/items`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    movieId: 1,
                });
            const response = await request(app)
                .post(`/watchlist/${userId}/items`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    movieId: 1,
                })
                .expect("Content-Type", /json/)
                .expect(409);

            expect(response.body).toHaveProperty("error");
        });

        it("should add to a specific user's watchlist", async () => {
            const userId = "1";
            const response = await request(app)
                .post(`/watchlist/${userId}/items`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    movieId: 1,
                })
                .expect("Content-Type", /json/)
                .expect(201);

            expect(response.body).toHaveProperty("movieId");
            expect(response.body).toHaveProperty("userId");
        });

        it("should NOT remove a movie from a specific user's watchlist -> bad itemId format", async () => {
            const userId = "1";
            const itemId = "invalid";
            const response = await request(app)
                .delete(`/watchlist/${userId}/items/${itemId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should NOT remove a movie from a specific user's watchlist -> item not found", async () => {
            const userId = "1";
            const itemId = "999";
            const response = await request(app)
                .delete(`/watchlist/${userId}/items/${itemId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body).toHaveProperty("error");
        });

        it("should remove a movie from a specific user's watchlist", async () => {
            const userId = "1";
            const itemId = "1";

            // previousResponse: añadimos movieId = 1 al watchlist
            await request(app)
                .post(`/watchlist/${userId}/items`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    movieId: 1,
                });

            // response: movieId = 1 ya está añadido al watchlist
            await request(app)
                .delete(`/watchlist/${userId}/items/${itemId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(204);
        });
    });

    describe("Session Routes", () => {
        it("should NOT get the accessToken -> invalid credentials", async () => {
            const response = await request(app)
                .post("/sessions")
                .send({
                    username: "user1",
                    password: "wrongpassword",
                })
                .expect("Content-Type", /json/)
                .expect(401);

            expect(response.body).toHaveProperty("error");
        });

        it("should get the accessToken (called 'token')", async () => {
            const response = await request(app)
                .post("/sessions")
                .send({
                    username: "user1",
                    password: "12345678",
                })
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toHaveProperty("token");
        });
    });
});
/*
*/