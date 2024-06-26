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

const addCat = async (cat, file) => {
  const { cat_name, weight, owner, birthdate } = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;

  const params = [cat_name, weight || 0, owner, file.filename, birthdate].map(
    (arvo) => {
      if (arvo === undefined || arvo === null) {
        return null;
      } else {
        return arvo;
      }
    },
  );

  console.log("params", params);
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { cat_id: rows[0].insertId };
};

const modifyCat = async (cat, id, user) => {
  let sql = promisePool.format(
    `UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?`,
    [cat, id, user.user_id],
  );

  if (user.role === "admin") {
    sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
      cat,
      id,
    ]);
  }

  const rows = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeCat = async (id, user) => {
  let sql = promisePool.format(
    `DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?`,
    [id, user.user_id],
  );
  if (user.role === "admin") {
    sql = promisePool.format(`DELETE FROM wsk_cats WHERE cat_id = ?`, [id]);
  }
  const [rows] = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

export { listAllCats, findCatById, addCat, modifyCat, removeCat };
