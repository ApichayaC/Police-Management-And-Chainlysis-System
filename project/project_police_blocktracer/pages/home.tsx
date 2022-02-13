import React, { useState, useEffect } from "react";
import styles from '../styles/Home.module.css'
import info_police from '../pages'
import { useRouter } from 'next/router';


export default function Home() {
    const [loginCheck, setLoginCheck] = useState('');
    const router = useRouter();
    useEffect(() => {
        const user = localStorage.getItem('user');
        const role = localStorage.getItem('role')
        if (user == 'success') {
            if(role=='Editor'){
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
        setLoginCheck(user);
    }, [loginCheck])
    
    return (
        <div style={{ backgroundColor: '#EAEAEA', height: '100vh', width: '100vw' }}>
            <div>
                {loginCheck == 'success' ? <a onClick={() => {
                    localStorage.removeItem('user')
                    setLoginCheck('')
                }}
                    style={{ float: 'right', margin: '10px', cursor: 'pointer', paddingRight: '2rem' }}>ออกจากระบบ</a> :
                    <a
                        style={{ float: 'right', margin: '10px', cursor: 'pointer', paddingRight: '2rem' }}
                        href="/login">เข้าสู่ระบบ</a>}
            </div>

            <div style={{ backgroundColor: '#EAEAEA', display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center', padding: '0 0.5rem', height: '90vh', width: '100vw' }}>
                <div className={styles.box}>
                    {/* <button className={styles.button} style={{ marginLeft: '75px', marginTop: '90px' }}>
                        <a href="/info_police" className={styles.fonthome} style={{ margin: '-14px 50px 0px 65px' }}>หน้าแรก</a>
                    </button> */}

                    <button className={styles.button} style={{ marginLeft: '75px', marginTop: '50px' }}>
                        <a href="/police_list" className={styles.fonthome} style={{ margin: '-14px 50px 0px 45px' }}>ข้อมูลตำรวจ</a>
                    </button>

                    <button className={styles.button} style={{ marginLeft: '75px', marginTop: '50px' }}>
                        <a href="/block_tracer" className={styles.fonthome} style={{ margin: '-14px 50px 0px 45px' }}>Block Tracer</a>
                    </button>
                </div>
            </div>
        </div>

    )
}