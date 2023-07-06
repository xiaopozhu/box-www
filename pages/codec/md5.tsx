import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message, Tag } from "antd";
import { useState } from "react";
import Head from "next/head";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function MD5() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ encoding: "", hash: "", bytes: "" });

  const onFinish = (values: any) => {
    request("/api/v1/codec/md5", {
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
        <title>MD5 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>MD5</h1>
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
          initialValue={"plaintext"}
        >
          <Radio.Group>
            <Radio value="plaintext">明文</Radio>
            <Radio value="hex">Hex</Radio>
            <Radio value="base64">Base64</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={
            <>
              计算结果
              {result.encoding && <Tag color="red">{result.encoding}</Tag>}
            </>
          }
        >
          <TextArea placeholder="编码结果" rows={4} value={result.hash} />
          <div style={{ marginTop: "8px" }}>
            中间值: {result.bytes.length > 0 && result.bytes}
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            MD5
          </Button>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
