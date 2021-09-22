import React,{useEffect,useState} from "react";
import { useRouter } from "next/dist/client/router";
import styles from '../styles/Home.module.css'

export default function Information_Police(){
    const URL = "http://127.0.0.1:3333"
    return(
        <div style={{ backgroundColor: '#EAEAEA', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0.5rem', height: '100vh' }}>
            <div className={styles.template}>
            </div>
        </div>
    )
}