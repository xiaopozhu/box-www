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

export default function DESTriple() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();

  const onFinish = (e: any, t: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/crypto/3des", {
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
        <title>3DES - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>3DES</h1>
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
          rules={[{ required: true }, { type: "string", len: 24 }]}
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
        <h3>3DES加密算法</h3>

        <h4>一、概述</h4>

        <p>3DES是一种对称加密算法,通过多次迭代DES算法来提高安全性。</p>

        <p>3DES使用168位的密钥,对数据进行三次加密来保证强度。</p>

        <h4>二、算法原理</h4>

        <p>3DES的基本工作流程是:</p>

        <ol>
          <li>使用密钥K1对明文进行DES加密</li>
          <li>使用密钥K2对上一步的结果进行DES解密</li>
          <li>使用密钥K3再对上一步的结果进行DES加密</li>
        </ol>

        <p>解密按照逆序进行,使用K3、K2、K1解密。</p>

        <h4>三、应用场景</h4>

        <p>3DES曾被广泛应用于:</p>

        <ul>
          <li>支付系统中数据传输</li>
          <li>数字签名和认证</li>
          <li>磁盘和文件加密</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>相比DES,3DES主要增强了:</p>

        <ul>
          <li>168位密钥,防止暴力破解</li>
          <li>多重加密,提高算法强度</li>
          <li>抵御差ferential和线性分析</li>
        </ul>

        <p>3DES已被AES算法所取代,但仍有一定的应用。</p>
      </article>
    </>
  );
}
