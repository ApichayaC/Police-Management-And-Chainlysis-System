import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import styles from '../styles/Home.module.css'
import { Button } from "antd";

export default function Information_Police() {
    return (
        <div style={{ backgroundColor: '#EAEAEA' }}>
            <div style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem 2rem', width: '100vw',height:'100vh' }}>
                <div className={styles.tapbar}>
                    <p className={styles.font_top}>HOME</p>
                </div>
                <div style={{ padding: '20px', margin: '30px 0px 0px 0px' }} className={styles.box_info}>

                    <div>
                        <Button
                            href='/home'>
                            Back
                        </Button>
                    </div>


                </div>
            </div>
        </div>

    )
}