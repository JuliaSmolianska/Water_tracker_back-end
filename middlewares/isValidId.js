import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

export const isValidId = (req, res, next) => {
    const { recordId } = req.params;
    if (!isValidObjectId(recordId)) {
        return next(HttpError(404, `Record with id=${recordId} not found`))
    }
    next();
}