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

export default function RC4() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/crypto/rc4", {
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
        <title>RC4 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>RC4</h1>
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
          label="加解密钥"
          name="key"
          rules={[{ required: true }, { type: "string", min: 1, max: 256 }]}
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
        <h3>RC4加密算法</h3>

        <h4>一、概述</h4>

        <p>RC4是一种流加密算法,通过生成伪随机位流来对信息进行加密。</p>

        <p>RC4算法简单且速度快,但存在一定的统计安全性问题。</p>

        <h4>二、算法原理</h4>

        <p>RC4算法的主要步骤是:</p>

        <ol>
          <li>初始化S盒,一个包含0-255的随机置换</li>
          <li>利用密钥调整S盒</li>
          <li>生成伪随机字节流对消息加密</li>
        </ol>

        <p>解密时使用相同的S盒和密钥进行解密。</p>

        <h4>三、应用场景</h4>

        <p>RC4曾被广泛用于:</p>

        <ul>
          <li>TLS/SSL加密通信</li>
          <li>无线网络加密</li>
          <li>文件加密工具</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>RC4算法存在以下安全风险:</p>

        <ul>
          <li>相关密钥攻击</li>
          <li>弱密钥问题</li>
          <li>初始化矢量可预测</li>
        </ul>

        <p>建议用AES等算法取代RC4。</p>
      </article>
    </>
  );
}
