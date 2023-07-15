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

export default function URL() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();
  const [type, setType] = useState("encode");

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/url", {
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
        <title>URL - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>URL</h1>
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
            URL
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
        <h3>URL编码</h3>

        <h4>一、概述</h4>

        <p>URL编码是一种编码机制,用于将字符转换为可通过因特网传输的格式。</p>

        <p>它将字符转换为一个%后跟两位十六进制数的形式。</p>

        <h4>二、编码规则</h4>

        <p>URL编码使用以下规则:</p>

        <ul>
          <li>大写和小写英文字母、数字 0-9 保持原样</li>
          <li>特殊符号转换为 %XX 的形式,XX为该符号对应的两位十六进制码</li>
          <li>空格转换为 %20</li>
        </ul>

        <p>例如 @ 符号编码为 %40</p>

        <h4>三、应用场景</h4>

        <p>URL编码常见的应用有:</p>

        <ul>
          <li>URL参数传递 - 编码参数名和参数值</li>
          <li>表单提交 - 对提交数据进行编码</li>
          <li>网页编码 - 嵌入特殊字符</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>URL编码的安全性分析:</p>

        <ul>
          <li>可逆过程,不具加密作用</li>
          <li>存在字符被多次编码的问题</li>
          <li>容易受到代码注入等攻击</li>
        </ul>

        <p>URL编码只是转换格式,不能防止攻击,需要结合输入过滤使用。</p>
      </article>
    </>
  );
}
