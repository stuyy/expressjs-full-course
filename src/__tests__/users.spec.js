import * as validator from "express-validator";
import * as helpers from "../utils/helpers.mjs";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { User } from "../mongoose/schemas/user.mjs";

jest.mock("express-validator", () => ({
	validationResult: jest.fn(() => ({
		isEmpty: jest.fn(() => false),
		array: jest.fn(() => [{ msg: "Invalid Field" }]),
	})),
	matchedData: jest.fn(() => ({
		username: "test",
		password: "password",
		displayName: "test_name",
	})),
}));

jest.mock("../utils/helpers.mjs", () => ({
	hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock("../mongoose/schemas/user.mjs");

const mockRequest = {
	findUserIndex: 1,
};

const mockResponse = {
	sendStatus: jest.fn(),
	send: jest.fn(),
	status: jest.fn(() => mockResponse),
};

describe("get users", () => {
	it("should get user by id", () => {
		getUserByIdHandler(mockRequest, mockResponse);
		expect(mockResponse.send).toHaveBeenCalled();
		expect(mockResponse.send).toHaveBeenCalledWith({
			id: 2,
			username: "jack",
			displayName: "Jack",
			password: "hello124",
		});
		expect(mockResponse.send).toHaveBeenCalledTimes(1);
	});

	it("should call sendStatus with 404 when user not found", () => {
		const copyMockRequest = { ...mockRequest, findUserIndex: 100 };
		getUserByIdHandler(copyMockRequest, mockResponse);
		expect(mockResponse.sendStatus).toHaveBeenCalled();
		expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
		expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
		expect(mockResponse.send).not.toHaveBeenCalled();
	});
});

describe("create users", () => {
	const mockRequest = {};
	it("should return status of 400 when there are errors", async () => {
		await createUserHandler(mockRequest, mockResponse);
		expect(validator.validationResult).toHaveBeenCalled();
		expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
	});

	it("should return status of 201 and the user created", async () => {
		jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
		}));

		const saveMethod = jest
			.spyOn(User.prototype, "save")
			.mockResolvedValueOnce({
				id: 1,
				username: "test",
				password: "hashed_password",
				displayName: "test_name",
			});
		await createUserHandler(mockRequest, mockResponse);
		expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
		expect(helpers.hashPassword).toHaveBeenCalledWith("password");
		expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
		expect(User).toHaveBeenCalledWith({
			username: "test",
			password: "hashed_password",
			displayName: "test_name",
		});

		expect(saveMethod).toHaveBeenCalled();
		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.send).toHaveBeenCalledWith({
			id: 1,
			username: "test",
			password: "hashed_password",
			displayName: "test_name",
		});
	});

	it("send status of 400 when database fails to save user", async () => {
		jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
		}));
		const saveMethod = jest
			.spyOn(User.prototype, "save")
			.mockImplementationOnce(() => Promise.reject("Failed to save user"));
		await createUserHandler(mockRequest, mockResponse);
		expect(saveMethod).toHaveBeenCalled();
		expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
	});
});
