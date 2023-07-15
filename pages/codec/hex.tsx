import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, Space, message, Tag } from "antd";
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

export default function Hex() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();
  const [type, setType] = useState("encode");

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/hex", {
          method: "POST",
          body: JSON.stringify({ ...values, type: type }),
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
        <title>Hex - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Hex</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item label="编码解码" required>
          <Radio.Group
            onChange={(v) => {
              setType(v.target.value);
              form.resetFields();
              setResult(undefined);
            }}
            defaultValue={type}
          >
            <Radio value="encode">编码</Radio>
            <Radio value="decode">解码</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="待处理值"
          name="text"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea placeholder="待处理字符串" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            Hex
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
            <CopyBtn text={result.text} />
            <div style={{ marginTop: "8px" }}>
              二进制: {result.bytes && result.bytes}
            </div>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>Hex编码</h3>

        <h4>一、概述</h4>

        <p>Hex编码是一种将二进制数据编码为十六进制格式的编码机制。</p>

        <p>Hex编码使用0-9和A-F表示数据,常用于表示散列值、颜色代码等。</p>

        <h4>二、编码原理</h4>

        <p>Hex编码的过程是:</p>

        <ol>
          <li>将输入Bytes拆分成每个4位二进制</li>
          <li>根据对应关系转换为0-9或A-F的Hex字符</li>
          <li>输出Hex序列</li>
        </ol>

        <p>解码按照编码的逆过程执行。</p>

        <h4>三、应用场景</h4>

        <p>Hex编码常见的使用场景包括:</p>

        <ul>
          <li>表示散列值,如MD5、SHA-1</li>
          <li>网页颜色代码</li>
          <li>数据存储和传输</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>Hex编码存在以下安全性问题:</p>

        <ul>
          <li>无加密功能,可逆操作</li>
          <li>无法防止数据篡改</li>
          <li>易受代码注入等攻击</li>
        </ul>

        <p>Hex编码需要与其他安全机制配合使用。</p>
      </article>
    </>
  );
}
