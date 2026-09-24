- Create a repository
- Initialize the repository
- node_modules, package.json, package-lock.json
- Install express
- Create a server
- Listen to port 7777
- Write request handlers for /test, /hello
- Install nodemon and update scripts inside package.json
- What are dependencies?
- What is the use of "-g" while npm install?
- Difference between caret and tilde(^ vs ~)?

- Initialize git
- .gitignore
- Create a remote repo on github
- Push all code to remote origin
- Play with routes and route extensions ex. /hello, /, /hello/2, /xyz
- Order of the routes matter a lot
- Install Postman app and make a workspace/colletion > test api call

- Explore routing and use of ?, +, (), \* in the routes
- Use of regex in routes /a/, /.\*fly$/
- Reading the query params in the routes

- Multiple Route Handlers - Play with the code
- next()
- next function and errors along with res.send()
- app.use("/route", rH1, [rH2, rH3], rH4, rH5)
- What is Middleware
- How express JS basically handles requests behind the scenes
- Difference between app.use() and app.all()
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user route except /user/login
- Error handling using app.use("/", (err, req, res, next) = {})

- Create a free cluster on mongodb official website(Mongo Atlas)
- Install mongoose library
- Connect our application to the database
- Call the connectDB function and connect to database before starting application on port 7777
- Create a userSchema and userModel
- Create /signup api to add data to database
- Push some documents using api call
- Error Handling using try catch

- JS object vs JSON
- Add express.json() middleware to our app
- Make signup api dynamic to get the data from end user
- User.findOne() with duplicate email ids, which object returned
- API - get user by email
- API - feed API - get feed - get all users from database
- API - get user by ID
- Create a delete user api 
- Create update user api
- Difference between patch and put
- Difference between findByIdAndUpdate and findOneAndUpdate
- What are options in findByIdAndUpdate api
- Explore the Mongoose documentation for Model methods
- Create api to update user by emailID

- Explore schema type options from the documentation
- Add a required, lowercase, uppercase, minLength, maxLength, min, max, trim
- Add default
- Create a custom validate function for gender
- Improve the db schema - PUT all appropriate validations on each field in schema
- Add timestamp to the user schema
- Add API level validations on patch request and signup post api
- DATA sanetizations: Add API validations for each field



