import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message, Space, Tag } from "antd";
import { useState } from "react";
import Head from "next/head";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function DESTriple() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ encoding: "", text: "", bytes: "" });

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/crypto/3des", {
          method: "POST",
          body: JSON.stringify({ ...values, type: t }),
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
      <Head>
        <title>3DES - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>3DES</h1>
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
          initialValue={"plaintext"}
        >
          <Radio.Group>
            <Radio value="plaintext">明文</Radio>
            <Radio value="hex">Hex</Radio>
            <Radio value="base64">Base64</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="加密模式" name="mode" required initialValue={"cbc"}>
          <Radio.Group>
            <Radio value="cbc">CBC</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="加解密钥"
          name="key"
          required
          rules={[{ type: "string", len: 24 }]}
          tooltip="目前仅支持明文密钥"
        >
          <TextArea placeholder="密钥字符串, 仅支持明文" rows={1} />
        </Form.Item>
        <Form.Item
          label={
            <>
              计算结果
              {result.encoding && <Tag color="red">{result.encoding}</Tag>}
            </>
          }
        >
          <TextArea placeholder="加解密结果" rows={4} value={result.text} />
          <div style={{ marginTop: "8px" }}>
            二进制: {result.bytes.length > 0 && result.bytes}
          </div>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "encrypt")}>
              加密
            </Button>
            <Button onClick={(e) => onFinish(e, "decrypt")}>解密</Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
