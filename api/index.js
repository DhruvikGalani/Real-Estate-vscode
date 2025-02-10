import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = 3000;

//connect with mongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to DB..");
  })
  .catch((err) => {
    console.log(err);
  });


app.listen(PORT, () => {
  console.log(`🚀 Server is running... ${PORT}`);
});

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);

//custom error handel
app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statuscode).json({
      success : false,
      statuscode,
      message,
  });
}); 
