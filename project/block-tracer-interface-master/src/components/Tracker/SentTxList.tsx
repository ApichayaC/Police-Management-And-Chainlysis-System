import React, { useState } from 'react'
import { SentTransactions, Transaction } from '../../types'
import TxItem from './TxItem'

interface SentTxListProps {
    sentTransactions: SentTransactions
}

const SentTxList: React.FC<SentTxListProps> = (props) => {

    const [expanded, setExpanded] = useState(true);
    const [maxDisplay, setMaxDisplay] = useState(20);

    const num = Object.values(props.sentTransactions).length;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    const showMore = () => {
        setMaxDisplay(maxDisplay + 20);
    }

    return (
        <div>
            <div>
                <p className="mb-2 text-blue-500 hover:text-blue-400 cursor-pointer" onClick={toggleExpanded}>{expanded ? `Hide ${num} items` : `Show ${num} items`}</p>
                {
                    expanded && (
                        <div>
                            <div>
                                {Object.entries(props.sentTransactions).slice(0, maxDisplay).map(([to, transactions], index) => {
                                    return (
                                        <div key={to} className="flex space-x-1">
                                            <span>({index + 1}) </span>
                                            <TxItem to={to} transactions={transactions} />
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
        </div>
    )
}

export default SentTxList
