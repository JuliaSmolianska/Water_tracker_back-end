import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import { Water } from "../models/Water.js";

const getAllWaterToday = async (req, res) => {
  const { _id: owner } = req.user;
  const { date, month } = req.body;
  const allWaterList = await Water.find({ owner, date, month }, "-createdAt -updatedAt");
  res.json(allWaterList);
}

const getAllWaterMonth = async (req, res) => {
  const { _id: owner } = req.user;
  const { month } = req.body;
  const allWaterList = await Water.find({ owner, month }, "-createdAt -updatedAt");
  res.json(allWaterList);
}

const addWaterIntake = async (req, res) => {
  const { _id: owner, waterRate } = req.user;
  const { waterVolume, date, month } = req.body;
  const percent = (waterVolume * 100 / waterRate).toFixed(2);
  await Water.create({ ...req.body, owner, date, month, percent });
  res.status(201).json({ message: "Water consumption record saved successfully" });
}

const updateWaterRecordId = async (req, res) => {
  const { recordId } = req.params;
  const { _id: owner } = req.user;
  const updateWaterRecord = await Water.findOneAndUpdate({ _id: recordId, owner }, req.body)
  if (!updateWaterRecord) {
    throw HttpError(404, `Water record with id=${recordId} not found`);
  }
  const { waterVolume, time, date, month, percent } = updateWaterRecord
  res.json({ waterVolume, time, date, month, percent });
}

const deleteWaterRecordId = async (req, res) => {
  const { recordId } = req.params;
  const { _id: owner } = req.user;
  const removeWaterRecord = await Water.findOneAndDelete({ _id: recordId, owner })
  if (!removeWaterRecord) {
    throw HttpError(404, `Water record with id=${recordId} not found`);
  }
  res.json({ message: "Water consumption record deleted successfully" });
}


export default {
  getAllWaterToday: ctrlWrapper(getAllWaterToday),
  getAllWaterMonth: ctrlWrapper(getAllWaterMonth),
  addWaterIntake: ctrlWrapper(addWaterIntake),
  updateWaterRecordId: ctrlWrapper(updateWaterRecordId),
  deleteWaterRecordId: ctrlWrapper(deleteWaterRecordId)
};