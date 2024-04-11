import promisePool from "../../utils/database.js";

const listAllCats = async () => {
  const [rows] = await promisePool.query("SELECT * FROM wsk_cats");
  console.log("rows", rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM wsk_cats WHERE cat_id = ?",
    [id],
  );
  const owner = await promisePool.execute(
    "SELECT name FROM wsk_users WHERE user_id = ?",
    [rows[0].owner],
  );
  rows[0].owner = owner[0];
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (cat) => {
  const { cat_name, weight, owner, file, birthdate } = cat;
  console.log(cat_name);
  console.log(file);
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [
    cat_name || "Cat_doe",
    weight || 0,
    owner || 1,
    file || "No_file",
    birthdate || new Date("1970-01-01"),
  ].map((arvo) => {
    if (arvo === undefined) {
      return null;
    } else {
      return arvo;
    }
  });
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const modifyCat = async (cat) => {
  const { cat_name, cat_id, weight, owner, filename, birthdate } = cat;
  let sqlQuery = "UPDATE wsk_cats SET";

  let setClauses = [];
  if (cat_name) setClauses.push(` cat_name = '${cat_name}'`);
  if (weight) setClauses.push(` weight = ${weight}`);
  if (owner) setClauses.push(` owner = ${owner}`);
  if (filename) setClauses.push(` filename = '${filename}'`);
  if (birthdate) setClauses.push(` birthdate = ${birthdate}`);

  sqlQuery += setClauses.join(", ");
  sqlQuery += ` WHERE cat_id = ${cat_id}`;

  const rows = await promisePool.execute(sqlQuery);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeCat = async (id) => {
  const [rows] = await promisePool.execute(
    "DELETE FROM wsk_cats WHERE cat_id = ?",
    [id],
  );
  console.log("rows", rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

export { listAllCats, findCatById, addCat, modifyCat, removeCat };
