import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Proflie from '../pages/profile'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Button, Input, Radio, Table, Space } from 'antd';

export default function NameList() {
    const URL = 'http://127.0.0.1:3333'
    const router = useRouter()
    const [list, setList] = useState([])
    const [search, setSearch] = useState('');
    const [name, setName] = useState([]);

    const getName = async () => {
        let lists = await axios.get(URL + '/shows')
        console.log(lists)
        setList(Object.assign([], lists.data.sort((a,b)=> a.id-b.id)));
        setName(Object.assign([], lists.data.sort((a,b)=> a.id-b.id)));
    }
    const allName = () => {
        return name.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.rank}</td>
                    <td>{item.name}</td>
                    <td>{item.surname}</td>
                    {/* <Link href='/profile'><button>แสดงข้อมูล</button></Link> */}
                    <button onClick={() => {
                        router.push({
                            pathname: 'profile',
                            query: { id: item.id }
                        })
                    }}>Click</button>
                </tr>
            )
        })
    }
    useEffect(() => {
        getName()
    }, [])

    //search
    const searchName = async () => {
        let person = [];
        await list.map((item, index) => {
            console.log(item.name.includes(search));
            if (item.name.includes(search)) {
                person.push(item)
            } else {
                console.log(name);
            }
        })
        setName(person)
    }



    const columns = [
        {
            title: 'ลำดับที่',
            dataIndex: 'id',
            key: 'id',
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
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={()=>{
                        router.push({
                            pathname: 'profile',
                            query: { id: record.id }
                        })
                    }
                    }>Click</Button>
                </Space>
            ),
        },
    ];
    return (
        <div >
            <div>

                <div style={{justifyContent:'center',textAlign:'center',margin:'30px'}}>
                    <h1>ค้นหารายชื่อ</h1>
                    <Input  type='text' style={{ width: 300 }} onChange={e => setSearch(e.target.value.trim())} />
                    <Button  onClick={searchName}>Search</Button>
                </div>
                {/* <table>     
                    <tr>
                        <td>ลำดับที่</td>
                        <td>ยศ</td>
                        <td>ชื่อ</td>     
                        <td>นามสกุล</td>
                        <td>แสดงข้อมูล</td>
                    </tr>
                    {allName()}
                </table> */}
                <Table
                    pagination={{ position: 'center' }}
                    dataSource={name}
                    columns={columns}
                    
                    />
            </div>
        </div>
    )
}