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

export default function Blowfish() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/box-api/v1/crypto/blowfish", {
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
        <title>Blowfish - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Blowfish</h1>
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
        <h3>Blowfish加密算法</h3>

        <h4>一、概述</h4>

        <p>
          Blowfish是一种对称密钥分组加密算法,密钥长度可变,从32位到448位不等。
        </p>

        <p>Blowfish采用Feistel结构,执行16轮迭代运算。</p>

        <h4>二、算法原理</h4>

        <p>Blowfish的主要计算过程包含:</p>

        <ol>
          <li>密钥扩展,将密钥转换为多个子密钥</li>
          <li>分组数据,每组将在Feistel网络中处理</li>
          <li>迭代轮函数,包含关键依赖的S盒和密钥加</li>
          <li>交换左右两半分组产生密文</li>
        </ol>

        <h4>三、应用场景</h4>

        <p>Blowfish可广泛应用于:</p>

        <ul>
          <li>数据库加密</li>
          <li>保护密码和关键信息</li>
          <li>安全通信</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>Blowfish具有以下安全优势:</p>

        <ul>
          <li>抗差分和线性密码分析</li>
          <li>密钥依赖的S盒,增强安全性</li>
          <li>简单结构,无明显弱点</li>
        </ul>

        <p>Blowfish提供了很好的速度与安全性平衡。</p>
      </article>
    </>
  );
}
