import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from 'axios'
import { Button, Space } from "antd";

export default function List() {
    const URL = "http://127.0.0.1:3333";
    const router = useRouter();
    const [list, setList] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [name, setName] = useState<any[]>([]);

    const getName = async () => {
        let lists = await axios.get(URL + '/shows');
        console.log(lists)
        lists.data = lists.data.sort((a: any, b: any) => a.id - b.id);
        const newList = lists.data.length > 0 && lists.data.map((item: any, index: number) => {
            return { ...item, index: index + 1 }
        })
        setList(newList);
        setName(newList);
        console.log(name);

    }
    useEffect(() => {
        const storage = localStorage.getItem('user')
        if (storage == 'success') {
            getName()
        }
        else {
            router.push({
                pathname: 'login'
            })
        }

    }, []);

    const searchName = async () => {
        let i = 0
        let person = list.length > 0 && list.filter((item: any, index: number) => {
            if (item.name.indexOf(search) != -1) {
                return item
            }
        }) || [];
        person = person.map((item: any) => {
            i++
            return { ...item, index: i }
        })
        console.log('person', person);
        setName(person || []);
    }

    const [loginCheck, setLoginCheck] = useState('');
    const [checkRole, setCheckRole] = useState('');
    useEffect(() => {
        const user = localStorage.getItem('user');
        const role = localStorage.getItem('role');
        setLoginCheck(user);
        setCheckRole(role);
    }, [loginCheck, checkRole])

    return (
        <div className="bg-slate-200 h-full font-mono text-8xl">
            <div className="flex items-center justify-between bg-sky-900 rounded-b-lg w-full">
                <div className="flex-1 min-w-0 ">
                    <h2 className="ml-8 text-8xl font-mono leading-7 text-sky-100 sm:text-3xl sm:truncate">Information</h2>
                </div>
                <div className="lg:my-4 lg:mr-8 flex grid justify-items-end">
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
            <div className="mt-4 px-8 ">
                <label className="block text-5xl text-sky-700 grid justify-items-center ">
                    ค้นหารายชื่อ
                </label>

                <div className="mt-1 relative rounded-md grid justify-items-center mt-2">
                    <input
                        type="text"
                        onChange={e => { setSearch(e.target.value.trim()); searchName() }}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-5/12 pl-7 pr-12 sm:text-sm border-gray-300 rounded-lg"
                    />

                    <button
                        type="button"
                        onClick={searchName}
                        className="px-4 py-2 border border-transparent my-4 rounded-lg shadow-sm text-sm font-medium text-sky-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                    >
                        Search
                    </button>
                </div>
            </div>
            <div className="flex flex-col px-8 ">
                <div className="-mt-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="pt-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table
                                className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xl font-medium text-sky-900 uppercase tracking-wider"
                                        >
                                            ลำดับที่
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xl font-medium text-sky-900 uppercase tracking-wider"
                                        >
                                            ยศ
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xl font-medium text-sky-900 uppercase tracking-wider"
                                        >
                                            ชื่อ
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xl font-medium text-sky-900 uppercase tracking-wider"
                                        >
                                            นามสกุล
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xl font-medium text-sky-900 uppercase tracking-wider">
                                            แสดงข้อมูล
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {name.map((person) => (
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-lg text-gray-500">{person.index}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg text-sky-900">{person.rank}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg text-sky-900">{person.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg text-sky-900">{person.surname}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                                                <div className="flex items-center ml-4">
                                                    <a className="text-indigo-600 hover:text-indigo-900"
                                                        onClick={() => {
                                                            router.push({
                                                                pathname: 'profile',
                                                                query: { id: person.id || '' }
                                                            })
                                                        }}
                                                        style={{ cursor: 'pointer' }}>
                                                        Show
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-200 ml-8 my-2">
                <a href="/home">
                    {checkRole == "Admin" ?
                    <button
                        type="button"
                        className="flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-sky-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Back
                    </button> : ''}
                </a>
            </div>
        </div>

    )
}