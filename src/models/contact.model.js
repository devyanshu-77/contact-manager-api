import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  comapany: String,
  job_title: String,
  tage: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
