import { Text } from "../../components/1-atoms/Text";
import styles from "./styles.module.scss";

import { useAppDispatch, useAppSelector } from "../../redux";

import { useNavigate } from "react-router-dom";
import { Button } from "../../components/2-molecules/Button/Button";
import { Input } from "../../components/1-atoms/Input";
import OpenAI from "openai";
import { Authorization } from "../../constants/enviroments";
import { useEffect, useRef, useState } from "react";
import { getClassnames } from "../../utils/getClassnames";
import { Thread } from "openai/resources/beta/threads/threads";
import { MoonLoader } from "react-spinners";
import { MenuChatResponse } from "../../types/models/menu-chat";

import IMG_Robot from "../../assets/img/robot.webp";
import IMG_User from "../../assets/img/user.webp";
import { TextHtml } from "../../components/1-atoms/TextHtml";
import { ChatExcelDownload } from "./components/ChatExcelDownload";
import { v4 as uuidv4 } from "uuid";
import { VoiceToTextButton } from "./components/VoiceToTextButton";
import { TextArea } from "../../components/1-atoms/TextArea";

type ChatType = {
  role: "user" | "system" | "json-data";
  content: string | null;
  jsonData?: MenuChatResponse;
};

export const Menu = () => {
  const navigate = useNavigate();

  const menusStore = useAppSelector((store) => store.menu);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState<string>("");

  const [threadData, setThreadData] = useState<Thread | null>(null);
  const [conversation, setConversation] = useState<ChatType[]>([
    { role: "system", content: "Hola, cual es tu consulta para el menú " + menusStore.menuSelected?.menuName + "?" },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const openai = new OpenAI({
    organization: "org-8W6RRZCawHmb7sskzupRra1X",
    apiKey: Authorization,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (menusStore.menuSelected === null) navigate("/");

    createThread();
  }, []);

  const createThread = async () => {
    setIsLoading(true);
    const thread = await openai.beta.threads.create();
    setThreadData(thread);
    setIsLoading(false);
  };

  const sendRequest = async () => {
    try {
      const userMessage = inputText;
      if (userMessage.trim() === "") {
        return;
      }

      setIsLoading(true);
      setInputText("");
      inputRef.current!.value = "";

      setConversation([...conversation, { role: "user", content: userMessage }, { role: "system", content: null }]);

      await openai.beta.threads.messages.create(threadData!.id, {
        role: "user",
        content: userMessage,
      });

      const run = await openai.beta.threads.runs.create(threadData!.id, {
        assistant_id: menusStore.menuSelected!.assistant.id,
      });

      checkStatus(threadData!.id, run.id, userMessage);
    } catch (error) {
      console.log(error);
    }
  };

  const checkStatus = async (thread: string, run: string, userMessage: string) => {
    try {
      let status = "";
      let responseJson = "";
      while (status !== "completed" && status !== "failed") {
        const runResult = await openai.beta.threads.runs.retrieve(thread, run);

        status = runResult.status;

        if (runResult.status !== "completed") {
          // Esperar un tiempo antes de verificar de nuevo
          await new Promise((resolve) => setTimeout(resolve, 3500));
        }

        if (runResult.status === "requires_action") {
          await openai.beta.threads.runs.submitToolOutputs(threadData!.id, run, {
            tool_outputs: [
              {
                tool_call_id: runResult.required_action?.submit_tool_outputs.tool_calls[0].id,
                output: runResult.required_action?.submit_tool_outputs.tool_calls[0].function.arguments,
              },
            ],
          });

          responseJson = runResult.required_action?.submit_tool_outputs.tool_calls[0].function.arguments!;
        }
      }

      if (status === "failed") {
        return;
      }

      const messages = await openai.beta.threads.messages.list(thread);
      setIsLoading(false);

      setConversation([
        ...conversation,
        {
          role: "user",
          content: userMessage,
        },
        {
          role: "system",
          content: (messages.data[0].content[0] as any).text.value
            .replace(/【\d+†source】/g, "")
            .replace(/\n/g, "<br />"),
        },
        {
          role: "json-data",
          content: "",
          jsonData: responseJson !== "" ? JSON.parse(responseJson) : JSON.parse('{ "data": [] }'),
        },
      ]);
    } catch (error) {
      setIsLoading(false);
      setConversation([...conversation]);
      console.log(error);
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <Text TypeText="h1" size="24" weight="medium" color="white">
          Pide y paga
        </Text>
      </div>

      <div className={styles["menu-title"]}>
        <Button bgColor="red-black" color="white" pointer={false}>
          {menusStore.menuSelected?.menuName}
        </Button>
      </div>

      <div className={styles["chat-container"]}>
        {/* {loadingResponse === true && <p style={{ color: "#FFF" }}>Cargando respuesta</p>} */}
        {conversation.map((v, i) => {
          if (v.role === "json-data") {
            if (v.jsonData && v.jsonData.data.length > 0)
              return <ChatExcelDownload key={uuidv4()} dataDownload={v.jsonData!} />;
          } else {
            return (
              <div className={getClassnames([styles["conversation-item"]])} key={uuidv4()}>
                <div className={styles["user-icon"]}>
                  <img src={v.role === "user" ? IMG_User : IMG_Robot} alt="" />
                </div>

                {v.content === null ? (
                  <div className={styles["spinner"]}>
                    <MoonLoader size={"50"} />
                  </div>
                ) : (
                  <TextHtml TypeText="p" weight="regular" size="16" html={v.content} />
                )}
              </div>
            );
          }
        })}
      </div>

      {threadData === null ? (
        <div className={styles["spinner"]}>
          <MoonLoader />
        </div>
      ) : (
        <div className={styles["actions"]}>
          <TextArea ref={inputRef} placeholder="Ingresa consulta" onChange={setInputText} value={inputText} />
          <Button bgColor="green-light" color="white" onClick={sendRequest} disabled={isLoading}>
            Enviar
          </Button>

          <VoiceToTextButton isLoading={isLoading} setValue={setInputText} value={inputText} />
        </div>
      )}
    </div>
  );
};
