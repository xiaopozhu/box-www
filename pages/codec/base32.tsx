import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, Space, message } from "antd";
import { useState } from "react";
import Head from "next/head";
import { FormContext } from "antd/es/form/context";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function Base32() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ text: "", bytes: "" });
  const [type, setType] = useState("encode");

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/base32", {
          method: "POST",
          body: JSON.stringify({ ...values, type: type }),
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
        <title>Base32 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Base32</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item label="编码解码" required>
          <Radio.Group
            onChange={(v) => {
              setType(v.target.value);
              form.resetFields();
              setResult({ text: "", bytes: "" });
            }}
            defaultValue={type}
          >
            <Radio value="encode">编码</Radio>
            <Radio value="decode">解码</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="待处理值"
          name="text"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea placeholder="待处理字符串" rows={4} />
        </Form.Item>
        {type === "encode" && (
          <Form.Item
            label="字符格式"
            name="encodeEncoding"
            required
            initialValue={"plain"}
          >
            <Radio.Group>
              <Radio value="plain">明文</Radio>
              <Radio value="hex">Hex</Radio>
              <Radio value="base64">Base64</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item label="计算结果">
          <TextArea
            placeholder={type === "encode" ? "编码结果" : "解码结果"}
            rows={4}
            value={result.text}
          />
          <div style={{ marginTop: "8px" }}>
            二进制: {result.bytes && result.bytes}
          </div>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={onFinish}>
              计算
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
