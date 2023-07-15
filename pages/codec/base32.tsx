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

export default function Base32() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();
  const [type, setType] = useState("encode");

  const onFinish = (e: any, et: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/base32", {
          method: "POST",
          body: JSON.stringify({ ...values, type: type, encodeType: et }),
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
        <title>Base32 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Base32</h1>
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
        {type === "encode" && (
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
        )}
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "std")}>
              Base32 标准
            </Button>
            <Button onClick={(e) => onFinish(e, "hex")}>Base32 Hex</Button>
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
              十六进制: {result.bytes && result.bytes}
            </div>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>Base32编码算法</h3>

        <h4>一、概述</h4>

        <p>Base32是一种编码算法,用于以更紧凑的方式表示二进制数据。</p>

        <p>Base32使用26个大写字母和6个数字来构成编码字符集。</p>

        <h4>二、编码原理</h4>

        <p>Base32的编码过程主要包含:</p>

        <ol>
          <li>将数据分成5位一组</li>
          <li>每5位映射到8位字符</li>
          <li>对不足40位的尾数补充填充字符=</li>
        </ol>

        <p>解码按编码的逆过程执行,恢复原始数据。</p>

        <h4>三、应用场景</h4>

        <p>Base32常用于:</p>

        <ul>
          <li>编码文件标识符</li>
          <li>生成文件校验和</li>
          <li>在URL和XML中传输二进制数据</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>Base32只是一种编码,不具加密功能,存在以下问题:</p>

        <ul>
          <li>可逆解码,不保密数据</li>
          <li>容易受到代码注入等攻击</li>
          <li>无法防止数据篡改</li>
        </ul>

        <p>Base32应与其他安全措施配合使用。</p>
      </article>
    </>
  );
}
