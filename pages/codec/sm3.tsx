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

export default function SM3() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (values: any) => {
    request("/box-api/v1/codec/sm3", {
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
        <title>国密SM3 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>SM3</h1>
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
            SM3
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
        <h3>SM3 - 国密哈希算法</h3>

        <h4>一、概述</h4>

        <p>
          SM3是我国自主研发的一种密码散列算法,输出消息摘要长度为256位(32字节)。
        </p>

        <p>SM3 algorithm作为国密标准之一,被广泛应用于数据完整性保护等场景。</p>

        <h4>二、技术原理</h4>

        <p>SM3算法主要过程包括:</p>

        <ul>
          <li>对消息进行填充和分组</li>
          <li>生成初始向量</li>
          <li>迭代压缩生成消息摘要</li>
        </ul>

        <p>其压缩函数通过布尔逻辑与模运算生成输出,抗差分和线性分析攻击。</p>

        <h4>三、应用场景</h4>

        <p>SM3主要应用于:</p>

        <ul>
          <li>数字签名 - 生成签名和验证签名</li>
          <li>数据完整性 - 计算散列值校验信息</li>
          <li>用户认证 - 密码哈希化存储</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>SM3算法具有以下安全优势:</p>

        <ul>
          <li>抗碰撞、抗穷举、抗差分等攻击</li>
          <li>输出散列唯一性强</li>
          <li>支持任意消息长度</li>
        </ul>

        <p>SM3是当前较为安全可靠的哈希算法之一。</p>
      </article>
    </>
  );
}
