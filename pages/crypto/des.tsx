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

export default function DES() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/box-api/v1/crypto/des", {
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
        <title>DES - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>DES</h1>
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
          rules={[{ required: true }, { type: "string", len: 8 }]}
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
        <h3>DES加密算法</h3>

        <h4>一、概述</h4>

        <p>
          DES(Data Encryption Standard)是一种基于Feistel结构的对称加密算法。
        </p>

        <p>DES使用56位密钥对数据进行加密,密钥通常表示为16进制数。</p>

        <h4>二、算法原理</h4>

        <p>DES的工作流程是:</p>

        <ol>
          <li>初始化置换</li>
          <li>
            16轮迭代运算
            <ol>
              <li>扩展置换</li>
              <li>S盒置换</li>
              <li>P置换</li>
            </ol>
          </li>
          <li>逆初始置换</li>
        </ol>

        <p>每轮使用子密钥的不同部分进行异或和置换操作。</p>

        <h4>三、应用场景</h4>

        <p>DES曾被广泛使用于:</p>

        <ul>
          <li>早期的安全通信</li>
          <li>文件和数据加密</li>
          <li>UNIX和Windows系统加密</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>DES存在以下安全性问题:</p>

        <ul>
          <li>56位密钥过于短小</li>
          <li>容易受到穷举攻击</li>
          <li>S盒设计有缺陷</li>
        </ul>

        <p>DES已不再安全,应该采用AES等替代算法。</p>
      </article>
    </>
  );
}
