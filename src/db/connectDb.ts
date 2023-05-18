import mongoose, { ConnectOptions } from "mongoose";
import "dotenv/config";

function connect(): Promise<void> {
  const dbUri = process.env.DB_URI as string;

  return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    } as ConnectOptions)
    .then(async () => {
      // console.log("Database connected");
    })
    .catch((error) => {
      console.log(`Error : ${error}`);
      process.exit(1);
    });
}

export default connect;
