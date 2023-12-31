import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body)
  const user = await User.findOne({ email });
  const avatarURL = gravatar.url(email);

  if (user) {
    throw HttpError(409, "Email already use")
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, name, password: hashPassword, avatarURL });
  console.log(newUser)
  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      userID: newUser._id,
    }
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email is wrong")
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Password is wrong")
  }
  const payload = {
    id: user._id
  }

  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "48h",
  });
  await User.findByIdAndUpdate(user._id, { token })

  res.json({
    token,
    user: {
      name: user.name,
      email,
    },
  });
}

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" })
  res.status(204).json({ message: "No Content" })
}

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  if (!req.file) {
    throw new Error("No file provided for avatar update.");
  }
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  (await jimp.read(oldPath)).resize(250, 250).write(oldPath);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatar", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

const currentUser = async (req, res) => {
  const { _id } = req.user;
  const { name, email, avatarURL, gender, waterRate } = await User.findById(_id, "-createdAt -updatedAt");
  res.json({
    name, email, avatarURL, gender, waterRate
  })
}

const updateUser = async (req, res, next) => {
  const { _id } = req.user;
  const updateUserInfo = req.body;
  const updatedUser = await User.findByIdAndUpdate(_id, updateUserInfo);
  console.log(updatedUser)

  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email, avatarURL, gender, waterRate } = updatedUser;
  res.status(200).json({
    name,
    email,
    avatarURL,
    gender,
    waterRate
  });
}

const updateWaterNorm = async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id)
  const { waterRate, gender } = req.body;
  await User.findByIdAndUpdate(_id, { waterRate, gender });
  res.status(200).json({ waterRate });
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  currentUser: ctrlWrapper(currentUser),
  updateUser: ctrlWrapper(updateUser),
  updateWaterNorm: ctrlWrapper(updateWaterNorm)
};