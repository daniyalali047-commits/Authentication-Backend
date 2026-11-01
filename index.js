import app from "./src/app.js";
import connectDB from "./config/database.js";

await connectDB();

app.listen(3000, () => {
  console.log("Server is running");
});

//MONGODB_URI="mongodb+srv://daniyalali047_db_user:tEGtSg7W1hJw1TWZ@authentication.gjxqedb.mongodb.net"