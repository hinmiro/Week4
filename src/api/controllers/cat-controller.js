import { addCat, findCatById, listAllCats } from "../models/cat-model.js";

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  const result = addCat(req.body);
  console.log("form data:", req);
  console.log("file data:", req.file);
  console.log(req.body);
  if (result.cat_id) {
    res.status(201).json({ message: "New cat added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  // not implemented in this example, this is future homework
  res.sendStatus(200);
};

const deleteCat = (req, res) => {
  // not implemented in this example, this is future homework
  res.sendStatus(200);
};

export { getCat, getCatById, postCat, putCat, deleteCat };
