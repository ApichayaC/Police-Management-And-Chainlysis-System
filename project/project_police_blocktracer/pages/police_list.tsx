import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { Button, Space} from "antd";
import { Popover } from '@headlessui/react'

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

    const people = [
        {
            title: 'ลำดับที่',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'ยศ',
            dataIndex: 'rank',
            key: 'rank',
        },
        {
            title: 'ชื่อ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'นามสกุล',
            dataIndex: 'surname',
            key: 'surname',
        },
        {
            title: 'แสดงข้อมูล',
            key: 'action',
            render: (text: string[], record: any) => {
                return (
                    <Space size="middle" key={record.id || ''} >
                        <Button onClick={() => {
                            router.push({
                                pathname: 'profile',
                                query: { id: record.id || '' }
                            })
                        }
                        }>Click</Button>
                    </Space>
                )
            },
        },
    ];

    const [loginCheck, setLoginCheck] = useState('');
    const [checkRole, setCheckRole] = useState('');
    useEffect(() => {
        const user = localStorage.getItem('user');
        const role = localStorage.getItem('role');
        setLoginCheck(user);
        setCheckRole(role);
    }, [loginCheck, checkRole])

    return (
        <div style={{ padding: '2rem 2rem'}}
            className="bg-slate-200">
            <Popover className="relative bg-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                        <div className="lg:flex lg:items-center lg:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Information</h2>
                            </div>
                            <div className="mt-6 lg:mt-5 lg:ml-4 flex grid justify-items-end">
                                <span className="sm:ml-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.removeItem('user')
                                            router.push({
                                                pathname: 'login'
                                            })
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Log Out
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Popover>

            <div className="mt-4">
                <label htmlFor="price" className="block text-2xl font-medium text-gray-700 grid justify-items-center">
                    ค้นหารายชื่อ
                </label>
                <div className="mt-1 relative rounded-md shadow-sm grid justify-items-center mt-2">
                    <input
                        type="text"
                        onChange={e => { setSearch(e.target.value.trim()); searchName() }}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-5/12 pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                        type="button"
                        onClick={searchName}
                        className="px-4 py-2 border border-transparent my-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                    >
                        Search
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table
                                className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            ลำดับที่
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            ยศ
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            ชื่อ
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            นามสกุล
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                        <div className="text-sm text-gray-500">{person.index}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{person.rank}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{person.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.surname}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <a href="/home">
                    <button
                        type="button"
                        className="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Back
                    </button>
                </a>
            </div>
        </div>

    )
}