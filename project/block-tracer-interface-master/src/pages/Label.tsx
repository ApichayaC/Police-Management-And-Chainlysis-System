import { Button, Input, Typography } from 'antd';
import { useState } from 'react'
import useAppStore from '../store'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const Label = () => {

    const [address, setAddress] = useState('');
    const [label, setLabel] = useState('');

    const addressLabels = useAppStore(state => state.addressLabels);
    const setAddressLabel = useAppStore(state => state.setLabel);
    const deleteLabel = useAppStore(state => state.deleteLabel);

    const handleAddLabel = () => {
        setAddressLabel(address, label);
        setAddress('');
        setLabel('');
    }

    return (
        <div>
            <h1 className="font-bold text-xl">Manage Label</h1>
            <div>
                <div className="flex space-x-2 mb-2">
                    <Input value={address} style={{ width: 300 }} onChange={e => setAddress(e.target.value)} />
                    <Input value={label} style={{ width: 200 }} onChange={e => setLabel(e.target.value)} />
                    <Button type='primary' icon={<PlusOutlined />} onClick={handleAddLabel} />
                </div>
                {
                    Object.entries(addressLabels).sort((a, b) => -1).map(([address, label]) => (
                        <div key={address} className="flex space-x-2 mb-2">
                            <Typography.Text ellipsis style={{ width: 300 }}>{address}</Typography.Text>
                            <Input value={label} style={{ width: 200 }} onChange={e => setAddressLabel(address, e.target.value)} />
                            <Button danger icon={<DeleteOutlined />} onClick={() => deleteLabel(address)} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Label
