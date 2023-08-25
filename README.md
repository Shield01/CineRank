# <h1 align="center"> CineRank </h1>

In a world overflowing with captivating films, it can be challenging for movie enthusiasts to keep track of their all-time favorites.CineRank is a groundbreaking solution designed to empower individuals in managing and curating their personal list of Top 100 favorite movies. This documentation delves into the key features and benefits of CineRank, showcasing how it empowers individuals and also the steps to follow in setting up the backend application.

# Feature

- Search for a Movie

- Get detailed information about a movie

- Add a movie to your top 100 movies list.

- View your top 100 movies list.

- Delete a movie from your top 100 movies list.

- Clear Your Top 100 list

# API Documentation

Swagger Documentation : https://mytopmoviesapi.herokuapp.com/docs

Postman Documentation : https://documenter.getpostman.com/view/16279504/2s93kz5jpT

# File Structure

```bash
📦src
 ┣ 📂API Integration
 ┃ ┗ 📜TMDB_API_Integration.ts
 ┣ 📂Controllers
 ┃ ┣ 📜auth.controller.ts
 ┃ ┣ 📜movies.controller.ts
 ┃ ┗ 📜user.controller.ts
 ┣ 📂db
 ┃ ┗ 📜connectDb.ts
 ┣ 📂Models
 ┃ ┣ 📜movie.models.ts
 ┃ ┗ 📜user.model.ts
 ┣ 📂Routes
 ┃ ┣ 📜auth.routes.ts
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜movies.routes.ts
 ┃ ┗ 📜user.routes.ts
 ┣ 📂Utils
 ┃ ┣ 📜auth.utils.ts
 ┃ ┣ 📜http_responses.utils.ts
 ┃ ┣ 📜movie.utils.ts
 ┃ ┗ 📜types.utils.ts
 ┣ 📜app.ts
 ┗ 📜index.ts
 ┃
 ┣ _test_
 ┣ dist
 ┣ .gitignore
 ┣ README.md
 ┣ jest.config.js
 ┣ package-lock.json
 ┣ package.json
 ┗ tsconfig.json

```

# License

MIT License

Copyright (c) 2023 Tijani Hussein
