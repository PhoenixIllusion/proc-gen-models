import { openDB, DBSchema } from 'idb';
import { BuildStep, ProcItem } from './model';

interface MyDB extends DBSchema {
  'proc-items': {
    value: ProcItem<BuildStep>;
    key: string;
  };
}

const db = openDB<MyDB>('proc-items', 1, {
  upgrade(db) {
    db.createObjectStore('proc-items', {
      keyPath: 'id',
    });
  },
});

const getItems = async () => {
  const database = await db;
  return database.getAll('proc-items')
}
const updateItem = async (item: ProcItem<BuildStep>) => {
  const database = await db;
  database.put('proc-items',item);
}
const deleteItem = async (item: ProcItem<BuildStep>) => {
  const database = await db;
  database.delete('proc-items', item.id);
}

export { getItems, updateItem, deleteItem }