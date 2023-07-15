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

export default function Base64() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<codecInfo>();
  const [type, setType] = useState("encode");

  const onFinish = (e: any, et: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/codec/base64", {
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
        <title>Base64 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>Base64</h1>
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
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "std")}>
              Base64 标准
            </Button>
            <Button onClick={(e) => onFinish(e, "url")}>Base64 URL</Button>
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
        <h3>Base64 - 数据编码</h3>

        <h4>一、概述</h4>

        <p>Base64是一种基于64个可打印字符来表示二进制数据的编码方式。</p>

        <p>Base64常用于在通信协议中传输二进制数据,例如邮件、HTTP等。</p>

        <h4>二、编码原理</h4>

        <p>Base64的编码过程为:</p>

        <ol>
          <li>将输入数据按3字节一组拆分</li>
          <li>每组输入数据生成4个编码字符</li>
          <li>在编码末尾添加=号作为填充符</li>
          <li>输出编码后的可打印字符</li>
        </ol>

        <p>解码则进行相反的转换过程,恢复原始数据。</p>

        <h4>三、应用场景</h4>

        <p>Base64主要应用于:</p>

        <ul>
          <li>邮件传输 - 传输附件信息</li>
          <li>HTTP协议 - 编码请求和响应正文</li>
          <li>数据存储 - 存储二进制信息</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>Base64只是编码,不提供真正的加密:</p>

        <ul>
          <li>可逆算法,易被解码恢复</li>
          <li>无需密钥,任何人都可解码</li>
          <li>容易受到中间人攻击</li>
        </ul>

        <p>Base64仅可起到轻度混淆的效果,不能作为安全保障。</p>
      </article>
    </>
  );
}
