const stack: string[] = [];

//helper function to add an item to the stack
const push = async (item: string): Promise<void> => {
  stack.push(item);
};

//helper function to get the top item from the stack and remove it
const pop = async (): Promise<string | null> => {
  return stack.length > 0 ? (stack.pop() as string) : null;
};

export default {
  push,
  pop,
};
