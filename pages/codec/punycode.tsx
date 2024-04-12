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

export default function Punycode() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();
  const [type, setType] = useState("encode");

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/box-api/v1/codec/punycode", {
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
        <title>Punycode - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Punycode</h1>
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
          <TextArea
            placeholder={
              type === "encode" ? "你好世界.com" : "xn--rhq34a65tw32a.com"
            }
            rows={4}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            Punycode
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
        <h3>Punycode编码算法</h3>

        <h4>一、概述</h4>

        <p>Punycode是一种编码语法,用于将Unicode字符转换为ASCII字符。</p>

        <p>Punycode常用于国际化域名(IDN)的编码。</p>

        <h4>二、编码原理</h4>

        <p>Punycode的编码过程主要分为:</p>

        <ol>
          <li>标识非ASCII字符</li>
          <li>转换为特定前缀和数字表示</li>
          <li>连接前缀和数字串</li>
        </ol>

        <p>解码是按照相反的步骤执行。</p>

        <h4>三、应用场景</h4>

        <p>Punycode主要应用于:</p>

        <ul>
          <li>国际化域名编码</li>
          <li>表示包含非英文字符的域名</li>
        </ul>

        <h4>四、特点</h4>

        <p>Punycode的主要特点:</p>

        <ul>
          <li>可逆编码机制</li>
          <li>与ASCII域名后向兼容</li>
          <li>编解码过程简单高效</li>
        </ul>
      </article>
    </>
  );
}
