export const create001DefaultData = () => {
  const data = Array.from({ length: 20000 }).map((_, index) => ({
    id: `item-${index + 1}`,
    state: {
      name: `Item ${index + 1}`,
      value: Math.floor(Math.random() * 100),
    },
  }));
  return data;
};
