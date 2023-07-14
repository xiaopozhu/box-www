import { request } from "@/utils/request";
import { Divider, Form, Input, Button, Radio, message, Tag } from "antd";
import { useState } from "react";
import Head from "next/head";
import CopyBtn from "@/components/button";
import { hashInfo } from "@/model/model";

import styles from "@/styles/blog.module.css";
import Image from "next/image";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function HMAC() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (values: any) => {
    request("/api/v1/codec/hmac", {
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
        <title>HMAC - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>HMAC</h1>
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
        <Form.Item
          label="Hash算法"
          name="hashAlgo"
          required
          initialValue={"sha1"}
        >
          <Radio.Group>
            <Radio value="sha1">SHA1</Radio>
            <Radio value="sha256">SHA256</Radio>
            <Radio value="sha512">SHA512</Radio>
            <Radio value="sm3">SM3</Radio>
            <Radio value="md5">MD5</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="共享密钥"
          name="key"
          rules={[{ type: "string", min: 1 }]}
          required
          tooltip="目前仅支持明文密钥"
        >
          <TextArea placeholder="密钥字符串, 仅支持明文" rows={1} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            HMAC
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
        <h3>HMAC - 基于哈希函数的消息认证码</h3>

        <h4>一、原理</h4>

        <p>
          HMAC(Hash-based Message Authentication
          Code),中文名称“基于哈希函数的消息认证码”,是一种认证码,用于确认信息的完整性和认证。
        </p>

        <p>
          HMAC
          的工作原理是使用哈希算法与一个密钥组合产生一个认证码,用于验证信息的完整性。
        </p>

        <p>其基本流程如下:</p>

        <ol>
          <li>将密钥与输入消息组合,经过哈希算法生成中间哈希值</li>
          <li>将中间哈希值与密钥组合,再次进行哈希运算,得到最终的HMAC码</li>
        </ol>

        <Image
          src="https://st.deepzz.com/tools/article/SHAhmac.png"
          alt="HMAC-SHA1"
          width="480"
          height="340"
        />

        <p>
          通常使用 MD5 或 SHA-1 等哈希算法计算
          HMAC。增加密钥提高了安全强度,防止数据被篡改。
        </p>

        <h4>二、应用场景</h4>

        <ul>
          <li>验证通信消息的完整性</li>
          <li>防止敏感数据在传输过程中被篡改</li>
          <li>验证用户身份,保证数据来源的真实性</li>
        </ul>

        <h4>三、实现方法</h4>

        <p>主要语言都有现成的 HMAC 模块可以直接使用,例如:</p>

        <ul>
          <li>
            Java: <code>javax.crypto.Mac</code>
          </li>
          <li>
            Python: <code>hmac</code> 模块
          </li>
          <li>
            PHP: <code>hash_hmac()</code> 函数
          </li>
          <li>
            Go: <code>crypto/hmac</code> 包
          </li>
          <li>
            Node.js: <code>crypto.createHmac()</code>
          </li>
        </ul>

        <p>传入相应的哈希算法(如 SHA256)即可简单使用,无需自己实现哈希运算。</p>

        <h4>四、小结</h4>

        <p>
          HMAC
          作为一种基于哈希函数和密钥的消息认证方式,可以有效保证数据的完整性和防止消息被篡改。使用简单方便,安全性较高,是一种值得推荐的认证机制。
        </p>
      </article>
    </>
  );
}
