import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useRouter } from "next/router";
import { Row, Col, Button, Input, message } from "antd";
import styles from '../styles/Home.module.css'
import { useForm } from 'react-hook-form'

export default function Profile() {
    const URL = 'http://127.0.0.1:3333'
    const [profile, setProflie] = useState<any>([]);
    const Router = useRouter()
    console.log(Router.query);

    const [showEdit, setShowEdit] = useState<any>(false);
    const setValueToShowEdit = () => {
        setShowEdit(!showEdit);
        setComfirm(!confirm);
        setEditProfile({
            rank: profile.rank,
            name: profile.name,
            surname: profile.surname,
            position: profile.position,
            education: profile.education,
            reward: profile.reward,
            appoint: profile.appoint,
            training: profile.training,
            telephone: profile.telephone,
            civil_year: profile.civil_year,
            civil_history: profile.civil_history
        })
    }

    //const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [editProfile, setEditProfile] = useState({
        rank: '',
        name: '',
        surname: '',
        position: '',
        education: '',
        reward: '',
        appoint: '',
        training: '',
        telephone: '',
        civil_year: '',
        civil_history: ''
    });

    const [confirm, setComfirm] = useState<any>(false)

    const validateInput = async () => {
        console.log(editProfile)
        //  if (editProfile.appoint&&editProfile.education&&editProfile.position&&editProfile.name&&editProfile.rank&&editProfile.reward&&editProfile.surname) 
        if (editProfile.rank && editProfile.name && editProfile.surname) {
            console.log('EditProfile', editProfile);

            const EditProfile = await axios.put(`${URL}` + '/update/' + Router.query.id, {
                ...editProfile
            })
            console.log(EditProfile)
            if (EditProfile.data == 'PASS!!') {
                setComfirm(!confirm)
                setShowEdit(!showEdit)
                setProflie({
                    ...profile,
                    rank: editProfile.rank,
                    name: editProfile.name,
                    surname: editProfile.surname,

                    position: editProfile.position,
                    education: editProfile.education,
                    reward: editProfile.reward,
                    appoint: editProfile.appoint,
                    training: editProfile.training,
                    telephone: editProfile.telephone,

                    civil_year: editProfile.civil_year,
                    civil_history: editProfile.civil_history
                })
                // Router.push({
                //     pathname: 'profile'
                // })
            }
        }
        else {
            message.error('กรุณาใส่ข้อมูลให้ถูกต้อง');
        }
    }

    const getNameById = async () => {
        try {
            let info = await axios.get(`${URL}` + '/get/' + Router.query.id)
            console.log(info);
            setProflie(Object.assign({}, { ...info.data, }))

        } catch (error) {
            console.log(error);
        }
    }

    const getHistory = (years: string, history: string) => {
        setProflie({
            ...profile,
            civil_year: profile.civil_year + ';' + years,
            civil_history: profile.civil_history + ';' + history
        });
        setEditProfile({
            ...editProfile,
            civil_year: profile.civil_year + ';' + years,
            civil_history: profile.civil_history + ';' + history
        })
        setCivil({
            year: '',
            history: ''
        })
    }

    const [civil, setCivil] = useState({ year: '', history: '' })
    const getCivilyear = () => {
        if (profile.civil_year && profile.civil_history) {
            const years = profile.civil_year.split(';')
            const History = profile.civil_history.split(';')
            return years.map((item: string, index: number) => {
                return (

                    <div style={{ margin: '10px 0px ' }}>
                        <Row justify="center"  >
                            <Col span={5}>
                                <h3>{item}</h3>
                            </Col >
                            <Col span={9} ><h3>{History[index]}</h3></Col>
                        </Row>
                    </div>
                )
            })
        }
    }

    useEffect(() => {
        { getNameById() }

    }, [])
    return (
        <div style={{ backgroundColor: '#EAEAEA', height: '100vh' }}>
            <div>
                <a onClick={() => {
                    localStorage.removeItem('user')
                    Router.push({
                        pathname: 'home'
                    })
                }}
                    style={{ float: 'right', margin: '10px', cursor: 'pointer', paddingRight: '2rem' }}>ออกจากระบบ</a>
            </div>
            <div style={{ backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center', padding: '2rem 2rem', width: '100vw' }}>
                <div className={styles.tapbar}>
                    <p className={styles.font_top}>INFORMATION</p>
                </div>
                <div className={styles.box_info}>
                    <div style={{ margin: '25px' }}>
                        <div>
                            {profile ?
                                <div>
                                    <h1 style={{ textAlign: 'center', fontSize: '32px', margin: '25px' }}><b>ประวัติ</b></h1>
                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>ยศ ชื่อ-ชื่อสกุล </b></h3>
                                            </Col >
                                            {showEdit ?
                                                <Col span={10}>
                                                    <Input placeholder="พ.ต.อ. ซื่อสัตย์ สุจริต"
                                                        defaultValue={`${profile.rank} ${profile.name} ${profile.surname}`}
                                                        onChange={(e) => {
                                                            setEditProfile({
                                                                ...editProfile,
                                                                rank: e.target.value.split(' ')[0] || '',
                                                                name: e.target.value.split(' ')[1] || '',
                                                                surname: e.target.value.split(' ')[2] || ''
                                                            })
                                                        }} />
                                                </Col>
                                                :
                                                <Col span={10} ><h3>{profile.rank + ' ' + profile.name + ' ' + profile.surname}</h3></Col>
                                            }
                                        </Row>

                                    </div>
                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>ตำแหน่ง</b></h3>
                                            </Col >
                                            {
                                                showEdit ?
                                                    <Col span={10}>
                                                        <Input
                                                            defaultValue={profile.position}
                                                            onChange={(e) => {
                                                                setEditProfile({
                                                                    ...editProfile,
                                                                    position: e.target.value
                                                                })
                                                            }} />
                                                    </Col>
                                                    :
                                                    <Col span={10} ><h3>{profile.position}</h3></Col>
                                            }

                                        </Row>

                                    </div>


                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>คุณวุฒิทางการศึกษา</b></h3>
                                            </Col >
                                            {showEdit ?
                                                <Col span={10}>
                                                    <Input
                                                        defaultValue={profile.education}
                                                        onChange={(e) => {
                                                            setEditProfile({
                                                                ...editProfile,
                                                                education: e.target.value
                                                            })
                                                        }} />
                                                </Col>
                                                :
                                                <Col span={10} ><h3>{profile.education}</h3></Col>
                                            }

                                        </Row>
                                    </div>

                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>ประวัติรับราชการ</b></h3>
                                            </Col >
                                            <Col span={10}></Col>
                                        </Row>
                                    </div>
                                    {getCivilyear()}
                                    {
                                        showEdit ?
                                            <div style={{ margin: '10px 0px ' }}>
                                                <Row justify="center">
                                                    <Col span={4}>
                                                        <Input
                                                            value={civil.year}
                                                            onChange={(e) => {
                                                                setCivil({
                                                                    ...civil,
                                                                    year: e.target.value
                                                                })
                                                            }}>
                                                        </Input>
                                                    </Col>
                                                    <Col span={2}>
                                                    </Col>
                                                    <Col span={10}>
                                                        <Col>
                                                            <Input
                                                                value={civil.history}
                                                                onChange={(e) => {
                                                                    setCivil({
                                                                        ...civil,
                                                                        history: e.target.value
                                                                    })
                                                                }}>
                                                            </Input>
                                                        </Col>
                                                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <Col>
                                                                <Button onClick={() => { getHistory(civil.year, civil.history) }}>Add</Button>
                                                            </Col>
                                                        </div>
                                                    </Col>
                                                </Row>

                                            </div>
                                            :
                                            ''
                                    }

                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>ผลงาน</b></h3>
                                            </Col >
                                            {
                                                showEdit ?
                                                    <Col span={10}>
                                                        <Input
                                                            defaultValue={profile.reward}
                                                            onChange={(e) => {
                                                                setEditProfile({
                                                                    ...editProfile,
                                                                    reward: e.target.value
                                                                })
                                                            }} />
                                                    </Col>
                                                    :
                                                    <Col span={10} ><h3>{profile.reward}</h3></Col>
                                            }

                                        </Row>
                                    </div>

                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>ขอรับตำแหน่งในตำแหน่งที่สูงขึ้น</b></h3>
                                            </Col >
                                            {
                                                showEdit ?
                                                    <Col span={10}>
                                                        <Input
                                                            defaultValue={profile.appoint}
                                                            onChange={(e) => {
                                                                setEditProfile({
                                                                    ...editProfile,
                                                                    appoint: e.target.value
                                                                })
                                                            }} />
                                                    </Col>
                                                    :
                                                    <Col span={10} ><h3>{profile.appoint}</h3></Col>
                                            }
                                        </Row>
                                    </div>

                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>การฝึกอบรม</b></h3>
                                            </Col >
                                            {
                                                showEdit ?
                                                    <Col span={10}>
                                                        <Input
                                                            defaultValue={profile.training}
                                                            onChange={(e) => {
                                                                setEditProfile({
                                                                    ...editProfile,
                                                                    training: e.target.value
                                                                })
                                                            }} />
                                                    </Col>
                                                    :
                                                    <Col span={10} ><h3>{profile.training}</h3></Col>
                                            }
                                        </Row>
                                    </div>

                                    <div style={{ margin: '10px 0px ' }}>
                                        <Row justify="center"  >
                                            <Col span={6}>
                                                <h3><b>หมายเลขโทรศัพท์</b></h3>
                                            </Col >
                                            {
                                                showEdit ?
                                                    <Col span={10}>
                                                        <Input
                                                            defaultValue={profile.telephone}
                                                            onChange={(e) => {
                                                                setEditProfile({
                                                                    ...editProfile,
                                                                    telephone: e.target.value
                                                                })
                                                            }} />
                                                    </Col>
                                                    :
                                                    <Col span={10} ><h3>{profile.telephone}</h3></Col>
                                            }
                                        </Row>
                                    </div>
                                </div> : ''}
                        </div>

                        <div style={{ justifyContent: 'center', textAlign: 'right', padding: '40px' }}>
                            {
                                confirm ?
                                    <Button
                                        onClick={() => {
                                            validateInput()
                                        }}>
                                        Comfirm
                                    </Button>
                                    :
                                    <Button
                                        onClick={() => {
                                            setValueToShowEdit();
                                        }}>
                                        Edit
                                    </Button>
                            }
                            <Button
                                style={{ margin: '0px 0px 0px 20px' }}
                                href='/police_list'>
                                Back
                            </Button>

                        </div>

                    </div>

                </div>

            </div>
        </div >


    )
}