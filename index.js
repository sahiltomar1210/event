const express = require("express");
const app = express();
const data = require("./src/dummydata");

app.use(express.json());

app.get("/v1/events", (req, res) => {
  try {
    res.status(200).send(data);
  } catch (e) {
    req.status(200).json(e.message);
  }
});
app.post("/v1/events", async (req, res) => {
  try {
    let title = req.body.title;
    let description = req.body.description;
    let location = req.body.location;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let updateid = data.length;
    if (title == "") {
      res.status(400).json({
        error: "Validation error:title is required",
      });
    } else if (description == "") {
      res.status(400).json({
        error: "Validation error:description is required",
      });
    } else if (location == "") {
      res.status(400).json({
        error: "Validation error:location is required",
      });
    } else if (startTime == "" || endTime == "") {
      res.status(400).json({
        error: "Validation error:time is required",
      });
    } else {
      let complete = await data.push({
        id: updateid + 1,
        title: title,
        description: description,
        location: location,
        startTime: startTime,
        endTime: endTime,
      });
      if (complete) {
        let updateid = data.length;
        res.status(201).json({
          updateid,
        });
      }
    }
  } catch (e) {
    res.send(e.message);
  }
});
app.get("/v1/events/:id", (req, res) => {
  try {
    const idx = data.findIndex((obj) => obj.id == req.params.id);
    if (idx == -1) {
      return res.status(404).json({
        error: "There is no event with that id",
      });
    } else {
      res.json({
        status: 200,
        data: data[idx],
      });
    }
  } catch (e) {
    res.status(404).json({
      message: e.message,
    });
  }
});
app.delete("/v1/events/:id", async (req, res) => {
  try {
    const idx = data.findIndex((obj) => obj.id == req.params.id);
    if (idx == -1) {
      return res.status(404).json({
        status: "Failure",
        message: "There is no event with that id",
      });
    }
    data.splice(idx, 1);
    res.status(204).json({
      status: 204,
      messgae: "record deleted",
    });
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
});
app.put("/v1/events/:id", async (req, res) => {
  try {
    const idx = data.findIndex((obj) => obj.id == req.params.id);
    if (idx == -1) {
      return res.status(404).json({
        status: 404,
        message: "There is no event with that id",
      });
    }
    if (req.body.title) data[idx].title = req.body.title;

    if (req.body.description) data[idx].description = req.body.description;

    if (req.body.location) data[idx].location = req.body.location;

    res.json({
      status: 200,
      data: data[idx],
    });
  } catch (e) {
    res.status(400).json({
      status: "Failure",
      message: e.message,
    });
  }
});
app.listen(8080, () => {
  console.log("server is running on port 8080");
});
