import React, { useState } from "react";
import { LockClosedIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useRouter } from "next/router";


export default function Login() {
    const router = useRouter();
    const url = 'http://127.0.0.1:3333';
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const onFinish = async (values: any) => {
        if(username && password){
            const user = await axios.post(url + '/login', { username: username, password: password })
            //const user = await axios.post(url+'/login',{username:'1808 09318 0283',password:'3130100000000'})
    
    
            console.log('Success:', values);
            console.log('login', user)
            if (user.data.status) {
                if (user.data.role == 'Admin') {
                    router.push({
                        pathname: 'home',
                    })
                }
                else if (user.data.role == 'Editor') {
                    router.push({
                        pathname: 'police_list',
                    })
                }
                localStorage.setItem('user', 'success');
                localStorage.setItem('role', user.data.role);
            }
        }
        else{
            onFinishFailed('failed')
        }
        
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="h-screen w-full flex items-center justify-center py-8 px-4  bg-slate-200 font-mono" >
            <div className="max-w-md w-full">
                <div>
                    <h2 className="text-center text-2xl font-extrabold rounded-full bg-sky-700 py-2 text-sky-200 shadow">Sign in to your account</h2>
                </div>
                <div
                    className="mt-8 space-y-6"
                    //onFinish = {onFinish}
                    >
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Username
                            </label>
                            <input
                                id="email-address"
                                name="username"
                                type="username"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                onChange={(v)=>{setUsername(v.target.value)}}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                onChange={(v)=>{setPassword(v.target.value)}}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            onClick={onFinish}
                            className="group relative w-2/5 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                            </span>
                            Sign in
                        </button>
                    </div>
                </div>
                </div>
            </div>
    )

}