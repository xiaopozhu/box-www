import { request } from "@/utils/request";
import {
  Divider,
  Form,
  Input,
  Button,
  Radio,
  message,
  InputNumber,
  Tag,
} from "antd";
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

export default function BLAKE2b() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/box-api/v1/codec/blake2b", {
          method: "POST",
          body: JSON.stringify({ ...values }),
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

  const normalizeSize = (val: any) => {
    return val.toString();
  };

  return (
    <>
      <Head>
        <title>BLACK2b - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>BLAKE2b</h1>
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
          label="计算长度"
          name="size"
          rules={[{ required: true }]}
          initialValue={"256"}
          normalize={normalizeSize}
        >
          <InputNumber max={512} min={8} step={8} />
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
          tooltip="目前仅支持明文密钥"
        >
          <TextArea placeholder="密钥字符串, 仅支持明文" rows={1} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            BLAKE2b
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
        <h3>BLAKE2b哈希算法</h3>

        <h4>一、概述</h4>

        <p>BLAKE2b是一种高安全性的密码散列函数,可以生成任意长度的信息摘要。</p>

        <p>相比MD5和SHA-1,BLAKE2b抗碰撞能力更强。</p>

        <h4>二、技术实现</h4>

        <p>BLAKE2b的主要计算步骤:</p>

        <ol>
          <li>初始化状态矩阵和参数</li>
          <li>对消息分块迭代压缩</li>
          <li>输出最后状态的哈希值</li>
        </ol>

        <p>压缩函数结合了G函数、常量和反序操作。</p>

        <h4>三、应用场景</h4>

        <p>BLAKE2b可广泛应用于:</p>

        <ul>
          <li>文件校验</li>
          <li>数字签名</li>
          <li>密码学协议</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>BLAKE2b的主要安全优点:</p>

        <ul>
          <li>抗碰撞攻击和相关密钥攻击</li>
          <li>支持任意输出长度</li>
          <li>计算速度快</li>
        </ul>

        <p>BLAKE2b是一种性能和安全性均衡的散列算法。</p>
      </article>
    </>
  );
}
