import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, Space, message, Tag } from "antd";
import { useState } from "react";
import Head from "next/head";
import { hashInfo } from "@/model/model";
import CopyBtn from "@/components/button";
import styles from "@/styles/blog.module.css";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function SHA3() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (e: any, s: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/box-api/v1/codec/sha3", {
          method: "POST",
          body: JSON.stringify({ ...values, size: s }),
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
        <title>SHA3 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>SHA3</h1>
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
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "256")}>
              SHA3-256
            </Button>
            <Button onClick={(e) => onFinish(e, "224")}>SHA3-224</Button>
            <Button onClick={(e) => onFinish(e, "384")}>SHA3-384</Button>
            <Button onClick={(e) => onFinish(e, "512")}>SHA3-512</Button>
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
            <CopyBtn text={result.hash} />
            <div style={{ marginTop: "8px" }}>
              中间值: {result.bytes.length > 0 && result.bytes}
            </div>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>SHA-3 - 安全哈希算法3</h3>

        <h4>一、概述</h4>

        <p>SHA-3是最新的安全哈希算法标准,由美国国家标准与技术研究院设计。</p>

        <p>SHA-3具有不同的变种,可以生成224、256、384、512位的哈希值。</p>

        <h4>二、技术原理</h4>

        <p>SHA-3使用了全新的设计理念:</p>

        <ul>
          <li>采用可替代的压缩函数</li>
          <li>基于海绵函数结构</li>
          <li>不再依赖分组长度</li>
        </ul>

        <p>SHA-3的安全性不依赖于碰撞抗性,而在于其强大的混淆和扩散能力。</p>

        <h4>三、应用场景</h4>

        <p>SHA-3可广泛应用于:</p>

        <ul>
          <li>数据完整性验证</li>
          <li>数字签名</li>
          <li>密码学协议</li>
          <li>随机数生成</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>相比SHA-2,SHA-3在以下方面进行了增强:</p>

        <ul>
          <li>抗量子计算攻击</li>
          <li>不受长度扩展攻击影响</li>
          <li>基于全新结构,抗已知和未知攻击</li>
        </ul>

        <p>SHA-3是当今最强大和可靠的哈希算法之一。</p>
      </article>
    </>
  );
}
