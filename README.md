- Starting the application
        
        # in the root folder
        docker compose up --build

- Accessing the API
    - First, sign up
    - Sign in to obtain the JWT token
    - Access endpoints other than /auth/ using the obtained JWT token
    - To remove a custom field value, set `value=null`
        - `valueId=null` for enum field
