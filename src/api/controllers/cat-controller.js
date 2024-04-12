import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
} from "../models/cat-model.js";

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

const postCat = async (req, res) => {
  const result = await addCat(req.body, req.file);
  if (result) {
    res.status(201).json({ message: "New cat added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  console.log(req.body);
  const result = await modifyCat(req.body, req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({ message: "Cat modification succeeded.", result });
  } else {
    res.sendStatus(400);
  }
};

const deleteCat = async (req, res) => {
  const result = await removeCat(req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({ message: "Cat removed successfully", result });
  } else {
    res.sendStatus(400);
  }
};

export { getCat, getCatById, postCat, putCat, deleteCat };
