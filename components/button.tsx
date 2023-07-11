import { message, Tooltip } from "antd";

interface Props {
  text: string;
}

export default function CopyBtn(props: Props) {
  const { text } = props;

  const onClick = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("复制成功");
      })
      .catch((e) => {
        message.error(`复制失败: ${e}`);
      });
  };
  return (
    <Tooltip title="复制到剪贴板">
      <span onClick={onClick} style={{ cursor: "pointer" }}>
        {text}
      </span>
    </Tooltip>
  );
}
