import styles from "./ModalAddMenu.module.scss";
import { ModalEmpty } from "../../../../components/4-templates/ModalEmpty";
import IconAddFile from "../../../../assets/icons/AddFile.svg";
import { Text } from "../../../../components/1-atoms/Text";
import { Button } from "../../../../components/2-molecules/Button/Button";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { PDFDocument, PDFImage, rgb } from "pdf-lib";
import htmlToImage from "html-to-image";
import OpenAI from "openai";
import { Authorization } from "../../../../constants/enviroments";
import { Input } from "../../../../components/1-atoms/Input";
import axios from "axios";
import { MenuType } from "../../../../types/api/SaveMenu";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import { A_SET_MENU } from "../../../../redux/menus/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ModalAddMenuProps = {
  onClose(): void;
};

type FilesToUploadType = {
  type: "pdf" | "image";
  file: File;
};

export const ModalAddMenu = ({ onClose }: ModalAddMenuProps) => {
  const dispatch = useAppDispatch();
  const menusStore = useAppSelector((store) => store.menu);

  const [filesToUpload, setFilesToUpload] = useState<FilesToUploadType[]>([]);
  const [filesThumbnails, setFilesThumbnails] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const openai = new OpenAI({
    organization: "org-8W6RRZCawHmb7sskzupRra1X",
    apiKey: Authorization,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  }, []);

  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileRef.current!.click();
  };

  const handleFileChange: ChangeEventHandler = async (e) => {
    try {
      const file = (e.target as any).files[0];
      console.log(file);

      if (file === undefined) return;

      // if (file.type === "application/pdf") {
      //   getPDFThumbnail(file);
      //   return;
      // }

      if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "application/pdf"
      ) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setFilesToUpload([...filesToUpload, { type: "image", file: file }]);
          setFilesThumbnails([...filesThumbnails, reader.result! as string]);
        };

        if (file) {
          reader.readAsDataURL(file);
        }

        console.log(file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPDFThumbnail = async (file: any) => {
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const buffer = fileReader.result;
      const pdf = await getDocument({ data: buffer! }).promise;
      const page = await pdf.getPage(1);
      const scale = 0.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context!,
        viewport: viewport,
      }).promise;

      const imageUrl = canvas.toDataURL("image/jpeg");

      setFilesToUpload([...filesToUpload, { type: "pdf", file: file }]);
      setFilesThumbnails([...filesThumbnails, imageUrl]);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const mergePDFsAndImages = async () => {
    setIsLoading(true);
    const mergedDoc = await PDFDocument.create();

    // Merge PDFs
    for (const fileItem of filesToUpload) {
      if (fileItem.type === "pdf") {
        const pdfBytes = await fileItem.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      if (fileItem.type === "image") {
        console.log(fileItem.file.name);
        if (fileItem.file.name.endsWith(".pdf")) {
          const pdfBytes = await fileItem.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach((page) => mergedDoc.addPage(page));
        } else {
          const imageUrl = URL.createObjectURL(fileItem.file);
          const image = new Image();
          image.src = imageUrl;
          await new Promise((resolve) => {
            image.onload = resolve;
          });

          const imageData = await convertImageToPdf(image);
          const pdfImage = await mergedDoc.embedPng(imageData);

          const imagePage = await mergedDoc.addPage();
          const aspectRatio = image.width / image.height;
          const maxWidth = imagePage.getSize().width - 100; // Ajustar según el margen deseado
          const maxHeight = imagePage.getSize().height - 100; // Ajustar según el margen deseado
          let width = image.width;
          let height = image.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
              width = maxWidth;
              height = width / aspectRatio;
            } else {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }

          imagePage.drawImage(pdfImage, {
            x: (imagePage.getWidth() - width) / 2,
            y: (imagePage.getHeight() - height) / 2,
            width: width,
            height: height,
          });
        }
      }
    }

    const mergedPdfData = await mergedDoc.save();

    descargarArchivo(new Blob([mergedPdfData], { type: "application/pdf" }));
  };

  const convertImageToPdf = async (image: HTMLImageElement): Promise<Uint8Array> => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      const imgBytes = await fetch(dataUrl).then((res) => res.blob());
      return new Uint8Array(await imgBytes.arrayBuffer());
    } else {
      throw new Error("Canvas context is not supported");
    }
  };

  const descargarArchivo = async (mergedPdfData: Blob) => {
    try {
      const name = inputRef.current?.value;

      if (name === undefined || name.trim().length === 0) {
        alert("Llena el nombre del menú");
        setIsLoading(false);
        return;
      }

      const blob = new Blob([mergedPdfData], { type: "tipo/mime" });
      const nombreArchivo = name + ".pdf";

      // Crear un nuevo objeto File a partir del Blob
      const currentFile = new File([blob], nombreArchivo);

      const file = await openai.files.create({
        file: currentFile,
        purpose: "assistants",
      });

      const generate_code_schema = {
        type: "object",
        properties: {
          notes: {
            type: "string",
            description: "Resumen sobre productos, precios o items no encontrados",
          },
          data: {
            type: "array",
            description: "Lista de objetos que contienen información sobre usuarios, comidas, precios y observaciones.",
            items: {
              type: "object",
              properties: {
                usuario: {
                  type: "string",
                  description: "Nombre del usuario.",
                },
                comida: {
                  type: "string",
                  description: "Nombre del platillo consumido.",
                },
                precio: {
                  type: "number",
                  description: "Precio del platillo consumido.",
                },
                observacion: {
                  type: "string",
                  description: "Nota adicional relevante.",
                },
              },
              required: ["usuario", "comida", "precio"],
            },
          },
        },
        required: ["description", "data"],
      };

      const assistant = await openai.beta.assistants.create({
        name: name,
        description: name,
        model: "gpt-4-turbo-preview",
        instructions:
          // 'El usuario te brindará una serie de datos que incluyen usuarios con sus nombres que pueden ser nombre o nombre y apellido, también el nombre de un platillo el cual buscarás en la carta con su respectivo precio.
          // Cuando el usuario mencione un grupo de personas indicando que compartieron un platillo dividirás el costo de ese platillo entre la cantidad de participantes.
          // Con toda esa información únicamente responderás con un objeto que contenga el objeto: con propiedad "description" en el cual darás información de algo que no localizas u otra que consideres necesaria,
          // otra propiedad llamada "data" el cual será un array en el cual listarás objetos con las propiedades "usuario" con los nombres del usuario , "comida" con unicamente solo una comida por item, "precio" con el precio base de la comida pero solo si se indicó que es una variante tomar el precio de la variante respectiva, y si es necesario un campo llamado "observación" en el cual mostrarás alguna nota que se tenga que tener en cuenta para el resultado final porque recuerda que un producto puede ser consumido entre muchos.',
          `El usuario te brindará una serie de datos que incluyen usuarios con sus nombres que pueden ser nombre o nombre y apellido, también el nombre de un platillo el cual buscarás en la carta con su respectivo precio. 
          Cuando el usuario mencione un grupo de personas indicando que compartieron un platillo dividirás el costo de ese platillo entre la cantidad de participantes que lo consumieron. 
          Con toda esa información responderá con una breve resumen antes de entregar la siguiente lista que contenga por item:
          * Nombres del usuario el cual puede ser listado tantas veces sea necesario
          * La comida donde en caso el platillo sea consumido por varios generar un item por cada usuario indicando la razón y el precio a pagar por cada uno pero si el mismo usuario pidio varias comidas solo mostrar una comida por item listado y no varias
          * El precio a pagar por la comida el cual siempre será el precio base sin ninguna variación o adicional a menos que se indique lo contrario
          * Una observación donde colocarás  alguna nota que se tenga que tener en cuenta para el resultado final porque recuerda que un producto puede ser consumido entre muchos o cuando no se encuentra el platillo mencionado en la carta pero si el item no muestra observaciones solo responer con 'Todo bien' o similar en ese item
          `,
        tools: [
          { type: "retrieval" },
          {
            type: "function",
            function: {
              name: "generate_code",
              description: "generates code and description in JSON format. used by code assistants",
              parameters: generate_code_schema,
            },
          },
        ],
        file_ids: [file.id],
      });

      const urlencoded = new URLSearchParams();
      urlencoded.append(
        "data",
        JSON.stringify({
          menuName: name,
          assistant: {
            description: assistant.description,
            file_ids: assistant.file_ids,
            id: assistant.id,
            instructions: assistant.instructions,
            model: assistant.model,
            name: assistant.model,
          },
          file: {
            id: file.id,
            name: file.filename,
          },
        } as MenuType),
      );

      axios.post("http://localhost:3000/api/utils/cip/save-menu", urlencoded, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      dispatch(
        A_SET_MENU([
          ...menusStore.menus,
          {
            menuName: name,
            assistant: {
              description: assistant.description!,
              file_ids: assistant.file_ids,
              id: assistant.id,
              instructions: assistant.instructions!,
              model: assistant.model,
              name: assistant.model,
            },
            file: {
              id: file.id,
              name: file.filename,
            },
          },
        ]),
      );

      toast.success("El menú se guardó con éxito", { autoClose: 2500 });
      onClose();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <ModalEmpty
      onClose={() => {
        if (isLoading) return;
        onClose();
      }}
      title={"Creando menú"}
    >
      <div className={styles["container"]}>
        {filesToUpload.length === 0 ? (
          <div className={styles["empty-files"]} onClick={handleClick}>
            <img src={IconAddFile} alt="" />

            <Text color="black" size="20" weight="medium">
              Presiona para subir el pdf o imágenes del menú
            </Text>
          </div>
        ) : (
          <div className={styles["loaded-files"]}>
            {filesToUpload.map((v, i) => {
              return (
                <div className={styles["file-preview"]} key={uuidv4()}>
                  <img src={filesThumbnails[i]} alt="" />
                </div>
              );
            })}

            <div className={styles["icon-add"]} onClick={handleClick}>
              <Text color="white" weight="bold" size="26">
                +
              </Text>
            </div>
          </div>
        )}

        <Input ref={inputRef} placeholder="Ingresa nombre del menu" />

        <div className={styles["actions"]}>
          <Button bgColor="green-light" onClick={mergePDFsAndImages} disabled={isLoading}>
            {isLoading ? "Cargando" : "Guardar"}
          </Button>
          <Button
            bgColor="red"
            onClick={() => {
              if (isLoading) return;
              onClose();
            }}
            disabled={isLoading}
          >
            Cerrar
          </Button>
        </div>

        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".pdf, .png, .jpg, .jpeg"
        />
      </div>
      <ToastContainer />
    </ModalEmpty>
  );
};
