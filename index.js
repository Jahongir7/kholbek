// MERN = Mongo + Express + React + Node

// Development = Node.js server + React server

// MEN

// E - Express

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin:admin123@cluster0.v22tp.mongodb.net/?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json(err);
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return { status: "error", error: "Invalid login" };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

const userController = {
  getUser: async (req, res) => {
    try {
      const users = await User.find();
      if (!users) {
        return res.status(404).json({
          message: "Users is empty",
        });
      }
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  },
  getIdUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          message: "user is empty",
        });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  },
  //   addUser: async (req, res) => {
  //     console.log(req.body);
  //     try {
  //       let post = new User({
  //         phone: req.body.phone,
  //         role: req.body.role,
  //         fullName: req.body.fullName,
  //         password: req.body.password,
  //       });
  //       await post.save();
  //       res.status(200).json(post);
  //     } catch (err) {
  //       res.status(500).json({
  //         message: err.message,
  //       });
  //     }
  //   },
  deleteUserById: async (req, res) => {
    try {
      let post = await User.findById(req.params.id);
      await post.remove();
      res.json(post);
    } catch (error) {
      console.log(error);
    }
  },
  //   updateUser: async (req, res) => {
  //     try {
  //       let post = await User.findById(req.params.id);
  // 		let data = {
  // 			phone: req.body.phone,
  // 			role: req.body.role,
  // 			fullName: req.body.fullName,
  // 			password: req.body.password,
  // 		};
  //       user = await User.findByIdAndUpdate(post, data, {
  //         new: true,
  //       });
  //       res.json(user);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
};
app.get("/api/users", userController.getUser);
app.get("/api/users/:id", userController.getIdUser);
app.post("/api/users", userController.addUser);
app.delete("/api/users/:id", userController.deleteUserById);

app.listen(1337, () => {
  console.log("Server started on 1337");
});
