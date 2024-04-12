import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message, Tag } from "antd";
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

export default function MD4() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (values: any) => {
    request("/box-api/v1/codec/md4", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((resp) => {
        if (resp.code !== 0) return message.error(resp.error);
        setResult(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Head>
        <title>MD4 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>MD4</h1>
      </div>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
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
          <Button type="primary" htmlType="submit">
            MD4
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
            <CopyBtn text={result.hash} />
            <div style={{ marginTop: "8px" }}>
              中间值: {result.bytes.length > 0 && result.bytes}
            </div>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>MD4哈希算法</h3>

        <h4>一、概述</h4>

        <p>
          MD4是一种密码散列函数算法,由Ron Rivest设计,可以生成128位的信息摘要。
        </p>

        <p>MD4算法结构简单,运算速度快,但存在一定的安全缺陷。</p>

        <h4>二、技术实现</h4>

        <p>MD4的主要计算步骤包括:</p>

        <ol>
          <li>填充消息</li>
          <li>初始化4个32位状态寄存器</li>
          <li>对消息分块迭代压缩</li>
          <li>输出加总的哈希值</li>
        </ol>

        <p>压缩函数包含布尔运算、模加和位移操作。</p>

        <h4>三、应用场景</h4>

        <p>MD4曾被用于:</p>

        <ul>
          <li>数字签名</li>
          <li>文件校验</li>
          <li>密码哈希</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>MD4存在以下主要安全问题:</p>

        <ul>
          <li>碰撞问题 - 不同输入可产生相同哈希</li>
          <li>加密弱点 - S盒设计简单,容易反推密文</li>
          <li>长度扩展攻击 - 可构造具有任意前缀的新消息</li>
        </ul>

        <p>MD4目前已不再安全,不应在实际中使用。</p>
      </article>
    </>
  );
}
