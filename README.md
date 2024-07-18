- Starting the application
        
        # supply .env file in the root folder
        JWT_SECRET=your_jwt_secret
        POSTGRES_DB=your_pg_db_name
        POSTGRES_USER=your_pg_username
        POSTGRES_PASSWORD=your_pg_password
        
        # in the root folder
        docker compose up --build

- Accessing the API
    - First, sign up
    - Sign in to obtain the JWT token
    - Access endpoints other than /auth/ using the obtained JWT token
    - To remove a custom field value, set `value=null`
        - `valueId=null` for enum field
