import { logger } from "./logger.js";
import FileHelper from "./fileHelper.js";
import { dirname, resolve } from "path";
import { fileURLToPath, parse } from "url";
import UploadHandler from "./uploadHandler.js";
import { pipeline } from "stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirname, "../", "downloads");

export default class Routes {
  downloadsFolder;

  constructor(downloadsFolder = defaultDownloadsFolder) {
    this.downloadsFolder = downloadsFolder;
    this.fileHelper = FileHelper;
    this.io = {};
  }

  setSocketInstance(io) {
    this.io = io;
  }

  handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const chosen = this[req.method.toLowerCase()] || this.defaultRoute;

    return chosen.apply(this, [req, res]);
  }

  async defaultRoute(req, res) {
    res.end("Hello World");
  }

  async options(req, res) {
    res.writeHead(204);
    res.end();
  }

  async post(request, response) {
    const { headers } = request;

    const {
      query: { socketId },
    } = parse(request.url, true);
    const uploadHandler = new UploadHandler({
      socketId,
      io: this.io,
      downloadsFolder: this.downloadsFolder,
    });

    const onFinish = (response) => () => {
      response.writeHead(200);
      const data = JSON.stringify({ result: "Files uploaded with success!" });
      response.end(data);
    };

    const busboyInstance = uploadHandler.registerEvents(
      headers,
      onFinish(response)
    );

    await pipeline(request, busboyInstance);

    logger.info("Request finished with success!");
  }

  async get(req, res) {
    const files = await this.fileHelper.getFilesStatus(this.downloadsFolder);

    res.writeHead(200);

    res.end(JSON.stringify(files));
  }
}
