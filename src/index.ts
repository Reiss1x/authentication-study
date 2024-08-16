import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./Routes";



AppDataSource.initialize().then(() => {
    const app = express();
    app.use(express.json());
    app.use(routes)
    return app.listen(3000, () => {console.log("Express initialized.");});
})
