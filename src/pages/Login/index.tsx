import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';

import styles from './index.less';
import { authApi } from '@/services/api';
import { setLocalData } from '@/utils';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<any>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    setLocalData('token', '');
    setLocalData('user', {});
    setLocalData('permissionCodes', [] as any);
  }, [])

  // const goto = () => {
  //   if (!history) return;
  //   setTimeout(() => {
  //     const { query } = history.location;
  //     const { redirect } = query as {
  //       redirect: string;
  //     }; // history.push(redirect || '/');

  //     window.location.href = redirect || '/';
  //   }, 10);
  // };

  const fetchUserInfo = async (userInfo?: any) => {
    await setLocalData('user', userInfo);
    // 缓存权限数据
    await setLocalData('permissionCodes', userInfo.resourceCodes);
    // const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
        permissionCodes: userInfo.resourceCodes
      }));
    }
  };

  /** 获取用户信息 */
  const getUserInfo = async () => {
    const res = await authApi.info({});
    if (res && res.code === 200) {
      await fetchUserInfo(res?.data);
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      // 登录
      const res = await authApi.login(values);
      if (res && res?.code === 200) {
        message.success('登录成功！');
        // 设置用户Token信息
        await setLocalData('token', res.data?.token);
        // 获取用户信息
        await getUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else {
        message.error(res?.msg);
      }
      console.log(res);
      // 如果失败去设置用户错误信息
      setUserLoginState(res);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };
  // const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="销售管理系统"
          subTitle=''
          initialValues={{
            autoLogin: true,
          }}
          actions={[]}
          onFinish={async (values) => {
            await handleSubmit(values as any);
          }}
          className={styles.loginForm}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab='账户密码登录'
            />
            {/* <Tabs.TabPane
              key="mobile"
              tab='手机号登录'
            /> */}
          </Tabs>

          {/* {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content='账户或密码错误(admin/ant.design)'
            />
          )} */}
          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder='请输入...'
                rules={[
                  {
                    required: true,
                    message: `请输入用户名!`,
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder='请输入...'
                rules={[
                  {
                    required: true,
                    message: `请输入密码！`,
                  },
                ]}
              />
            </>
          )}

          {/* {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder='手机号'
                rules={[
                  {
                    required: true,
                    message: `请输入手机号！`,
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: `手机号格式错误！`,
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder='请输入验证码'
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} 获取验证码`;
                  }
                  return `获取验证码`;
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: `请输入验证码！`,
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (result === false) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )} */}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
