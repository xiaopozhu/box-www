import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, Space, message, Tag } from "antd";
import { useState } from "react";
import Head from "next/head";
import { codecInfo } from "@/model/model";
import CopyBtn from "@/components/button";
import styles from "@/styles/blog.module.css";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function Unicode() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();
  const [type, setType] = useState("encode");

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/unicode", {
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
        <title>Unicode - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Unicode</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item label="编码解码" required>
          <Radio.Group
            onChange={(v) => {
              setType(v.target.value);
              form.resetFields();
              setResult(undefined);
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
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            Unicode
          </Button>
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
            <CopyBtn text={result.text} />
            <div style={{ marginTop: "8px" }}>
              十六进制: {result.bytes && result.bytes}
            </div>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>Unicode编码</h3>

        <h4>一、概述</h4>

        <p>
          Unicode是一种国际通用的字符编码标准,用于表示世界上大多数语言中的字符。
        </p>

        <p>Unicode为每个字符分配一个唯一的编码,支持21位的编码空间。</p>

        <h4>二、编码方案</h4>

        <p>Unicode有以下几种常用编码方案:</p>

        <ul>
          <li>UTF-8 - 1-4个字节可变长度编码</li>
          <li>UTF-16 - 2或4个字节,支持代理对</li>
          <li>UTF-32 - 4个字节,每个字符一个码点</li>
        </ul>

        <p>UTF-8是Unicode的最常用编码形式。</p>

        <h4>三、应用场景</h4>

        <p>Unicode广泛应用于:</p>

        <ul>
          <li>国际化软件</li>
          <li>多语言网站</li>
          <li>词典编纂</li>
        </ul>

        <h4>四、优点</h4>

        <p>Unicode的主要优点:</p>

        <ul>
          <li>支持所有国家语言的字符</li>
          <li>统一的编码,便于交换和处理</li>
          <li>向后兼容ASCII</li>
        </ul>
      </article>
    </>
  );
}
