import { request } from "@/utils/request";
import { Divider, Form, Input, Button, List, message } from "antd";
import { useState } from "react";
import Head from "next/head";
import styles from "@/styles/blog.module.css";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface urlResult {
  scheme: string;
  user: string;
  host: string;
  path: string;
  rawQuery: string;
  fragment: string;
}

export default function URLParse() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<urlResult>();

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/box-api/v1/other/url-parse", {
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
        <title>URL解析 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>URL解析</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="待处理值"
          name="text"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea
            placeholder="[scheme:][//[userinfo@]host][/]path[?query][#fragment]"
            rows={2}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            URL解析
          </Button>
        </Form.Item>
        {result && (
          <Form.Item label="处理结果">
            <List size="small">
              {Object.keys(result).map((k) => (
                <List.Item key={k}>
                  <small
                    style={{
                      display: "inline-block",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    {k.toUpperCase()}
                    {" : "}
                  </small>
                  {(result as any)[k]}
                </List.Item>
              ))}
            </List>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>URL解析</h3>

        <h4>一、什么是URL</h4>

        <p>URL(Uniform Resource Locator)是互联网上标准资源的地址。</p>

        <p>URL包含访问资源所需要的网络协议、域名、路径等信息。</p>

        <h4>二、URL的组成部分</h4>

        <p>一个典型的URL由以下几部分组成:</p>

        <ul>
          <li>协议 - 如HTTP、HTTPS、FTP等</li>
          <li>域名 - 访问资源的服务器地址</li>
          <li>端口 - 可选,省略时使用协议默认端口</li>
          <li>路径 - 资源在服务器上的具体文件路径</li>
          <li>查询参数 - 可选,以键值对形式附加信息</li>
        </ul>

        <h4>三、URL解析的作用</h4>

        <p>解析URL主要有以下用途:</p>

        <ul>
          <li>判断通信协议,连接服务器</li>
          <li>定位资源所在主机</li>
          <li>提取访问资源需要的路径信息</li>
          <li>获得参数信息</li>
        </ul>

        <h4>四、URL解析函数</h4>

        <p>常见的URL解析函数:</p>

        <ul>
          <li>JavaScript中的url.parse()</li>
          <li>Python中的urllib.parse模块</li>
          <li>Java中的java.net.URL类</li>
          <li>PHP中的parse_url()函数</li>
        </ul>
      </article>
    </>
  );
}
