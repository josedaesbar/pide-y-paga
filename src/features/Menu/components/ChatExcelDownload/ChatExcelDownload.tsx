import { MenuChatResponse } from "../../../../types/models/menu-chat";
import styles from "./ChatExcelDownload.module.scss";
import ExcelIcon from "../../../../assets/icons/ExcelIcon.svg";
import { Text } from "../../../../components/1-atoms/Text";
import FileSaver from "file-saver";
import { utils, write } from "xlsx";
import { useAppSelector } from "../../../../redux";

type ChatExcelDownloadProps = {
  dataDownload: MenuChatResponse;
};

export const ChatExcelDownload = ({ dataDownload }: ChatExcelDownloadProps) => {
  const menusStore = useAppSelector((store) => store.menu);

  const onClickDownload = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const currentData = [...dataDownload.data].map((v) => {
      return { ...v, pagado: "" };
    });

    const ws = utils.json_to_sheet(currentData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, menusStore.menuSelected?.menuName + "-" + new Date().getTime() + fileExtension);
  };

  return (
    <div className={styles["container"]} onClick={onClickDownload}>
      <div className={styles["icon"]}>
        <img src={ExcelIcon} alt="" />
      </div>

      <Text weight="medium" TypeText="p" size="16" color="black">
        Presiona para descargar
      </Text>
    </div>
  );
};
