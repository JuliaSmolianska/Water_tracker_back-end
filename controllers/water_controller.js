import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import { Water } from "../models/Water.js";

const getAllWaterToday = async (req, res) => {
  const { _id: owner, month, date } = req.user;
  const allWaterList = await Water.find({ owner }, { month }, { date }, "-createdAt -updatedAt");
  res.json(allWaterList);
}

const getAllWaterMonth = async (req, res) => {
  const { _id: owner, month } = req.user;
  const allWaterList = await Water.find({ owner }, { month }, "-createdAt -updatedAt");
  res.json(allWaterList);
}

const addWaterIntake = async (req, res) => {
  const { _id: owner } = req.user;
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const newWaterIntake = await Water.create({ ...req.body, owner, date, month });
  res.status(201).json(newWaterIntake);
}

const updateWaterRecordId = async (req, res) => {
  const { recordId } = req.params;
  const { _id: owner } = req.user;
  const updateWaterRecord = await Water.findOneAndUpdate({ _id: recordId, owner }, req.body)
  if (!updateWaterRecord) {
    throw HttpError(404, `Water record with id=${recordId} not found`);
  }
  res.json(updateWaterRecord);
}

const deleteWaterRecordId = async (req, res) => {
  const { recordId } = req.params;
  const { _id: owner } = req.user;
  const removeWaterRecord = await Water.findOneAndDelete({ _id: recordId, owner })
  if (!removeWaterRecord) {
    throw HttpError(404, `Water record with id=${recordId} not found`);
  }
  res.json({ message: "Deleted success" });
}


export default {
  getAllWaterToday: ctrlWrapper(getAllWaterToday),
  getAllWaterMonth: ctrlWrapper(getAllWaterMonth),
  addWaterIntake: ctrlWrapper(addWaterIntake),
  updateWaterRecordId: ctrlWrapper(updateWaterRecordId),
  deleteWaterRecordId: ctrlWrapper(deleteWaterRecordId)
};