import { monotonicFactory } from "ulid";  

const ulid = monotonicFactory();

export const generateId = (): string => {
  return ulid();  
};
