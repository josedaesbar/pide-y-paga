export type MenuType = {
  id?: string;
  menuName: string;
  file: {
    id: string;
    name: string;
  };
  assistant: {
    id: string;
    file_ids: string[];
    instructions: string;
    description: string;
    name: string;
    model: string;
  };
};
