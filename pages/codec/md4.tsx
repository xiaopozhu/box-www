import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message } from "antd";
import { useState } from "react";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function MD4() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ hash: "", bytes: "" });

  const onFinish = (values: any) => {
    request("/api/v1/codec/md4", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((resp) => {
        if (resp.code !== 0) return message.error(resp.error);
        setResult(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <h1>MD4</h1>
      </div>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
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
          <Button type="primary" htmlType="submit">
            MD4
          </Button>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
