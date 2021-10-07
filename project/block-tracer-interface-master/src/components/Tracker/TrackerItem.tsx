import React, { useState } from 'react'
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, notification, Space } from 'antd';
import { SentTransactions, Transaction } from '../../types';
import SentTxList from './SentTxList';
import useAppStore from '../../store';
import LabelAddress from '../LabelAddress';

interface TrackerItemProps {
    address: string,
    sentTransactions?: SentTransactions | null,
    loadSentTransactions?: () => void
}

const TrackerItem: React.FC<TrackerItemProps> = (props) => {

    const [loading, setLoading] = useState(false);

    const handleLoad = async () => {
        setLoading(true);
        props.loadSentTransactions && await props.loadSentTransactions();
        setLoading(false);
        notification['success']({
            message: 'Success',
            description: 'Load data successfully'
        })
    }

    return (
        <div>
            <div className='flex space-x-2'>
                <LabelAddress address={props.address} />
                <div><ArrowRightOutlined /></div>
                <div>
                    <div>
                        <div className="pb-1">
                            <Button onClick={handleLoad} loading={loading}>Load</Button>
                        </div>
                        {
                            props.sentTransactions && <SentTxList sentTransactions={props.sentTransactions} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrackerItem
