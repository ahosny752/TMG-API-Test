interface StoreManager {
  value: string;
  expiry: number | null;
}

const storeManagerMap = new Map<string, StoreManager>();
const ttlQueue: Array<{ key: string; expiry: number }> = [];

//helper function to add a key value pair to the store with optional ttl
const set = async (key: string, value: string, ttl?: number): Promise<void> => {
  const expiry = ttl ? Date.now() + ttl * 1000 : null;
  storeManagerMap.set(key, { value, expiry });

  if (ttl) {
    removeFromTTLQueue(key);

    if (expiry !== null) {
      ttlQueue.push({ key, expiry });
    }

    cleanUpExpiredKeys();
  }
};

//helper function to get a value by key
const get = async (key: string): Promise<string | null> => {
  const record = storeManagerMap.get(key);
  if (!record) return null;

  if (record.expiry && record.expiry < Date.now()) {
    storeManagerMap.delete(key);
    return null;
  }

  return record.value;
};

//helper function to delete a key
const deleteKey = async (key: string): Promise<boolean> => {
  removeFromTTLQueue(key);
  return storeManagerMap.delete(key);
};

//helper function to remove expired keys from the store in a batch to optimize performance
const cleanUpExpiredKeys = (): void => {
  const now = Date.now();
  while (ttlQueue.length > 0 && ttlQueue[0].expiry < now) {
    const expiredItem = ttlQueue.shift();
    storeManagerMap.delete(expiredItem!.key);
  }
};

//helper function to remove a key from the ttl queue so new keys with the same name can be added
const removeFromTTLQueue = (key: string): void => {
  const index = ttlQueue.findIndex((item) => item.key === key);
  if (index !== -1) {
    ttlQueue.splice(index, 1);
  }
};

export default {
  set,
  get,
  delete: deleteKey,
};
