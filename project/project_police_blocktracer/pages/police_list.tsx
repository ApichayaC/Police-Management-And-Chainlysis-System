import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { Button, Space, Input, Table } from "antd";
import Item from "antd/lib/list/Item";
import ListBody from "antd/lib/transfer/ListBody";

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
        const newList = lists.data.length > 0 &&  lists.data.map((item: any,index:number)=>{
           return {...item, index: index+1} 
        })
        setList(newList);
        setName(newList);
        console.log(name);

    }
    useEffect(() => {
        getName()
    }, []);

    // const searchName = async (

    // ) => {
    //     const person = [];
    //     await list.map((item, index: number) => {
    //         if (item.name.includes(search)) {
    //             return person.name.push(item)
    //         }
    //         else {
    //             console.log(name)
    //         }
    //     });
    //     setName(person);

    // }
    const searchName = async () => {
        let i = 0
        let person = list.length > 0 && list.filter((item: any,index : number) => {
            if (item.name.indexOf(search) != -1) {
                return item
            }
        })||[];
        person = person.map((item: any)=> {
            i++
            return {...item,index:i}
        })
        console.log('person', person);
        setName(person || []);
    }

    const columns: any = [
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


    return (
        <div style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem 2rem', width: '100vw' }}>
            <div className={styles.tapbar}>
                <p className={styles.font_top}>INFORMATION</p>
            </div>
            <div className={styles.box_info}>

                <div style={{ justifyContent: 'center', textAlign: 'center', margin: '30px' }}>
                    <h1 style={{ fontSize: '32px' }}>ค้นหารายชื่อ</h1>
                    <Input type='text' style={{ width: 300 }} onChange={e => { setSearch(e.target.value.trim()); searchName() }} />
                    <Button onClick={searchName}>Search</Button>
                </div>
                <div className={styles.table}>
                    <Table
                        style={{ width: '90%' }}
                        dataSource={name}
                        columns={columns}
                    />
                </div>
                <div style={{ justifyContent:'center', textAlign:'left', padding: '0px 20px 30px 70px' }}>
                    <Button
                        href='/home'>
                        Back
                    </Button>
                </div>


            </div>
        </div>
    )
}