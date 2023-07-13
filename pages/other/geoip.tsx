import { request } from "@/utils/request";
import { Divider, Form, Input, Button, List, Space, message } from "antd";
import { useState } from "react";
import Head from "next/head";
import { ipInfo } from "@/model/model";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function GeoIP() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<ipInfo>();

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/other/geoip", {
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
        <title>GeoIP - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>GeoIP</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="指定IP地址"
          name="text"
          rules={[{ type: "string", min: 1 }]}
        >
          <TextArea
            placeholder="不填则获取本机IP地址, eg. 114.114.114.114"
            rows={2}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            GeoIP
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
