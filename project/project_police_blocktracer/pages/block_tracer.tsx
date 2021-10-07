import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Button, Input, Modal, notification, Select } from 'antd';
import useAppStore from '../store';

import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected'

import { GraphInput } from '../src/types'
import { THEIF_ADDRESSES, BN_ADDRESSES } from '../src/common/constants'
import axios from 'axios'
import config from '../config'

const BASE_URL = 'http://block.werapun.com:4005';
const PAGE_SIZE = 5;

export default function Block_Tracer() {

    const [from, setFrom] = useState(THEIF_ADDRESSES.ETH[0].toLowerCase());
    const [to, setTo] = useState(BN_ADDRESSES[0].toLowerCase());
    const [level, setLevel] = useState('5');
    const [page, setPage] = useState('1');
    const [loading, setLoading] = useState(false);

    const [relations, setRelations] = useState<GraphInput>();
    const [visible, setVisible] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>(null);

    const getAccountRelations = (from: string, to: string, level = 1, limit = 20, offset = 0) => {
        const url = `${BASE_URL}/graph/trace?from=${from}&to=${to}&level=${level}&limit=${limit}&offset=${offset}`;
        // const url = `${BASE_URL}/graph/trace?from=0x4d98fb4964c532e80a43ba2089146ce4dc0ecbc2&to=0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be&level=5&limit=50&offset=100`;
        console.log(url);
        return axios.get(url).then(res => res.data as GraphInput);
    }
    
    const chartRef = useRef<am4plugins_forceDirected.ForceDirectedTree | null>(null);


    useLayoutEffect(() => {
        let chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
        let series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
        series.dataFields.value = "value";
        series.dataFields.name = "name";
        series.dataFields.children = "children";
        series.dataFields.id = "name";
        series.dataFields.linkWith = "linkWith";

        let linkTemplate = series.links.template;
        linkTemplate.strokeWidth = 1;
        linkTemplate.events.on('hit', function (ev) {
            console.log("Click link: ", ev.target)
        })

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
            
            const fromLabel = getLabelledAddress(from);
            const toLabel = getLabelledAddress(to);
            
            chartRef.current.data = Object.entries(connectionMap).map(([fromAddr, data]) => {
                return {
                    name: fromAddr,
                    linkWith: Array.from(new Set(data.dests)),
                    value: [fromLabel, toLabel].includes(fromAddr) ? 10 : 5,
                    txList: Array.from(new Set(data.txList))
                }
            });
            
            console.log(chartRef.current.data);
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

    
    const handleClick = async () => {
        await loadRelations();
    }
    
    useEffect(() => {
        loadRelations();
    }, []);
    
    
    const loadRelations = async () => {
        setLoading(true);
        try {
            console.time("loadRelations");
            const res = await getAccountRelations(from.toLowerCase(), to.toLowerCase(), +level, PAGE_SIZE, (+page - 1) * PAGE_SIZE);
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

    const srcOptions = THEIF_ADDRESSES.ETH.map(addr => ({ label: getLabelledAddress(addr, { showAddress: true }), value: addr }));
    const destOptions = BN_ADDRESSES.map(addr => ({ label: getLabelledAddress(addr, { showAddress: true }), value: addr }));
    
    return (
        <div style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem 2rem', width: '100vw' }}>
            <div className={styles.tapbar}>
                <p className={styles.font_top}>BLOCK TRACER</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }} className={styles.box_info}>
                <div>
                    <label>FROM : </label>
                    <Input type='text' style={{ width: 300 }} />
                </div>
                <div>
                    <label>TO : </label>
                    <Input type='text' style={{ width: 300 }} />
                </div>
                <div>
                    <label>LEVELS : </label>
                    <Input type='text' style={{ width: 300 }} />
                </div>
                <Button>
                    TRACE
                </Button>
                <div style={{ justifyContent: 'center', textAlign: 'left', padding: '0px 20px 30px 70px' }}>
                    <Button
                        href='/home'>
                        Back
                    </Button>
                </div>
            </div>
            <div>

                <div className="flex space-x-2 mb-4">
                    <div className='w-1/4'>
                        <div>Source: </div>
                        <Select className="w-full" options={srcOptions} value={from} onChange={v => setFrom(v)} />
                    </div>
                    <div className='w-1/4'>
                        <div>Destination: </div>
                        <Select className="w-full" options={destOptions} value={to} onChange={v => setTo(v)} />
                    </div>
                    <div className="w-20">
                        <div>Level: </div>
                        <Input type="number" value={level} onChange={e => setLevel(e.target.value)} />
                    </div>
                    <div className="w-20">
                        <div>Page: </div>
                        <Input type="number" value={page} onChange={e => setPage(e.target.value)} />
                    </div>
                    <div className="flex items-end">
                        <Button type="primary" onClick={handleClick} loading={loading}>Load</Button>
                    </div>
                </div>

                <div className='w-full border' style={{ minHeight: 600 }}>
                    <div id="chartdiv" style={{ minHeight: 800 }}></div>
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
                                <span>#{index + 1} : </span>
                                <a href={`${config.ETHERSCAN_BASE_URL}/tx/${hash}`} target="_blank">View Transaction</a>
                            </div>
                        ))
                    }
                </Modal>

            </div>
        </div>
    )
}