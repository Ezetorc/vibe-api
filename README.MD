#### Vibe API Documentation

### Users

###### **GET /users**

- **Description:** Retrieves a list of users.
- **Query Parameters:**
  - `amount` (optional): Number of users to retrieve.
  - `page` (optional): Page number for pagination.
- **Example:**
  ```
  GET /users/?amount=10&page=1
  ```

###### **GET /users/search**

- **Description:** Searches for users by a given query.
- **Query Parameters:**
  - `query`: Word to search.
- **Example:**
  ```
  GET /users/search?query=john
  ```

###### **GET /users/name/:name**

- **Description:** Retrieves the user with the given name or returns null if it doesn't exist.
- **Parameters:**
  - `name`: Name of the user.
- **Example:**
  ```
  GET /users/name/john
  ```

###### **GET /users/email/:email**

- **Description:** Retrieves the user with the given email or returns null if it doesn't exist.
- **Parameters:**
  - `email`: Email of the user.
- **Example:**
  ```
  GET /users/email/john@mail.com
  ```

###### **GET /users/exists**

- **Description:** Checks if a user with the given name or email exists. Only one parameter (name or email) is allowed per request.
- **Query Parameters:**
  - `name` (Optional if email is provided): Name of the user.
  - `email` (Optional if name is provided): Email of the user.
- **Example:**
  ```
  GET /users/exists?name=john
  GET /users/exists?email=john@email.com
  ```

###### **GET /users/:id**

- **Description:** Retrieves the user with the given ID. Returns a 404 error if the user is not found.
- **Parameters:**
  - `id`: ID of the user.
- **Example:**
  ```
  GET /users/123
  ```

###### **GET /users/:id/liked**

- **Description:** Checks if the user liked a comment or post.
- **Parameters:**
  - `id`: ID of the user.
- **Query Parameters:**
  - `type`: 'comment' or 'post'.
  - `targetId`: ID of the comment or post.
- **Example:**
  ```
  GET /users/123/liked?type=post&targetId=321
  ```

###### **POST /users/register**

- **Description:** Creates a new user and returns the authorization token along with the user object.
- **Body:**
  - `name`: Name of the user.
  - `email`: Email of the user.
  - `password`: Password of the user.
- **Example:**
  ```
  POST /users/register
  Body: {
    "name": "John",
    "email": "john@mail.com",
    "password": "john123"
  }
  ```

###### **POST /users/login**

- **Description:** Retrieves the authorization token of the user.
- **Body:**
  - `name` or `email`: Username or email of the user.
  - `password`: Password of the user.
- **Example:**
  ```
  POST /users/login
  Body: {
    "email": "john@mail.com",
    "password": "john123"
  }
  ```
  OR
  ```
  POST /users/login
  Body: {
    "name": "John",
    "password": "john123"
  }
  ```

###### **PATCH /users**

- **Description:** Requires an authorization header. Updates the user's information based on the request body.
- **Body:**
  - `name` (Optional): New name of the user.
  - `password` (Optional): New password of the user.
  - `email` (Optional): New email of the user.
  - `image_id` (Optional): New image ID of the user.
  - `image_url` (Optional): New image URL of the user.
  - `description` (Optional): New description of the user.
- **Example:**
  ```
  PATCH /users
  Body: {
    "name": "New John"
  }
  ```

###### **DELETE /users**

- **Description:** Requires an authorization header. Deletes the authenticated user.
- **Example:**
  ```
  DELETE /users
  ```

###### **DELETE /users/image/:publicId**

- **Description:** Requires an authorization header. Deletes the profile image of the authenticated user.
- **Parameters:**
  - `publicId`: Public ID of the image in Cloudinary.
- **Example:**
  ```
  DELETE /users/image/12345678
  ```

### Posts

###### **GET /posts**

- **Description:** Retrieves a list of posts.
- **Query Parameters:**
  - `amount` (optional): Number of posts to retrieve.
  - `page` (optional): Page number for pagination.
  - `userId` (optional): ID of the owner of the posts.
- **Example:**
  ```
  GET /posts/?amount=10&page=1&userId=123
  ```

###### **GET /posts/count**

- **Description:** Retrieves the amount of posts of the user.
- **Query Parameters:**
  - `userId`: ID of the owner of the posts.
- **Example:**
  ```
  GET /posts/count?userId=123
  ```

###### **GET /posts/search**

- **Description:** Searches for posts by a given query.
- **Query Parameters:**
  - `query`: Word to search.
  - `userId` (Optional): ID of the owner of the posts.
- **Example:**
  ```
  GET /posts/search?query=john&userId=123
  ```

###### **GET /posts/:id**

- **Description:** Retrieves the post with the given ID. Returns a 404 error if the post is not found.
- **Parameters:**
  - `id`: ID of the post.
- **Example:**
  ```
  GET /posts/123
  ```

###### **POST /posts**

- **Description:** Requires an authorization header. Creates a new post with the content given in the body and the user id of the authorization token.
- **Body:**
  - `content`: Content of the post.
- **Example:**
  ```
  POST /posts
  Body: {
    "content": "Hi, i'm Jhon!"
  }
  ```

###### **DELETE /posts/:id**

- **Description:** Requires an authorization header. Deletes the post.
- **Parameters:**
  - `id`: ID of the post to delete.
- **Example:**
  ```
  DELETE /posts/321
  ```

### Likes

###### **GET /likes**

- **Description:** Retrieves a list of likes.
- **Query Parameters:**
  - `type`: 'comment' or 'post'.
  - `targetId` (optional): ID of the comment or post.
- **Example:**
  ```
  GET /likes/?type=post&targetId=321
  ```

###### **GET /likes/count**

- **Description:** Retrieves the amount of likes of a comment or post.
- **Query Parameters:**
  - `type`: 'comment' or 'post'.
  - `targetId` (optional): ID of the comment or post.
- **Example:**
  ```
  GET /likes/count?type=post&targetId=321
  ```

###### **POST /likes**

- **Description:** Requires an authorization header. Creates a new like.
- **Body:**
  - `type`: 'comment' or 'post'.
  - `targetId`: ID of the comment or post.
- **Example:**
  ```
  POST /likes
  Body: {
    "type": "comment",
    "targetId": 123
  }
  ```

###### **DELETE /likes/:id**

- **Description:** Requires an authorization header. Deletes a new like.
- **Parameters:**
  - `id`: ID of the like to delete.
- **Example:**
  ```
  DELETE /likes/321
  ```

### Follows

###### **GET /follows**

- **Description:** Retrieves a list of follows where the following_id is the one of the user with the id given in the userId query parameter.
- **Query Parameters:**
  - `userId` (Optional): ID of the following user.
- **Example:**
  ```
  GET /follows/?userId=123
  ```

###### **GET /follows/count**

- **Description:** Retrieves the amount of follows of the user.
- **Query Parameters:**
  - `type`: 'follower' or 'following'.
  - `userId`: ID of the user.
- **Example:**
  ```
  GET /follows/count?type=follower&userId=123
  ```

###### **GET /follows/exists**

- **Description:** Retrieves the amount of follows of the user.
- **Query Parameters:**
  - `followerId`: ID of the user who is following.
  - `followingId`: ID of the user who is being followed.
- **Example:**
  ```
  GET /follows/exists?followerId=123&followingId=321
  ```

###### **POST /follows/:followingId**

- **Description:** Requires an authorization header. Creates a new follow with the follower id being the one who is given in the authorization token.
- **Parameter:**
  - `followingId`: ID of the user who is being followed.
- **Example:**
  ```
  POST /follows/321
  ```

###### **DELETE /follows/:followingId**

- **Description:** Requires an authorization header. Deletes a follow with the follower id being the one who is given in the authorization token.
- **Parameter:**
  - `followingId`: ID of the user who is being followed.
- **Example:**
  ```
  DELETE /follows/321
  ```

### Comments

###### **GET /comments**

- **Description:** Retrieves a list of comments.
- **Query Parameters:**
  - `amount` (optional): Number of comments to retrieve.
  - `page` (optional): Page number for pagination.
- **Example:**
  ```
  GET /comments/?amount=10&page=1
  ```

###### **GET /comments/post/:postId**

- **Description:** Retrieves the amount of posts of the user.
- **Parameters:**
  - `postId`: ID of the post.
- **Query Parameters:**
  - `amount` (optional): Number of comments to retrieve.
  - `page` (optional): Page number for pagination.
- **Example:**
  ```
  GET /comments/post/321?amount=10&page=1
  ```

###### **GET /comments/:id**

- **Description:** Retrieves a comment.
- **Parameters:**
  - `id`: ID of the comment.
- **Example:**
  ```
  GET /comments/123
  ```

###### **POST /comments**

- **Description:** Requires an authorization header. Creates a new comment with the content and post id given in the body and the user id of the authorization token.
- **Body:**
  - `content`: Content of the comment.
  - `post_id`: ID of the post.
- **Example:**
  ```
  POST /comments
  Body: {
    "content": "Hi, i'm Jhon and i'm writing a comment!",
    "post_id": 321
  }
  ```

###### **DELETE /comments/:id**

- **Description:** Requires an authorization header. Deletes the comment.
- **Parameters:**
  - `id`: ID of the comment to delete.
- **Example:**
  ```
  DELETE /comments/321
  ```
