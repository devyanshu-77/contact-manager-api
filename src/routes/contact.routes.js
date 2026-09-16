import { Router } from "express";
const contactRouter = Router();

import Contact from "../models/contact.model.js";
import {
  createSchema,
  searchSchema,
} from "../validation/contact.validation.schema.js";
import auth from "../middlewares/auth.js";

contactRouter.post("/contacts", auth, async (req, res) => {
  try {
    const validationResult = createSchema.safeParse(req.body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((err) => ({
        path: err.path[0],
        message: err.message,
      }));
      res.status(422).json({
        success: false,
        message: "Validation error",
        error: formattedErrors,
      });
      return true;
    }

    const userId = req.userId;
    const newContact = await Contact.create({
      name: validationResult.data.name,
      email: validationResult.data.email,
      phone: validationResult.data.phone,
      comapny: validationResult.data.company,
      job_title: validationResult.data.job_title,
      tag: validationResult.data.job_title,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Added new contact",
      contact: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
        company: newContact.company,
        job_title: newContact.job_title,
        tag: newContact.tag,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      console.log("Duplicate key error key: ", err.keyValue);
      res.status(409).json({
        success: false,
        message: "Contact already exist with given email or phone",
      });
    } else {
      console.log("Contact creation error: ", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
});
contactRouter.get("/contacts", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const contacts = await Contact.find({ userId: userId });
    if (0 === contacts.length) {
      res
        .status(404)
        .json({ success: false, message: "You do not have any contact" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Fetched all contacts",
      contacts: [...contacts],
    });
  } catch (err) {
    console.log("Fetch all contacts error: ", err);
    res.status(500).json({ success: false, message: "Internl server error" });
  }
});
contactRouter.query("/contacts/search", auth, async (req, res) => {
  try {
    const validationResult = searchSchema.safeParse(req.body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((e) => ({
        path: e.path[0],
        message: e.message,
      }));
      res.status(422).json({
        success: false,
        message: "Input validation error",
        error: formattedErrors,
      });
      return;
    }
    const data = Object.entries(validationResult.data).map(([key, value]) => {
      return { [key]: value };
    });
    const contact = await Contact.find({ $or: [...data] });
    res.status(200).json({
      success: true,
      message: "Fetched related contacts",
      contact: contact,
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
export { contactRouter };
