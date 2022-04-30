import React, { useState, useEffect } from "react";
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
        <div className="bg-slate-200 w-full h-screen">
            <div className="grid justify-items-center">
                <div className="flex items-center justify-between bg-sky-900 rounded-b-lg w-full ">
                    <div className="flex-1 min-w-0 ">
                        <h2 className="ml-8 text-8xl font-mono leading-7 text-sky-100 sm:text-3xl sm:truncate">Home</h2>
                    </div>
                    <div className="lg:my-4 lg:mr-8 flex grid justify-items-end ">
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem('user')
                                router.push({
                                    pathname: 'login'
                                })
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-sky-900 bg-slate-200 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
                <div className="flex items-center x-20 my-36">
                    <div className="flex flex-col  w-full flex items-center">
                        <div className="ml-8 flex">
                            <div className="border-4 border-cyan-900 rounded-xl h-96 w-80 ">
                                <div className="flex items-center justify-center my-4">
                                    <img src='/police.png' width={250} />
                                </div>
                                <div className="justify-center grid content-end">
                                    <a
                                        href="/police_list"
                                        className="flex items-center justify-center px-11 py-5 text-xl rounded-xl shadow text-white bg-indigo-600 "
                                    >
                                        ข้อมูลตำรวจ
                                    </a>
                                </div>
                            </div>
                            <div className="border-4 border-cyan-900 rounded-xl h-96 w-80 ml-12 ">
                                <div className="flex items-center justify-center my-4">
                                    <img src='/blockchain.png' width={250} />
                                </div>
                                <div className="flex items-end justify-center">
                                    <a
                                        href="/block_tracer"
                                        className="flex items-center justify-center px-10 py-5 text-xl rounded-xl shadow text-indigo-600 bg-white "
                                    >
                                        Block Tracer
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div >

    )
}