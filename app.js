import express from "express";
const hostname = "127.0.0.1";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/api/v1/cat", (req, res) => {
  const cat = {
    cat_id: 1,
    name: "Miu",
    birthdate: "01.01.2024",
    weight: 5.3,
    owner: "Miro",
    image: "https://loremflickr.com/320/240/cat",
  };
  res.send(cat);
});

app.use("/public/", express.static("public"));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
