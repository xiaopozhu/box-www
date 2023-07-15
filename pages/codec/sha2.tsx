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

export default function SHA2() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (e: any, s: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/sha2", {
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
        <title>SHA256/SHA384/SHA512 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>SHA2</h1>
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
              SHA-256
            </Button>
            <Button onClick={(e) => onFinish(e, "224")}>SHA-224</Button>
            <Button onClick={(e) => onFinish(e, "384")}>SHA-384</Button>
            <Button onClick={(e) => onFinish(e, "512")}>SHA-512</Button>
            <Button onClick={(e) => onFinish(e, "512/224")}>SHA-512/224</Button>
            <Button onClick={(e) => onFinish(e, "512/256")}>SHA-512/256</Button>
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
        <h3>SHA-2 - 安全哈希算法2</h3>

        <h4>一、概述</h4>

        <p>
          SHA-2是一系列密码散列函数,由美国国家安全局设计,用于生成固定长度的信息摘要。
        </p>

        <p>
          主要的算法包括SHA-224、SHA-256、SHA-384、SHA-512等变种,生成的散列值长度从224位到512位不等。
        </p>

        <h4>二、技术原理</h4>

        <p>与SHA-1类似,SHA-2使用了以下技术:</p>

        <ul>
          <li>消息填充</li>
          <li>分组处理</li>
          <li>迭代压缩</li>
        </ul>

        <p>
          但SHA-2使用了改进的冲突分析方法,其迭代过程会改变80轮,提高了安全性。
        </p>

        <h4>三、应用场景</h4>

        <p>SHA-2广泛应用于:</p>

        <ul>
          <li>数字签名 - 可产生DSA和ECDSA签名</li>
          <li>数据校验 - 计算散列值验证数据完整性</li>
          <li>订阅系统 - 提供更安全的用户认证</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>相比SHA-1,SHA-2系列算法在以下方面进行了增强:</p>

        <ul>
          <li>抗碰撞攻击能力更强</li>
          <li>支持更长的哈希输出</li>
          <li>迭代轮数增加,计算复杂度更高</li>
        </ul>

        <p>在可预见的未来,SHA-2仍较为安全可靠,是SHA-1的推荐替代。</p>
      </article>
    </>
  );
}
