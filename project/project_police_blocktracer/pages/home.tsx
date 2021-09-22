import React from "react";
import styles from '../styles/Home.module.css'
import info_police from '../pages'


export default function Home() {
    return (
        <div style={{ backgroundColor: '#EAEAEA', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '0 0.5rem' }}>
            <div className={styles.box}>
                <button className={styles.button} style={{ marginLeft: '75px', marginTop: '90px' }}>
                    <a href="/police_list" className={styles.fonthome}>หน้าแรก</a>
                </button>

                <button className={styles.button} style={{ marginLeft: '75px', marginTop: '50px' }}>
                    <a href="/police_list" className={styles.fonthome}>ข้อมูลตำรวจ</a>
                </button>

                <button className={styles.button} style={{ marginLeft: '75px', marginTop: '50px' }}>
                    <a href="/block_tracer" className={styles.fonthome}>Block Tracer</a>
                </button>
            </div>
        </div>
    )
}