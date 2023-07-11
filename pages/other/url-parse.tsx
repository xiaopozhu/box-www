import { request } from "@/utils/request";
import { Divider, Form, Input, Button, List, Space, message } from "antd";
import { useState } from "react";
import Head from "next/head";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface urlResult {
  scheme: string;
  user: string;
  host: string;
  path: string;
  rawQuery: string;
  fragment: string;
}

export default function URLParse() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<urlResult>();

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/other/url-parse", {
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
          <TextArea
            placeholder="[scheme:][//[userinfo@]host][/]path[?query][#fragment]"
            rows={2}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            URL解析
          </Button>
        </Form.Item>
        {result && (
          <Form.Item label="处理结果">
            <List size="small">
              {Object.keys(result).map((k) => (
                <List.Item key={k}>
                  <small
                    style={{
                      display: "inline-block",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    {k.toUpperCase()}
                    {" : "}
                  </small>
                  {(result as any)[k]}
                </List.Item>
              ))}
            </List>
          </Form.Item>
        )}
      </Form>
      <Divider />
    </>
  );
}
