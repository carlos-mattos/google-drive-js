import { describe, test, expect, jest } from "@jest/globals";
import fs from "fs";
import FileHelper from "../../src/fileHelper.js";

describe("#FileHelper", () => {
  describe("#getFileStatus", () => {
    test("it should return files statuses in correct format", async () => {
      const statMock = {
        dev: 2050,
        mode: 33188,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 11799666,
        size: 1195211,
        blocks: 2336,
        atimeMs: 1631395061572,
        mtimeMs: 1631475043751,
        ctimeMs: 1631475043747.618,
        birthtimeMs: 1631395061572.095,
        atime: "2021-09-11T21:17:41.572Z",
        mtime: "2021-09-12T19:30:43.751Z",
        ctime: "2021-09-12T19:30:43.748Z",
        birthtime: "2021-09-11T21:17:41.572Z",
      };

      const mockUser = "ceamattos";
      process.env.USER = mockUser;

      const fileName = "file.gif";

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([fileName]);

      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus("/tmp");

      const expectedResult = [
        {
          size: "1.2 MB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: fileName,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${fileName}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
