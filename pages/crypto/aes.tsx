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

export default function AES() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/crypto/aes", {
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
        <title>AES - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>AES</h1>
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
            <Radio value="cfb">CFB</Radio>
            <Radio value="ctr">CTR</Radio>
            <Radio value="gcm">GCM</Radio>
            <Radio value="ofb">OFB</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="加解密钥"
          name="key"
          rules={[{ required: true }, { type: "string", min: 16 }]}
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
        <h3>AES加密算法</h3>

        <h4>一、概述</h4>

        <p>
          AES(Advanced Encryption
          Standard)是一种对称加密算法,基于子代换和列混淆结构设计。
        </p>

        <p>AES支持128位、192位和256位三种密钥长度。</p>

        <h4>二、算法原理</h4>

        <p>AES加密分为以下基本步骤:</p>

        <ol>
          <li>按字节划分明文,转换为状态矩阵</li>
          <li>轮密钥加 - 每轮带密钥的字节代换和行移位</li>
          <li>列混淆 - 使用线性变换混淆状态矩阵</li>
          <li>最终轮转换,输出密文</li>
        </ol>

        <p>解密反序进行以上步骤,使用轮密钥的逆序。</p>

        <h4>三、应用场景</h4>

        <p>AES常用于如下场景:</p>

        <ul>
          <li>文件和数据存储加密</li>
          <li>网络通信加密</li>
          <li>WiFi和电子支付加密</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>AES安全性分析:</p>

        <ul>
          <li>抵御已知明文攻击</li>
          <li>抵御微差分和线性密码分析</li>
          <li>密钥长度足够,暴力破解难度大</li>
        </ul>

        <p>AES被广泛认为是可靠、高强度的加密算法。</p>
      </article>
    </>
  );
}
