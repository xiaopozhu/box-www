import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message, Space } from "antd";
import { useState } from "react";
import Head from "next/head";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function SHA1() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ text: "", bytes: "" });

  const onFinish = (values: any) => {
    request("/api/v1/codec/aes", {
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
      <Head>
        <title>AES - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>AES</h1>
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
          label="加解密钥"
          name="key"
          required
          rules={[{ type: "string", min: 1 }]}
        >
          <TextArea placeholder="密钥字符串, 编码与待计算值相同" rows={1} />
        </Form.Item>
        <Form.Item label="加密模式" name="mode" required initialValue={"cbc"}>
          <Radio.Group>
            <Radio value="cbc">CBC</Radio>
            <Radio value="cfb">CFB</Radio>
            <Radio value="ctr">CTR</Radio>
            <Radio value="gcm">GCM</Radio>
            <Radio value="ofb">OFB</Radio>
          </Radio.Group>
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
            value={result.text}
          />
          <div style={{ marginTop: "8px" }}>
            二进制: {result.bytes.length > 0 && result.bytes}
          </div>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e)}>
              加密
            </Button>
            <Button onClick={(e) => onFinish(e)}>解密</Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
