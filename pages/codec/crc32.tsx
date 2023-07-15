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

export default function CRC32() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (values: any) => {
    request("/api/v1/codec/crc32", {
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
        <title>CRC32 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>CRC32</h1>
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
            CRC32
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
        <h3>CRC32 - 循环冗余校验</h3>

        <h4>一、概述</h4>

        <p>
          CRC32是一种循环冗余校验算法,用于检测数据在传输或存储过程中是否出现错误。
        </p>

        <p>CRC32会生成一个32位的校验值,用于验证消息内容是否完整一致。</p>

        <h4>二、技术原理</h4>

        <p>CRC32的计算过程包含以下步骤:</p>

        <ol>
          <li>预设一个32位的寄存器,存放校验值</li>
          <li>将消息表示为比特流,按位序列地输入</li>
          <li>每输入1位,执行一次CRC模2除法运算</li>
          <li>得到最终32位校验值</li>
        </ol>

        <p>校验值与消息一起发送。接收端重复计算,比对结果。</p>

        <h4>三、应用场景</h4>

        <p>CRC32常用于:</p>

        <ul>
          <li>数据存储 - 校验储存数据的正确性</li>
          <li>数据传输 - 验证通信数据的完整性</li>
          <li>系统校验 - 文件系统和归档校验</li>
        </ul>

        <h4>四、安全性分析</h4>

        <p>CRC32存在以下安全性问题:</p>

        <ul>
          <li>容易发生冲突</li>
          <li>无法检测调序等差错</li>
          <li>线性结构,易受攻击</li>
        </ul>

        <p>CRC32适用于检测随机错误,但不适用于故意攻击。</p>
      </article>
    </>
  );
}
