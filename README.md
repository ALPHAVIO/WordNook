<div align="center">
  <h1>BlogSite</h1>
  <img src="assets/banner1.png" />
</div>

## About-
- 'Blog' and 'blogging' are now loosely used for content creation and sharing on social media, especially when the content is long-form and one creates and shares content on regular basis.
<br/>

- This is a dynamically updating Blog posting website developed primarily using Node Js with EJS template engine and Mongoose as ODM(Object Data Modeling library).

## Tech Stack-
- HTML
- CSS
- EJS template engine
- Node JS
- Express JS
- Mongoose

## Environment Setup-

* Drop a :star: on the GitHub repository.
<br/>

* Download and install a code/ text editor.
    - Recommended-
        - [Download VS Code](https://code.visualstudio.com/download)
        - [Download Atom](https://atom.io/)
<br/>

* Download [Node Js and npm(Node package manager)](https://nodejs.org/en/) (when you download Node, npm also gets installed by default)
<br/>

* MongoDB Atlas is the global cloud database service for modern applications. . [Signup to MongoDB Atlas](https://account.mongodb.com/account/register?signedOut=true)
<br/>


* Clone the repository by running command
```
git clone https://github.com/ <your user-name> /BlogSite.git
```
in your git bash.
<br/>

* Run command `cd BlogSite`.
<br/>

* Run this command to install all dependencies for the project.
```
npm install
```
All the current dependencies -
```
  "body-parser": "^1.18.3",
  "ejs": "^2.6.1",
  "express": "^4.16.3",
  "lodash": "^4.17.20",
  "mongoose": "^5.11.9"
```
<br/>

* Go to [MongoDB Atlas](https://account.mongodb.com/account/login).
* Create a cluster and whitelist your IP address.
* Click on connect from cluster section and setup username and password (save for later).
* Click on connect and in "Choose a connection method" select "Connect your application".
* You'll get a url as below called as ConnectionURL.
```
mongodb+srv://<username>:<password>@cluster0.ueivc.mongodb.net/<dbname>?retryWrites=true&w=majority
```
* Replace the username and password with the credentials you created previously and set dbname as blogDB.
* So your final string looks like :
```
mongodb+srv://yourUserName:yourPassword@cluster0.ueivc.mongodb.net/blogDB?retryWrites=true&w=majority
```
* Use this string and place it inbetween ' ' on line 22 in app.js

<br/>

* Run this command to start the project on local host 3000.
```
node app
```
<br/>

* Open link to view the website in your browser window if it doesn't open automatically.
```
http://localhost:3000/
```
<br/>

* You can learn more about EJS template engine and its syntax to know how we can use it inside our HTML using the [documentation](https://ejs.co/#docs)
<br/>

* Now you are all set to use this project.
