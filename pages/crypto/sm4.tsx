import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message, Space, Tag } from "antd";
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

export default function SM4() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/crypto/sm4", {
          method: "POST",
          body: JSON.stringify({ ...values, type: t }),
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
        <title>SM4 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>SM4</h1>
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
        <Form.Item label="加密模式" name="mode" required initialValue={"cbc"}>
          <Radio.Group>
            <Radio value="cbc">CBC</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="加解密钥"
          name="key"
          rules={[{ required: true }, { type: "string", min: 1 }]}
          tooltip="目前仅支持明文密钥"
        >
          <TextArea placeholder="密钥字符串, 仅支持明文" rows={1} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "encrypt")}>
              加密
            </Button>
            <Button onClick={(e) => onFinish(e, "decrypt")}>解密</Button>
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
            <CopyBtn text={result.text} />
            <div style={{ marginTop: "8px" }}>
              二进制: {result.bytes.length > 0 && result.bytes}
            </div>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>SM4加密算法</h3>

        <h4>一、概述</h4>

        <p>SM4是我国自主研发的分组加密算法,在GM/T 0003国家标准中规定。</p>

        <p>SM4采用128位分组,128位密钥,用于数据加密和解密。</p>

        <h4>二、算法原理</h4>

        <p>SM4的关键过程包含:</p>

        <ol>
          <li>进行非线性变换S盒替代</li>
          <li>行变换层</li>
          <li>进行轮密钥加操作</li>
          <li>32轮迭代运算</li>
        </ol>

        <p>加解密均使用相同的算法流程。</p>

        <h4>三、应用场景</h4>

        <p>SM4广泛应用于:</p>

        <ul>
          <li>无线通信加密</li>
          <li>数据存储和信息安全</li>
          <li>密码产品和系统</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>SM4具有以下安全特点:</p>

        <ul>
          <li>抗线性和差分分析</li>
          <li>高计算复杂度</li>
          <li>没有相关密钥弱点</li>
        </ul>

        <p>SM4是较为可靠和安全的国产对称算法。</p>
      </article>
    </>
  );
}
