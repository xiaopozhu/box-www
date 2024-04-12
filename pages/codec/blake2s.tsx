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

export default function BLAKE2s() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (e: any, s: string) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/box-api/v1/codec/blake2s", {
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
        <title>BLAKE2s - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>BLAKE2s</h1>
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
        <Form.Item
          label="可选密钥"
          name="key"
          rules={[{ type: "string", min: 1 }]}
          tooltip={"目前仅支持明文密钥, 密钥长度在0-32Byte"}
        >
          <TextArea placeholder="密钥字符串, 仅支持明文密钥" rows={1} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={(e) => onFinish(e, "128")}>
              BLAKE2s-128
            </Button>
            <Button onClick={(e) => onFinish(e, "256")}>BLAKE2s-256</Button>
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
        <h3>BLAKE2s哈希算法</h3>

        <h4>一、概述</h4>

        <p>
          BLAKE2s是BLAKE2算法系列的一个轻量级变种,用于生成固定长度为256位的哈希值。
        </p>

        <p>BLAKE2s适用于对性能和资源有要求的场景。</p>

        <h4>二、技术实现</h4>

        <p>BLAKE2s的主要计算步骤包括:</p>

        <ol>
          <li>初始化状态矩阵</li>
          <li>对消息分块迭代压缩</li>
          <li>输出最终状态作为哈希值</li>
        </ol>

        <p>压缩函数使用了优化的G函数。</p>

        <h4>三、应用场景</h4>

        <p>BLAKE2s常用于:</p>

        <ul>
          <li>IoT和嵌入式设备</li>
          <li>实时系统和网络协议</li>
          <li>对性能要求较高的应用</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>BLAKE2s相比BLAKE2b有以下特点:</p>

        <ul>
          <li>计算速度更快</li>
          <li>代码体积更小</li>
          <li>哈希长度固定为256位</li>
        </ul>

        <p>BLAKE2s提供了很好的性能和安全性平衡。</p>
      </article>
    </>
  );
}
