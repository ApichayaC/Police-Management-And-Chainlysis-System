import React from "react";
import { Form, Input, Button, Checkbox } from 'antd';
import axios from 'axios'
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'

export default function Login() {
    const router = useRouter();
    const url = 'http://127.0.0.1:3333';

    const onFinish = async(values: any) => {
        //const user = await axios.post('http://127.0.0.1:3333/login',{username:values.username,password:values.password})
        const user = await axios.post(url+'/login',{username:'1808 09318 0283',password:'3130100000000'})
        
        console.log('Success:', values);
        console.log(user)
        if(user.data.status){
            router.push({
                pathname: 'home',
            })
            localStorage.setItem('user','success')
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div style={{ backgroundColor: '#EAEAEA',display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw',height:'100vh' }}>
            <div>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder='username' />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder='password'  />
                    </Form.Item>

                    {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item> */}

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )

}