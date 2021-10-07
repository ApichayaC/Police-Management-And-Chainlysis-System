import React, { useState } from 'react'
import { Level } from '../../types';
import TrackerItem from './TrackerItem';

interface TrackerProps {
    level: number,
    data: Level,
    startBlock: number,
    loadSentTransactions: (level: number, from: string, startBlock: number) => void
}

const Tracker: React.FC<TrackerProps> = ({ level, data, startBlock, loadSentTransactions }) => {

    const [expanded, setExpanded] = useState(true);
    const [maxDisplay, setMaxDisplay] = useState(20);

    const num = Object.entries(data).length;

    const expandedText = expanded ? `Hide (${num}) items` : `Show (${num}) items`;

    const toggleExpand = () => setExpanded(!expanded);

    const showMore = () => {
        setMaxDisplay(maxDisplay + 20);
    }

    return (
        <div>
            <div className="flex items-center space-x-1 mb-2">
                <span className="text-lg font-semibold">Level {level + 1}</span>
                <span>From Block #{startBlock}</span>
                <span className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={toggleExpand}> ({expandedText})</span>
            </div>
            {
                expanded && (
                    <div>
                        <div>
                            {Object.entries(data).slice(0, maxDisplay).map(([from, sentTransactions], index) => {
                                return (
                                    <div key={from} className='flex space-x-1 item-center mb-2'>
                                        <div>({index + 1})</div>
                                        <TrackerItem
                                            address={from}
                                            sentTransactions={sentTransactions}
                                            loadSentTransactions={() => loadSentTransactions(level, from, startBlock)}
                                        />
                                    </div>

                                )
                            })}
                        </div>
                        {num > maxDisplay && (
                            <div className="cursor-pointer text-blue-400" onClick={showMore}>Show more</div>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default Tracker
