import Head from "next/head";
import { Form, Input, Button, Divider, Upload, message, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { request } from "@/utils/request";
import styles from "@/styles/blog.module.css";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface certInfo {
  sha256: string;
  sha1: string;
  pinsha256: string;
  serialNumber: string;
  issuer: string;
  subject: string;
  notBefore: string;
  notAfter: string;
  signatureAlgo: string;
  publicKeyAlgo: string;
  basicConstraintsValid: boolean;
  isCA: boolean;
  ocspServer: string[];
  issuingCertificateURL: string[];
  crlDistributionPoints: string[];
  dnsNames: string[];
  emailAddresses: string[];
  ipAddresses: string[];
}

export default function CertParse() {
  const [form] = Form.useForm();

  const [paste, setPaste] = useState("");
  const [file, setFile] = useState<any>(null);
  const [info, setInfo] = useState<certInfo>();

  const onFinish = (e: any) => {
    e.preventDefault();

    if (!paste && !file) {
      message.error("请粘贴证书内容或上传文件");
      return;
    }
    console.log(file);
    if (file) {
      return onUploadFile();
    }
    request("/box-api/v1/pkica/cert-parse", {
      method: "POST",
      body: JSON.stringify({ cert: paste }),
    })
      .then((resp) => {
        if (resp.code !== 0) return message.error(resp.error);
        setInfo(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onUploadFile = () => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      request("/box-api/v1/pkica/cert-parse", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: e.target.result,
      })
        .then((resp) => {
          if (resp.code !== 0) return message.error(resp.error);
          setInfo(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Head>
        <title>CERT解析 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>CERT解析</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="待处理值"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea
            placeholder="粘贴文件"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={8}
          />
          {!paste && (
            <div
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
              }}
            >
              <Upload
                onChange={(info) => {
                  if (!info.file.status) setFile(info.file);
                }}
                beforeUpload={() => false}
                maxCount={1}
                onRemove={() => setFile(undefined)}
              >
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            CERT解析
          </Button>
        </Form.Item>
        {info && (
          <Form.Item label="处理结果">
            <List size="small">
              {Object.keys(info).map((k) => (
                <List.Item key={k}>
                  <small
                    style={{
                      display: "inline-block",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    {k.toUpperCase()}
                  </small>
                  {" : "}
                  {(info as any)[k]}
                </List.Item>
              ))}
            </List>
          </Form.Item>
        )}
      </Form>
      <Divider />
      <article className={styles.container}>
        <h3>X.509证书解析</h3>

        <h4>一、X.509证书简介</h4>

        <p>X.509是一种数字证书标准,用于PublicKey Infrastructure(PKI)。</p>

        <p>X.509证书通过数字签名建立标识信任链,用于网络安全认证。</p>

        <h4>二、证书内容解析</h4>

        <p>X.509证书主要包含以下信息:</p>

        <ul>
          <li>版本号 - v1、v2或v3</li>
          <li>序列号 - 证书唯一标识</li>
          <li>签名算法 - 证书签名所用算法</li>
          <li>颁发者 - 证书颁发机构信息</li>
          <li>有效期 - 证书生效和过期时间</li>
          <li>主体 - 用户或设备标识信息</li>
          <li>公钥 - 加密公钥</li>
          <li>证书签名 - 颁发机构对信息的签名</li>
        </ul>

        <h4>三、证书验证</h4>

        <p>验证X.509证书的主要步骤:</p>

        <ol>
          <li>检查版本号是否最新</li>
          <li>确认颁发机构可信任</li>
          <li>检验证书有效期</li>
          <li>检查证书签名的正确性</li>
        </ol>

        <h4>四、证书信任链</h4>

        <p>X.509证书验证也依赖证书信任链:</p>

        <ul>
          <li>根证书签名中间CA证书</li>
          <li>中间CA证书签名服务器证书</li>
          <li>设备内置受信任的根证书</li>
        </ul>
      </article>
    </>
  );
}
