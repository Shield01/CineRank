import connect from "./db/connectDb";
import app from "./app";
const PORT = process.env.PORT ?? 3000;

const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`App is running at PORT : ${PORT}`);
    });
  } catch (err) {
    console.log(`Error occured when starting the app : ${err}`);
  }
};

start();
