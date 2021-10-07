import { Typography } from 'antd'
import React, { useState } from 'react'
import useAppStore from '../store'

interface LabelAddressProps {
    address: string
}

const LabelAddress: React.FC<LabelAddressProps> = ({ address }) => {

    const getLabelledAddress = useAppStore(state => state.getLabelledAddress);
    const labelAddress = useAppStore(state => state.addressLabels);
    const setLabel = useAppStore(state => state.setLabel);
    const deleteLabel = useAppStore(state => state.deleteLabel);

    const [editing, setEditing] = useState(false);

    const handleChange = (val: string) => {
        console.log(val);
        if (val === "") deleteLabel(address);
        else setLabel(address, val);
        setEditing(false);
    }

    const displayedText = editing ? labelAddress[address] || address : getLabelledAddress(address)

    return (
        <div>
            <Typography.Text editable={{
                onStart: () => setEditing(true),
                onChange: handleChange,
                onEnd: () => setEditing(false),
                onCancel: () => setEditing(false)
            }}>{displayedText}</Typography.Text>
        </div>
    )
}

export default LabelAddress
