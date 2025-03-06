### Users API Documentation

#### **GET /users/all**

- **Description:** Retrieves a list of users.
- **Query Parameters:**
  - `amount` (optional): Number of users to retrieve.
  - `page` (optional): Page number for pagination.
- **Example:**
  ```
  GET /users/all?amount=10&page=1
  ```

#### **GET /users/search**

- **Description:** Searches for users based on a query string.
- **Query Parameters:**
  - `query` (required): Search term for finding users.
- **Example:**
  ```
  GET /users/search?query=John
  ```

#### **GET /users/id**

- **Description:** Retrieves a user by their ID.
- **Query Parameters:**
  - `id` (required): User ID.
- **Example:**
  ```
  GET /users/id?id=123
  ```

#### **GET /users/name**

- **Description:** Retrieves a user by their name.
- **Query Parameters:**
  - `name` (required): User's name.
- **Example:**
  ```
  GET /users/name?name=JohnDoe
  ```

#### **GET /users/email**

- **Description:** Retrieves a user by their email.
- **Query Parameters:**
  - `email` (required): User's email.
- **Example:**
  ```
  GET /users/email?email=johndoe@example.com
  ```

---

#### **POST /users/register**

- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Example:**
  ```
  POST /users/register
  ```

#### **POST /users/login**

- **Description:** Logs in a user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "password": "securepassword"
  }
  ```
- **Example:**
  ```
  POST /users/login
  ```

#### **POST /users/logout**

- **Description:** Logs out a user and clears session cookies.
- **Middleware:** Requires session authentication.
- **Example:**
  ```
  POST /users/logout
  ```

#### **POST /users/image**

- **Description:** Deletes a user's image from Cloudinary.
- **Query Parameters:**
  - `id` (required): Cloudinary image ID.
- **Example:**
  ```
  POST /users/image?id=abc123
  ```

---

#### **DELETE /users**

- **Description:** Deletes a user by ID.
- **Middleware:** Requires session authentication.
- **Query Parameters:**
  - `id` (required): User ID.
- **Example:**
  ```
  DELETE /users?id=123
  ```

---

#### **PATCH /users**

- **Description:** Updates user information. id and created_at cant be updated.
- **Middleware:** Requires session authentication.
- **Request Body:**
- **Query Parameters:**
  - `id` (required): User ID.
  ```json
  {
    "name": "Updated Name",
    "email": "updatedemail@example.com"
  }
  
  ```
- **Example:**
  ```
  PATCH /users?id=123
  ```

### Posts API Documentation

#### **GET /posts/all**

- **Description:** Retrieves a list of posts.
- **Query Parameters:**
  - `amount` (optional): Number of posts to retrieve.
  - `page` (optional): Page number for pagination.
- **Example:**
  ```
  GET /posts?amount=10&page=1
  ```

#### **GET /posts/search**

- **Description:** Searches for posts based on a query string.
- **Query Parameters:**
  - `query` (required): Search term for finding posts.
  - `userId` (optional): Filter posts by user ID.
- **Example:**
  ```
  GET /posts/search?query=vacation&userId=123
  ```

#### **GET /posts/id**

- **Description:** Retrieves a post by its ID.
- **Query Parameters:**
  - `id` (required): Post ID.
- **Example:**
  ```
  GET /posts/id?id=123
  ```

#### **POST /posts**

- **Description:** Creates a new post.
- **Middleware:** Requires session authentication.
- **Request Body:**
  ```json
  {
    "user_id": 123,
    "content": "This is a new post content."
  }
  ```
- **Example:**
  ```
  POST /posts
  ```

#### **DELETE /posts/id**

- **Description:** Deletes a post by its ID.
- **Middleware:** Requires session authentication.
- **Query Parameters:**
  - `id` (required): Post ID.
- **Example:**
  ```
  DELETE /posts/id?id=123
  ```

#### **PATCH /posts/id**

- **Description:** Updates an existing post.
- **Middleware:** Requires session authentication.
- **Query Parameters:**
  - `id` (required): Post ID.
- **Request Body:**
  ```json
  {
    "content": "Updated content for the post."
  }
  ```
- **Example:**
  ```
  PATCH /posts/id?id=123
  ```

### Likes API Documentation

#### **GET /likes/all**

- **Description:** Retrieves a list of likes.
- **Query Parameters:**
  - `id` (optional): Target ID (post or comment) to filter likes.
  - `type` (required): Type of the liked entity (`post` or `comment`).
- **Example:**
  ```
  GET /likes/all?type=post&id=123
  ```

#### **POST /likes**

- **Description:** Creates a new like.
- **Request Body:**
  ```json
  {
    "target_id": 123,
    "type": "post",
    "user_id": 456
  }
  ```
- **Example:**
  ```
  POST /likes
  ```

#### **DELETE /likes/id**

- **Description:** Deletes a like by its ID.
- **Query Parameters:**
  - `id` (required): Like ID to delete.
- **Example:**
  ```
  DELETE /likes/id?id=789
  ```

### Followers API Documentation

#### **GET /followers/all**

- **Description:** Retrieves a list of followers.
- **Query Parameters:**
  - `userId` (optional): User ID to filter followers.
- **Example:**
  ```
  GET /followers?userId=123
  ```

#### **POST /followers**

- **Description:** Creates a new follower relationship.
- **Request Body:**
  ```json
  {
    "follower_id": 123,
    "following_id": 456
  }
  ```
- **Example:**
  ```
  POST /followers
  ```

#### **DELETE /followers**

- **Description:** Deletes a follower relationship.
- **Request Body:**
  ```json
  {
    "follower_id": 123,
    "following_id": 456
  }
  ```
- **Example:**
  ```
  DELETE /followers
  ```

### Comments API Documentation

#### **GET /comments/all**

- **Description:** Retrieves a list of comments.
- **Query Parameters:**
  - `amount` (optional): Number of comments to retrieve.
  - `page` (optional): Page number for pagination.
  - `postId` (optional): Filter comments by post ID.
- **Example:**
  ```
  GET /comments?amount=10&page=1&postId=123
  ```

#### **GET /comments/id**

- **Description:** Retrieves a comment by its ID.
- **Query Parameters:**
  - `id` (required): Comment ID.
- **Example:**
  ```
  GET /comments/id?id=123
  ```

#### **POST /comments**

- **Description:** Creates a new comment.
- **Request Body:**
  ```json
  {
    "post_id": 123,
    "content": "This is a comment.",
    "user_id": 456
  }
  ```
- **Example:**
  ```
  POST /comments
  ```

#### **DELETE /comments**

- **Description:** Deletes a comment by its ID.
- **Query Parameters:**
  - `id` (required): Comment ID.
- **Example:**
  ```
  DELETE /comments?id=123
  ```
