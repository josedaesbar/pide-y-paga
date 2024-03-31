export type MenuChatResponse = {
  notes?: string;
  data: {
    usuario: string;
    comida: string;
    precio: string | number;
    observacion: string;
    pagado?: string;
  }[];
};
