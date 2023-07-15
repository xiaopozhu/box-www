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

export default function Twofish() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/crypto/twofish", {
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
        <title>Twofish - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Twofish</h1>
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
          required
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
        <h3>Twofish加密算法</h3>

        <h4>一、概述</h4>

        <p>
          Twofish是一种对称密钥分组加密算法,keys长度可变,支持128位、192位和256位。
        </p>

        <p>Twofish基于Feistel网络结构,采用key-dependent S盒设计。</p>

        <h4>二、算法原理</h4>

        <p>Twofish的主要计算步骤有:</p>

        <ol>
          <li>进行密钥扩展,生成子密钥</li>
          <li>分组,进行16轮Feistel迭代</li>
          <li>每轮运算包含子密钥加、字节代换和行列变换</li>
          <li>输出加密结果</li>
        </ol>

        <h4>三、应用场景</h4>

        <p>Twofish可广泛应用于:</p>

        <ul>
          <li>磁盘和文件加密</li>
          <li>网络安全协议</li>
          <li>数据库和通信加密</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>Twofish的主要安全性优势:</p>

        <ul>
          <li>抗差分和线性密码分析</li>
          <li>高度并行性</li>
          <li>设计简单优雅,无明显弱点</li>
        </ul>

        <p>Twofish是性能和安全性均衡的选择。</p>
      </article>
    </>
  );
}
