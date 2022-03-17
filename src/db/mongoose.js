import mongoose  from "mongoose";

const MONGODB_URL = "mongodb://localhost:27017/job-app1-db"

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}
mongoose.connect(MONGODB_URL, options)