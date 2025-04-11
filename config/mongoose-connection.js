/*In a Node.js project, a config folder (or config directory) is commonly used to store configuration settings for the
 application. This can include settings for different environments (development, testing, production),
database connections, API keys, and other application-specific parameters. */

//so we no need to setup monggoose in every model file
// separation of concerns
const mongoose=require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/scatch")
.then()//if connected
.catch()//if not connected

module.exports=mongoose.connection;//it will be connectdto the url
