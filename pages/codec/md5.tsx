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

export default function MD5() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<hashInfo>();

  const onFinish = (values: any) => {
    request("/api/v1/codec/md5", {
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
        <title>MD5 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>MD5</h1>
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
            MD5
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
        <h3>MD5 - 消息摘要算法</h3>

        <h4>一、原理</h4>

        <p>
          MD5(Message-Digest Algorithm
          5)中文名为消息摘要算法第五版,是一种被广泛使用的密码散列函数,可以产生出一个128位(16字节)的哈希值。
        </p>

        <p>
          MD5通过对输入消息进行Padding填充,然后按512位分组进行处理,经过一系列的逻辑与数学运算,迭代生成输出的128位散列值。
        </p>

        <Image
          src="https://st.deepzz.com/tools/article/MD5_algorithm.png"
          width={480}
          height={527}
          alt="MD5算法"
        />

        <p>
          MD5算法具有抗修改性,哪怕只修改输入的一个位,输出的散列值也会大幅度变化,因此可以用于校验信息是否遭到篡改。
        </p>

        <h4>二、应用场景</h4>

        <ul>
          <li>数字签名和信息校验</li>
          <li>用户登录和密码存储</li>
          <li>文件完整性验证</li>
          <li>数字水印及数字取证</li>
        </ul>

        <h4>三、安全性分析</h4>

        <p>
          MD5算法在设计时,安全强度较高,但随着计算能力的提升,MD5已不再被认为是安全的,主要存在以下风险:
        </p>

        <ul>
          <li>碰撞风险 - 两个不同数据可以产生相同的MD5</li>
          <li>生日攻击 - 找到输入对应特定散列输出的消息</li>
          <li>彩虹表攻击 - 使用预计算好的散列值进行反向查找</li>
        </ul>

        <p>因此,MD5已不推荐继续使用在对安全性要求较高的场景中。</p>

        <h4>四、替代方案</h4>

        <p>鉴于MD5存在的安全性问题,以下算法可以作为替代方案:</p>

        <ul>
          <li>SHA-2 - 比MD5安全性更高的散列算法</li>
          <li>SHA-3 - 最新的SHA-3算法,抗碰撞性强</li>
          <li>Bcrypt - 通过加盐和多次迭代提高破解难度</li>
        </ul>

        <p>在需要安全性认证的场景中,建议使用SHA-2、SHA-3或Bcrypt来代替MD5。</p>
      </article>
    </>
  );
}
