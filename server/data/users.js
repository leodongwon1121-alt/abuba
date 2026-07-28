const users = [];
let nextId = 1;

export function findByEmail(email) {
  return users.find((u) => u.email === email);
}

export function findById(id) {
  return users.find((u) => u.id === id);
}

export function addUser(user) {
  const record = { id: nextId++, ...user };
  users.push(record);
  return record;
}

export function updateUser(id, updates) {
  const user = findById(id);
  if (!user) {
    return null;
  }
  Object.assign(user, updates);
  return user;
}
