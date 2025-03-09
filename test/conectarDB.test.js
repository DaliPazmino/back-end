// test/conectarDB.test.js
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import conectarDB from "../config/db.js"; // Ajusta esta ruta si es necesario

// Mockeamos mongoose.connect
jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

// Mockeamos process.exit
const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

// Mockeamos console.log y console.error
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("conectarDB", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MONGO_URL = "mongodb://localhost:27017/test"; // Simulamos variable de entorno
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockExit.mockRestore();
  });

  it("should connect to MongoDB successfully", async () => {
    mongoose.connect.mockResolvedValueOnce("connected"); // Simulamos conexión exitosa

    await conectarDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/test"
    );
    expect(console.log).toHaveBeenCalledWith("MongoDB conectado");
    expect(console.error).not.toHaveBeenCalled();
    expect(process.exit).not.toHaveBeenCalled();
  });

  it("should handle connection error", async () => {
    const error = new Error("Connection failed");
    mongoose.connect.mockRejectedValueOnce(error); // Simulamos fallo en la conexión

    await conectarDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/test"
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error al conectar MongoDB:",
      error
    );
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.log).not.toHaveBeenCalled();
  });
});
