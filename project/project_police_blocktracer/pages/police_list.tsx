import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { Button, Space,Input,Table } from "antd";

export default function List() {
    const URL = "http://127.0.0.1:3333";
    const router = useRouter();
    const [list, setList] = useState<string[][]>([]);
    const [search, setSearch] = useState('');
    const [name, setName] = useState();

    const getName = async () => {
        let lists = await axios.get(URL + '/shows');
        setList(Object.assign([], lists.data.sort((a: any, b: any) => a.id - b.id)));
        setName(Object.assign([], lists.data.sort((a: any, b: any) => a.id - b.id)));
    }
    useEffect(() => {
        getName()
    }, []);

    const searchName = async (person: any) => {
        await list.map((item: string[], index: number) => {
            if (item.name.includes(search)) {
                return person.push(item)
            }
            else {
                console.log(name)
            }
        });
        setName(person);

    }

    const columns: any = [
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
            render: (text: string[], record: number) => (
                <Space size="middle">
                    <Button onClick={() => {
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
        <div style={{ backgroundColor: '#EAEAEA', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0.5rem', height: '100vh' }}>
<div>

<div style={{justifyContent:'center',textAlign:'center',margin:'30px'}}>
    <h1>ค้นหารายชื่อ</h1>
    <Input  type='text' style={{ width: 300 }} onChange={e => setSearch(e.target.value.trim())} />
    <Button  onClick={searchName}>Search</Button>
</div>
<Table
    pagination={{ position: 'center' }}
    dataSource={name}
    columns={columns}
    
    />
</div>
        </div>
    )
}