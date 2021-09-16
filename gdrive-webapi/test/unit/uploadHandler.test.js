import { describe, test, expect, jest } from "@jest/globals";
import UploadHandler from "../../src/uploadHandler";
import TestUtil from "../_util/testUtil";
import fs from "fs";

describe("#UploadHandler", () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {},
  };

  describe("#registerEvents", () => {
    test("should call onFile and onFinish functions on Busboy instance", () => {
      const uploadHandler = new UploadHandler({ io: ioObj, socketID: "01" });

      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue();

      const headers = {
        "content-type": "multipart/form-data; boundary=",
      };

      const onFinish = jest.fn();

      const busboyInstance = uploadHandler.registerEvents(headers, onFinish);

      const fileStream = TestUtil.generateReadableStream([
        "chunk",
        "of",
        "data",
      ]);

      busboyInstance.emit("file", "fieldname", fileStream, "filename.txt");

      busboyInstance.listeners("finish")[0].call();

      expect(uploadHandler.onFile).toHaveBeenCalled();
      expect(onFinish).toHaveBeenCalled();
    });
  });

  describe("#onFIle", () => {
    test("given a stream file it should save it on disk", async () => {
      const chunks = ["hey", "dude"];
      const downloadsFolder = "/tmp";
      const handler = new UploadHandler({
        io: ioObj,
        socketID: "01",
        downloadsFolder,
      });

      const onData = jest.fn();

      jest
        .spyOn(fs, fs.createWriteStream.name)
        .mockImplementation(() => TestUtil.generateReadableStream(onData));

      //56:15
      // jest.spyOn(handler, handler.handleFileBytes.name).
    });
  });
});
