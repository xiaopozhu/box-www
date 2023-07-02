import { useState, useEffect, SetStateAction } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Select, Row, Col, message } from "antd";
import type { SelectProps } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { request } from "@/utils/request";

import styles from "@/styles/content.module.css";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

interface boxInfo {
  id: string;
  title: string;
  cards: any[];
}

export default function Home(props: any) {
  const { profile } = props;

  const [boxs, setBoxs] = useState<boxInfo[]>([]);
  const [value, setValue] = useState<string>();
  const [data, setData] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    handleFetchBoxs();
  }, []);

  const handleFetchBoxs = () => {
    request("/api/v1/boxs", {
      method: "GET",
    }).then((resp) => {
      if (resp.code === 0) {
        setBoxs(resp.data);
      }
    });
  };

  const handleSearch = (newValue: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = newValue;
    const fake = () => {
      if (currentValue === newValue) {
        const temp: SelectProps["options"] = [];
        boxs.forEach((box) => {
          if (box.cards) {
            box.cards.forEach((item) => {
              let ok = item.id.includes(newValue);
              if (!ok) {
                ok = item.name.includes(newValue);
              }
              if (!ok && item.tags) {
                ok = item.tags.includes(newValue);
              }
              if (ok) {
                temp.push({
                  value: item.path,
                  label: item.name,
                });
              }
            });
          }
        });
        setData(temp);
      }
    };
    if (newValue) {
      timeout = setTimeout(fake, 300);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSelect = (value: string) => {
    location.href = value;
  };

  const handleFavorite = (id: string) => {
    if (!profile) {
      return;
    }
    request("/api/v1/user/favorite", {
      method: "PUT",
      body: JSON.stringify({ toolID: id }),
    }).then((resp) => {
      if (resp.code !== 0) {
        message.error(resp.error);
      } else {
        handleFetchBoxs();
      }
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Head>
        <title>CryptoBox密码工具箱, 您的密码学助手</title>
      </Head>
      <h1>快速搜索工具</h1>
      <Select
        className={styles.searchTools}
        showSearch
        value={value}
        placeholder="搜索密码工具, 如: sha1, base64, aes等"
        style={{ width: "100%", marginTop: "20px" }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        onSelect={handleSelect}
        notFoundContent={null}
        options={data}
        size="large"
      />
      <div style={{ textAlign: "left" }}>
        {boxs.map((box) => {
          return (
            <div style={{ marginTop: "40px" }} key={box.id}>
              <h3 id={box.id} className={styles.customH3}>
                {box.title}
              </h3>
              <Row gutter={16}>
                {box.cards ? (
                  box.cards.map((item) => {
                    return (
                      <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ marginBottom: "16px" }}
                        key={item.id}
                      >
                        <div className={styles.card}>
                          <Link className={styles.cardHeader} href={item.path}>
                            <Image
                              alt={item.name}
                              src={item.icon}
                              width={40}
                              height={40}
                              className={styles.cardAvatar}
                            />
                            <h4 className={styles.cardName}>{item.name}</h4>
                          </Link>
                          <div className={styles.cardBody}>
                            <p className={styles.description}>{item.desc}</p>
                          </div>
                          <div className={styles.cardFooter}>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => handleFavorite(item.id)}
                            >
                              {item.isFavorite ? (
                                <HeartFilled />
                              ) : (
                                <HeartOutlined />
                              )}
                            </span>
                          </div>
                        </div>
                      </Col>
                    );
                  })
                ) : (
                  <Col>无</Col>
                )}
              </Row>
            </div>
          );
        })}
      </div>
    </div>
  );
}
