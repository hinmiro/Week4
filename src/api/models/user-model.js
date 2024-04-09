const userItems = [
  {
    user_id: 3609,
    name: "John Doe",
    username: "johndoe",
    email: "john@metropolia.fi",
    role: "user",
    password: "password",
  },

  {
    user_id: 3622,
    name: "Gary Doe",
    username: "garydoe",
    email: "gary@metropolia.fi",
    role: "user",
    password: "password",
  },

  {
    user_id: 3633,
    name: "Doe Joe",
    username: "doejoe",
    email: "doe@metropolia.fi",
    role: "user",
    password: "password",
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const { name, username, email, role, password } = user;
  const newId = userItems[0].user_id + 1;
  userItems.unshift({
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  });
  return { user_id: newId };
};

const updateUser = (id, field, value) => {
  const user = findUserById(id);
  console.log(user);
  switch (field) {
    case "name":
      user.name = value;
      break;
    case "username":
      user.username = value;
      break;
    case "email":
      user.email = value;
      break;
    case "role":
      user.role = value;
      break;
    case "password":
      user.password = value;
      break;
    default:
      console.log("I am teapot!");
      break;
  }
  console.log(user);
  return user;
};

export { listAllUsers, addUser, findUserById, updateUser };