import app from "./src/app.js";
import connectDB from "./src/db/db.js";
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
  });
}

startServer();
