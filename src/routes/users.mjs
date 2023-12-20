import { Router } from "express";
import {
	query,
	validationResult,
	checkSchema,
	matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

const router = Router();

router.get(
	"/api/users",
	query("filter")
		.isString()
		.notEmpty()
		.withMessage("Must not be empty")
		.isLength({ min: 3, max: 10 })
		.withMessage("Must be at least 3-10 characters"),
	(request, response) => {
		request.sessionStore.get(request.session.id, (err, sessionData) => {
			if (err) {
				throw err;
			}
		});
		const result = validationResult(request);
		const {
			query: { filter, value },
		} = request;
		if (filter && value)
			return response.send(
				mockUsers.filter((user) => user[filter].includes(value))
			);
		return response.send(mockUsers);
	}
);

router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

router.post(
	"/api/users",
	checkSchema(createUserValidationSchema),
	createUserHandler
);

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
	const { body, findUserIndex } = request;
	mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
	return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
	const { body, findUserIndex } = request;
	mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
	return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
	const { findUserIndex } = request;
	mockUsers.splice(findUserIndex, 1);
	return response.sendStatus(200);
});

export default router;
