import { request } from "@/utils/request";
import { Divider, Form, Input, Button, List, message } from "antd";
import { useState } from "react";
import Head from "next/head";
import { ipInfo } from "@/model/model";
import styles from "@/styles/blog.module.css";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function GeoIP() {
  const [form] = Form.useForm();

  const [result, setResult] = useState<ipInfo>();

  const onFinish = (e: any) => {
    e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        request("/api/v1/other/geoip", {
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
        <title>GeoIP - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>GeoIP</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="指定IP地址"
          name="ip"
          rules={[{ type: "string", min: 1 }]}
        >
          <TextArea
            placeholder="不填则获取本机IP地址, eg. 114.114.114.114"
            rows={2}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            GeoIP
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
        <h3>GeoIP解析</h3>

        <h4>一、GeoIP简介</h4>

        <p>GeoIP是根据IP地址来解析地理位置信息的一种技术。</p>

        <p>它可以提供IP所在的国家、区域、城市、经纬度等信息。</p>

        <h4>二、工作原理</h4>

        <p>GeoIP解析主要通过以下方法实现:</p>

        <ul>
          <li>GeoIP数据库 - 将IP地址段映射到地理信息</li>
          <li>第三方API查询 - 调用GeoIP服务商的API接口</li>
          <li>网络测距 - 广播探测IP所属的路由器位置</li>
        </ul>

        <h4>三、应用场景</h4>

        <p>GeoIP的典型应用:</p>

        <ul>
          <li>网站访问者分析</li>
          <li>网络安全和访问控制</li>
          <li>内容分发和使用许可</li>
          <li>网络优化和负载均衡</li>
        </ul>

        <h4>四、案例分析</h4>

        <p>查询案例:</p>

        <ul>
          <li>IP: 202.108.22.5 =&gt; 中国|北京|联通</li>
          <li>IP: 180.97.33.25 =&gt; 中国|广东|深圳</li>
          <li>IP: 8.8.8.8 =&gt; 美国|加利福尼亚州|Google DNS</li>
        </ul>
      </article>
    </>
  );
}
