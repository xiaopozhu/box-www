import { request } from "@/utils/request";
import {
  Divider,
  Form,
  Input,
  Button,
  Radio,
  Space,
  message,
  InputNumber,
} from "antd";
import { useState } from "react";
import Head from "next/head";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function BLAKE2b() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ hash: "", bytes: "" });

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/blake2b", {
          method: "POST",
          body: JSON.stringify({ ...values }),
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

  const normalizeSize = (val: any) => {
    return val.toString();
  };

  return (
    <>
      <Head>
        <title>BLACK2b - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>BLAKE2b</h1>
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
          label="计算长度"
          name="size"
          rules={[{ required: true }]}
          initialValue={"256"}
          normalize={normalizeSize}
        >
          <InputNumber max={512} min={8} step={8} />
        </Form.Item>
        <Form.Item
          label="可选密钥"
          name="key"
          rules={[{ type: "string", min: 1 }]}
        >
          <TextArea placeholder="密钥字符串, 编码与待计算值相同" rows={1} />
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
            中间值: {result.bytes.length > 0 && result.bytes}
          </div>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e)}>
              BLAKE2b
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
