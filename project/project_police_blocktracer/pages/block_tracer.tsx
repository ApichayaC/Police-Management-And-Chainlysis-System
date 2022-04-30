import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Button, Input, Modal, notification, Select } from 'antd';
import useAppStore from '../store';
import { useRouter } from 'next/router';

import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected'

import { Edge, GraphInput } from '../src/types'
import { THEIF_ADDRESSES, BN_ADDRESSES } from '../src/common/constants'
import axios from 'axios'
import config from '../config'

import lineNoti from '../store/line'

const BASE_URL = 'http://block.werapun.com:4005';
const PAGE_SIZE = 5;

const Block_Tracer = () => {

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [level, setLevel] = useState('4');
    const [page, setPage] = useState('1');
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState([]);

    const [relations, setRelations] = useState<GraphInput>();
    const [visible, setVisible] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>(null);

    const router = useRouter();


    const getAccountRelations = async (from: string, to: string, level = 1, limit = 20, offset = 0) => {
        const url = `${BASE_URL}/graph/trace?from=${from}&to=${to}&level=${level}&limit=${limit}&offset=${offset}`;
        //const url = `http://localhost:4000/graph/trace?from=${from}&to=${to}&level=${level}&limit=${limit}&offset=${offset}`;
        //const url2 = `http://localhost:4000/graph/trace?from=${from}&to=${to}&level=${level}&limit=${limit}&offset=${offset}`;
        console.log(url);
        console.log('from', from);
        const res = await axios.get(url).then(res => res.data as GraphInput);
        //const res2 = await axios.get(url2).then(res => res.data as GraphInput);
        console.log('res', res);
        //console.log('res2', res2);
        // const promise: any = []
        // res.edges.map((value) => {
        //     promise.push(getAmount(value))
        // })
        // Promise.all(promise).then((value: any) => {
        //     try {
        //         console.log(value);
        //         // res.edges = value;
        //         setAmount(value);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // })
        return res
    }

    const chartRef = useRef<am4plugins_forceDirected.ForceDirectedTree | null>(null);

    // const getAmount = async (value: any) => {
    //     return new Promise(async (resolve, reject) => {
    //         const url = `${BASE_URL}/transaction/${value.data.hash}`;
    //         const amount = await axios.get(url).then(res => {
    //             return res.data.amount
    //         }).catch(err=>{
    //             console.log(err);
    //         })
    //         console.log('amount',amount)
    //         resolve({ hash: value.data.hash, amount });

    //     })
    // }

    //Graph
    useLayoutEffect(() => {
        let chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
        let series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
        series.dataFields.value = "value";
        series.dataFields.name = "name";
        series.dataFields.children = "children";
        series.dataFields.id = "name";
        series.dataFields.linkWith = "linkWith";
        series.fontSize = 15;

        let linkTemplate = series.links.template;
        linkTemplate.strokeWidth = 1;
        linkTemplate.events.on('hit', function (ev) {
            console.log("Click link: ", ev.target)
        })

        series.links.template.adapter.add("strokeWidth", function (width: any, target: any) {
            var from = target.source;
            //var to = target.target;
            var widths = from.dataItem.dataContext.amount;
            if (widths > 0 && widths < 3000) {
                return 2
            }
            else if (widths > 3000 && widths < 6000) {
                return 10
            }
            else if (widths > 6000 && widths < 10000) {
                return 18
            }
            else if (widths > 10000) {
                return 30
            }
            return width;
        });

        let linkHoverState = linkTemplate.states.create("hover");
        linkHoverState.properties.strokeOpacity = 1;
        linkHoverState.properties.strokeWidth = 2;

        let nodeTemplate = series.nodes.template;
        nodeTemplate.label.text = "{name}";
        nodeTemplate.tooltipText = "{name}";
        nodeTemplate.fillOpacity = 1;
        nodeTemplate.label.hideOversized = true;
        nodeTemplate.label.truncate = true;
        nodeTemplate.events.on('hit', (ev) => {
            handleClickNode((ev.target.dataItem as any).name);
        })

        chart.legend = new am4charts.Legend();

        chartRef.current = chart;

        return () => {
            chart.dispose();
        }

    }, []);



    useEffect(() => {
        if (chartRef.current && relations) {

            const nodeMaps = relations.nodes.reduce((prev, cur) => {
                const fromLabel = getLabelledAddress(cur);
                console.log('fromLabel', fromLabel);

                if (!prev[fromLabel]) prev[fromLabel] = { dests: [], txList: [] };
                return prev;
            }, {} as Record<string, { dests: string[], txList: string[] }>)

            const connectionMap = relations.edges.reduce((prev, cur) => {
                const fromLabel = getLabelledAddress(cur.from);
                const toLabel = getLabelledAddress(cur.to);
                if (!prev[fromLabel]) prev[fromLabel] = { dests: [], txList: [] };
                prev[fromLabel].dests.push(toLabel);
                prev[fromLabel].txList.push(cur.data.hash);
                return prev;
            }, nodeMaps);
            console.log('nodemap', nodeMaps)
            const fromLabel = getLabelledAddress(from);
            const toLabel = getLabelledAddress(to);

            chartRef.current.data = Object.entries(connectionMap).map(([fromAddr, data]) => {
                //console.log(data.txList)
                const hashCheck: any = [];
                data.txList.map((value, index) => {
                    if (hashCheck.length == 0) {
                        hashCheck.push(value);
                    }
                    else {
                        const found = hashCheck.find((elements: any) => elements == value)
                        //console.log(`${index}found`,found)
                        if (!found) {
                            hashCheck.push(value);
                        }
                    }
                    //console.log('hash',hashCheck)
                })
                console.log("hashcheck", hashCheck)
                // const amounts: any = []
                // hashCheck.map((value: any) => {
                //     amount.filter((hash) => {
                //         if (hash.hash == value) {
                //             amounts.push(hash.amount)
                //         }
                //     })
                // })
                //const total = amounts.reduce((a: any, b: any) => a + b, 0);

                return {
                    name: fromAddr,
                    linkWith: Array.from(new Set(data.dests)),
                    value: [fromLabel, toLabel].includes(fromAddr) ? 10 : 5,
                    txList: Array.from(new Set(data.txList)),
                    //amount: total

                }
            });

            console.log(chartRef.current.data);
        }

        const storage = localStorage.getItem('user')
        const role = localStorage.getItem('role')
        if (storage == 'success') {
            if (role == 'Admin') {
                //loadRelations();
                router.push({
                    pathname: 'block_tracer'
                })
            }
            else {
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
    }, [chartRef.current, relations]);

    const handleClickNode = (address: string) => {
        if (chartRef.current) {
            const node = chartRef.current.data.find(n => n.name === address);

            if (node) {
                setSelectedNode(node);
                setVisible(true);
            }
        }
    }
    const date = new Date();

    // const notify = async () => {
    //     console.log('relation', chartRef.current.data)

    //     try {
    //         if (chartRef.current.data.length > 0) {
    //             for (let i = 0; i < 4; i++) {
    //                 if (i < chartRef.current.data.length && chartRef.current.data[i].linkWith.length > 0) {
    //                     const request = await axios.post("/api/notify", {
    //                         message: `Date : ${date.toLocaleString()}
    //                         Transaction From : ${chartRef.current.data[i].name}
    //                         exchange to
    //                         Transaction To : ${chartRef.current.data[i].linkWith.join(",")}`
    //                     })
    //                 }
    //                 if (i == 3) {
    //                     const request = await axios.post("/api/notify", {
    //                         message: `See more transactions on your website`
    //                     })
    //                 }
    //             }

    //         }

    //     } catch (e) {

    //     }
    // }

    //button tracer
    const handleClick = async () => {
        // lineNoti('test')
        // notify()
        // console.log('line')

        await loadRelations();
    }
    //button update
    const updateData = async () => {
        const putGraph = await axios.get(`${BASE_URL}/graph/put`);
        return putGraph;
    }

    const loadRelations = async () => {
        setLoading(true);
        try {
            console.time("loadRelations");
            const res = await getAccountRelations(from, to, +level, PAGE_SIZE, (+page - 1) * PAGE_SIZE);
            console.timeEnd("loadRelations");
            setRelations(res);
        } catch (e: any) {
            notification['error']({
                message: "Failed",
                description: e.message
            })
        }
        setLoading(false);
    }

    useAppStore(state => state.addressList);
    const getLabelledAddress = useAppStore(state => state.getLabelledAddress);

    return (
        <div className="bg-slate-200">
            <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="flex items-center justify-between bg-sky-900 rounded-b-lg w-full">
                    <div className="flex-1 min-w-0 ">
                        <h2 className="ml-8 text-8xl font-mono leading-7 text-sky-100 sm:text-3xl sm:truncate">Block Tracer</h2>
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
                <main>
                    <div className="max-w-7xl mx-auto py-6 ">
                        <div className='px-4 py-6'>
                            <div className="border-4 border-sky-800 rounded-2xl">
                                <div style={{ padding: '20px' }}
                                    className="bg-slate-100 rounded-2xl">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <label className='flex text-lg text-sky-700 font-mono'>
                                                From
                                            </label>
                                            <input
                                                type="text"
                                                className="rounded-lg relative block w-full px-3 py-2 border border-sky-600 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="Thief"
                                                onChange={(v) => { setFrom(v.target.value.toLowerCase()) }}
                                            />
                                        </div>
                                        <div>
                                            <label className='flex text-lg text-sky-700 font-mono'>
                                                To
                                            </label>
                                            <input
                                                type="text"
                                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-sky-600 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="Binance"
                                                onChange={(v) => { setTo(v.target.value.toLowerCase()) }}
                                            />
                                        </div>
                                        <div>
                                            <label className='flex text-lg text-sky-700 font-mono'>Levels</label>
                                            <input type="number"
                                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-sky-600 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                value={level} onChange={e => setLevel(e.target.value)} style={{ width: 150 }} />
                                            {/* <Input type='text' style={{ width: 300 }} /> */}
                                        </div>
                                        <div>
                                            <label className='flex text-lg text-sky-700 font-mono'>Pages</label>
                                            <input type="number"
                                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-sky-600 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" value={page} onChange={e => setPage(e.target.value)} style={{ width: 150 }} />
                                        </div>
                                        <div>
                                            <button type="button"
                                                className="flex items-center px-4 py-2 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-sky-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={updateData}>Update</button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => { handleClick() }}
                                                className="flex items-center px-4 py-2 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-sky-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Trace
                                            </button>
                                        </div>

                                    </div>
                                    <div className='mt-2'>

                                        <div className='w-full border-2 border-sky-600 rounded-lg' style={{ minHeight: 600 }}>
                                            <div id="chartdiv" style={{ minHeight: 800 }}></div>
                                        </div>
                                    </div>

                                    <Modal
                                        footer={null}
                                        visible={visible}
                                        title={`Transaction List from ${selectedNode ? selectedNode.name : ''}`}
                                        onCancel={() => setVisible(false)}
                                    >
                                        {
                                            selectedNode && selectedNode.txList.map((hash: string, index: number) => (
                                                <div key={hash}>
                                                    <span>{index + 1} : </span>
                                                    {/* <span> Amount </span>
                                    <span
                                        style={{ color: "red" }}>
                                        {
                                            amount.length > 0 && amount.filter(item => item['hash'] == hash)[0]['amount'] || '-'
                                        }
                                    </span>
                                    <span> USDT , </span> */}
                                                    <a href={`${config.ETHERSCAN_BASE_URL}/tx/${hash}`} target="_blank">View Transaction</a>
                                                </div>
                                            ))
                                        }
                                    </Modal>

                                </div>
                            </div>
                        </div>
                    </div>
                </main >
                <div style={{ justifyContent: 'center', textAlign: 'left', padding: '0px 20px 30px 70px' }}>
                    <a href="/home">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-sky-200 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back
                        </button>
                    </a>
                </div>
            </div>
        </div>


    )
}
export default Block_Tracer