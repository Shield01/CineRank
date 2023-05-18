# Technical Test - Senior Backend Developer Role

This project is my submission for the Technical Test for the role of Senior Backend Developer at Montech Studios INC.

## Quick Demo

To quickly test the application, visit the Postman documentation using the provided link. You can use the following test credentials to log in and test the endpoints:

- `email: test_user@test.com`

- `password: test_password@test.com`

## Local Setup

To set up the project locally, follow these steps:

1.  Clone the project repository.

2.  Run the command `npm install` to install all project dependencies.

3.  Create a `.env` file in the root directory and populate the following variables:

```
makefile
Copy code
SALT_FACTOR =
TOKEN_KEY =
TOKEN_VALIDITY_DURATION =
TMDB_BASE_URL = https://api.themoviedb.org/3/
TMDB_AUTH_TOKEN =
DB_URI =
```

Ensure you assign valid values to these variables.

4. Run `npm run local` to start the local server.

5. The application will now be running on your local server and listening for requests on port 3000.

Assumptions
During development, the following assumptions were made:

- ## Cost of TMDB API Requests:

It was assumed that Montech Studios incurs a cost per API request to TMDB's API. To mitigate costs, the application stores a copy of the response from TMDB's API when a user adds a movie to their top 100 list. Additionally, an endpoint was implemented to retrieve movie details from the in-house database, reducing the need for API requests unless a user initiates a search or the movie details are not available in the in-house database.

- ## Stability of Movie Details:

It was assumed that movie details remain unchanged. Therefore, the details stored in Montech Studios' in-house database are considered valid and reliable.

# Folder Structure

The project's folder structure is as follows:

- ### API Integration:

Contains `TMDB_API_Integration.ts`, which handles the logic for integrating with the TMDB API.

- ### Controllers:

Contains three controller files that handle specific logic. Each file's name prefix indicates the type of logic it handles. For example, `auth.controller.ts` handles authentication-related logic.

- ### db:

Contains `connectDb.ts`, which handles the application's database connection.

- ### Models:

Contains two files that define the database models and application interfaces. The name prefix before `.model.ts` specifies the type of model defined in the file. For example, `movie.model.ts` defines the movie database model and the movie application interface.

- ### Routes:

Contains four files that follow the same naming convention as other folders. The `index.ts` file acts as middleware to consolidate all routes into a single location.

- ### Utils:

Contains utility functions split across four files. The name prefix before `.utils.ts` indicates the type of utility function in each file.

Note: The `dist` folder is a compiled version of the src folder and can be ignored for the purposes of this documentation.

The `index.ts` file serves as the entry point into the application and contains all application configurations.
