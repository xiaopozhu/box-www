import { request } from "@/utils/request";
import { Divider, Form, Input, Button, List, Space, message } from "antd";
import { useState } from "react";
import Head from "next/head";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function URLParse() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({
    scheme: "",
    user: "",
    host: "",
    path: "",
    rawQuery: "",
    fragment: "",
  });

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/url-parse", {
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

  return (
    <>
      <Head>
        <title>URL解析 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>URL解析</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="待处理值"
          name="text"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea placeholder="待处理字符串" rows={2} />
        </Form.Item>
        <Form.Item label="计算结果">
          <List size="small">
            <List.Item>Scheme: {result.scheme}</List.Item>
            <List.Item>User: {result.user}</List.Item>
            <List.Item>Host: {result.host}</List.Item>
            <List.Item>Path: {result.path}</List.Item>
            <List.Item>RawQuery: {result.rawQuery}</List.Item>
            <List.Item>Fragment: {result.fragment}</List.Item>
          </List>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e)}>
              URL解析
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
