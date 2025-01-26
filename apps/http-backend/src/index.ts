import mongoose from 'mongoose'
import app from './app';
import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI as string)
.then(() => {
    console.log('Connected to database' )
})
.catch((err) => {
    console.error('Error connecting to database', err);
})

app.listen((PORT), () => {
    console.log(`Server is running on port ${PORT}`);
})