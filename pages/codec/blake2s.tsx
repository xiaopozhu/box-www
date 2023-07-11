import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, Space, message, Tag } from "antd";
import { useState } from "react";
import Head from "next/head";
import { hashInfo } from "@/model/model";
import CopyBtn from "@/components/button";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function BLAKE2s() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (e: any, s: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/blake2s", {
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
      <Head>
        <title>BLAKE2s - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>BLAKE2s</h1>
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
        <Form.Item
          label="可选密钥"
          name="key"
          rules={[{ type: "string", min: 1 }]}
          tooltip={"目前仅支持明文密钥, 密钥长度在0-32Byte"}
        >
          <TextArea placeholder="密钥字符串, 仅支持明文密钥" rows={1} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "128")}>
              BLAKE2s-128
            </Button>
            <Button onClick={(e) => onFinish(e, "256")}>BLAKE2s-256</Button>
          </Space>
        </Form.Item>
        {result && (
          <Form.Item
            label={
              <>
                计算结果
                {result.encoding && <Tag color="red">{result.encoding}</Tag>}
              </>
            }
          >
            <CopyBtn text={result.hash} />
            <div style={{ marginTop: "8px" }}>
              中间值: {result.bytes.length > 0 && result.bytes}
            </div>
          </Form.Item>
        )}
      </Form>
      <Divider />
    </>
  );
}
