import React, { useState, useEffect } from "react";
import styles from '../styles/Home.module.css'
import info_police from '../pages'
import { useRouter } from 'next/router';


export default function Home() {
    const [loginCheck, setLoginCheck] = useState('');
    const router = useRouter();
    useEffect(() => {
        const user = localStorage.getItem('user');
        const role = localStorage.getItem('role')
        if (user == 'success') {
            if (role == 'Editor') {
                router.push({
                    pathname: 'police_list'
                })
            }
        }
        else {
            router.push({
                pathname: 'login'
            })
        }
        setLoginCheck(user);
    }, [loginCheck])

    return (
        <div
            className="bg-slate-200"
            style={{ width: "100vw", height: "100vh" }}>
            <div className="h-full">
                <div className="className=bg-slate-200 flex grid justify-items-end">
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem('user')
                            router.push({
                                pathname: 'login'
                            })
                        }}
                        className="inline-flex items-center px-4 mt-6 mr-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log Out
                    </button>
                </div>
                <div className="inline-flex grid justify-items-center flex items-center h-3/6 mt-20 place-content-center">
                    <div className="mt-24 border-4 border-slate-500 rounded-3xl border-gray-400 p-4 w-96 ">
                        <div className="max-w-7xl mx-auto mt-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                            <div className="my-38 flex lg:mt-0 lg:flex-shrink-0">
                                <div className="inline-flex rounded-md shadow">
                                    <a
                                        href="/police_list"
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        ข้อมูลตำรวจ
                                    </a>
                                </div>
                                <div className="ml-4 inline-flex rounded-md shadow">
                                    <a
                                        href="/block_tracer"
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                                    >
                                        Block Tracer
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >

    )
}