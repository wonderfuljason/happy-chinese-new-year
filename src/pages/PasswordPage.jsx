import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const PasswordForm = styled.div`
  width: 300px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    // 设置密码为 "0920"
    if (password === '0920') {
      navigate('/home');
    } else {
      message.error('密码错误，请重试！');
    }
  };

  return (
    <Container>
      <PasswordForm>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>请输入访问密码</h2>
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          style={{ marginBottom: 16 }}
          onPressEnter={handleSubmit}
        />
        <Button type="primary" block onClick={handleSubmit}>
          确认
        </Button>
      </PasswordForm>
    </Container>
  );
};

export default PasswordPage; 