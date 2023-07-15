import { request } from "@/utils/request";
import { Divider, Form, Input, Button, message } from "antd";
import { useState } from "react";
import Head from "next/head";
import CopyBtn from "@/components/button";
import styles from "@/styles/blog.module.css";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function CNY2CN() {
  const [form] = Form.useForm();

  const [result, setResult] = useState({ text: "" });

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/other/cny2cn", {
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

  return (
    <>
      <Head>
        <title>CNY2CN - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>CNY2CN</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="待处理值"
          name="text"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea placeholder="100.32" rows={2} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            转换
          </Button>
        </Form.Item>
        {result.text && (
          <Form.Item label="处理结果">
            <CopyBtn text={result.text} />
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>金额转大写</h3>

        <h4>一、概述</h4>

        <p>金额转大写是将阿拉伯数字表示的人民币金额转换为汉字大写格式。</p>

        <p>转化后格式为 “人民币/元整”。小数部分转化为 “角/分”。</p>

        <h4>二、实现方法</h4>

        <p>金额转大写常用实现方法:</p>

        <ul>
          <li>准备汉字数字数组</li>
          <li>分别转换整数部分和小数部分</li>
          <li>小数部分需转换为“角”和“分”</li>
          <li>处理特殊情况,如“零”和“整”</li>
        </ul>

        <p>也可以直接调用相关金额转大写函数实现。</p>

        <h4>三、应用场景</h4>

        <p>金额转大写常见应用场景:</p>

        <ul>
          <li>电子结算单、发票打印</li>
          <li>金融业务清算明细</li>
          <li>财务报表和审计</li>
        </ul>

        <h4>四、实现示例</h4>

        <p>实现转换示例:</p>

        <ul>
          <li>123.45 =&gt; 人民币壹佰贰拾叁元肆角伍分</li>
          <li>1234 =&gt; 壹仟贰佰叁拾肆元整</li>
          <li>1000 =&gt; 壹仟元整</li>
        </ul>
      </article>
    </>
  );
}
