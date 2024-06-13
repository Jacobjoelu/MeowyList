import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@meowylist.mdzugaf.mongodb.net/?retryWrites=true&w=majority&appName=MeowyList`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const subscriberSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/", async (req, res) => {
  console.log("Received form submission");
  console.log(req.body);

  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    console.log("Missing form data");
    return res.status(400).send("All fields are required.");
  }

  const newSubscriber = new Subscriber({ firstName, lastName, email });
  try {
    await newSubscriber.save();
    console.log("Saved subscriber to MongoDB");

    // Subscribe to Mailchimp
    const instance = process.env.MAILCHIMP_INSTANCE;
    const listID = process.env.MAILCHIMP_LIST_ID;
    const apiKey = process.env.MAILCHIMP_API_KEY;

    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
        },
      ],
    };

    const jsonData = JSON.stringify(data);

    const url = `https://${instance}.api.mailchimp.com/3.0/lists/${listID}`;

    const options = {
      method: "POST",
      headers: {
        Authorization: `auth ${apiKey}`,
        "Content-Type": "application/json",
      },
      data: jsonData,
    };

    await axios(url, options);
    console.log("Subscribed user to Mailchimp");
    res.sendFile(path.join(__dirname, "dist", "signedUp.html"));
  } catch (err) {
    console.error("Error occurred:", err);
    res.sendFile(path.join(__dirname, "dist", "Failed.html"));
  }
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
