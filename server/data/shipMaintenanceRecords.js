const records = [];
let nextId = 1;

export function listByUser(userId) {
  return records.filter((r) => r.userId === userId);
}

export function addRecord(record) {
  const created = { id: nextId++, ...record };
  records.push(created);
  return created;
}

export function updateRecord(id, userId, updates) {
  const record = records.find((r) => r.id === id && r.userId === userId);
  if (!record) {
    return null;
  }
  Object.assign(record, updates);
  return record;
}

export function deleteRecord(id, userId) {
  const index = records.findIndex((r) => r.id === id && r.userId === userId);
  if (index === -1) {
    return false;
  }
  records.splice(index, 1);
  return true;
}
