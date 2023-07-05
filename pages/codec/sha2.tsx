import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, Space, message } from "antd";
import { useState } from "react";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function SHA2() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ hash: "", bytes: "" });

  const onFinish = (e: any, s: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/sha2", {
          method: "POST",
          body: JSON.stringify({ ...values, size: s }),
        })
          .then((resp) => {
            if (resp.code !== 0) return message.error(resp.error);
            setResult(resp.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <h1>SHA2</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="待计算值"
          name="text"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea placeholder="待计算字符串" rows={4} />
        </Form.Item>
        <Form.Item
          label="字符格式"
          name="encoding"
          required
          initialValue={"plain"}
        >
          <Radio.Group>
            <Radio value="plain">明文</Radio>
            <Radio value="hex">Hex</Radio>
            <Radio value="base64">Base64</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="计算结果">
          <TextArea
            placeholder="十六进制结果 (Hex)"
            rows={4}
            value={result.hash}
          />
          <div style={{ marginTop: "8px" }}>
            中间值：{result.bytes.length > 0 && result.bytes}
          </div>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "256")}>
              SHA-256
            </Button>
            <Button onClick={(e) => onFinish(e, "224")}>SHA-224</Button>
            <Button onClick={(e) => onFinish(e, "384")}>SHA-384</Button>
            <Button onClick={(e) => onFinish(e, "512")}>SHA-512</Button>
            <Button onClick={(e) => onFinish(e, "512/224")}>SHA-512/224</Button>
            <Button onClick={(e) => onFinish(e, "512/256")}>SHA-512/256</Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
