import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message, Tag } from "antd";
import { useState } from "react";
import Head from "next/head";
import { hashInfo } from "@/model/model";
import CopyBtn from "@/components/button";
import styles from "@/styles/blog.module.css";
import Image from "next/image";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function SHA1() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (values: any) => {
    request("/api/v1/codec/sha1", {
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
        <title>SHA1 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>SHA1</h1>
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
            SHA-1
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
        <h3>SHA-1 - 安全哈希算法</h3>

        <h4>一、概述</h4>

        <p>
          SHA-1(Secure Hash Algorithm
          1)是一种密码散列函数,由美国国家安全局设计,用于生成一个160位(20字节)的消息摘要。
        </p>

        <p>
          SHA-1在密码学和数据存储等领域被广泛使用,主要用来对数据进行数字签名验证、消息完整性校验等。
        </p>

        <h4>二、技术原理</h4>

        <p>SHA-1的计算过程可以分为三步:</p>

        <ol>
          <li>对输入消息进行Padding填充</li>
          <li>将填充消息分块,计算每个消息块的原始信息的处理结果</li>
          <li>迭代压缩处理,输出最终的160位哈希值</li>
        </ol>

        <p>
          SHA-1依靠迭代非线性逻辑运算和模2^32算术运算生成哈希值,对任意长度的数据产生唯一固定长度的摘要。
        </p>

        <Image
          src="https://st.deepzz.com/tools/article/SHA-1.png"
          width={480}
          height={500}
          alt="SHA1"
        />

        <h4>三、应用场景</h4>

        <p>SHA-1广泛应用于:</p>

        <ul>
          <li>数字签名 - 用于签发和验证数字证书</li>
          <li>数据校验 - 计算散列值来验证数据完整性</li>
          <li>版本控制 - 计算提交内容的哈希作为版本标识</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>随着计算能力的提升,SHA-1已被证明存在安全弱点,主要体现在:</p>

        <ul>
          <li>碰撞攻击 - 找到两段内容哈希值相同的概率增加</li>
          <li>长度扩展攻击 - 通过消息扩展继续生成有效哈希</li>
        </ul>

        <p>因此关键场景中不应再使用SHA-1,可以考虑SHA-2、SHA-3等算法。</p>
      </article>
    </>
  );
}
