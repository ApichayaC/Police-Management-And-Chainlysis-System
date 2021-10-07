import { ethers } from "ethers";

export function withCommas(x: number | string | undefined) {
    if (!x) return x;
    const [dec, f] = x.toString().split('.');
    if (f) {
        return dec.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + f;
    } else {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export const formatDate = (input: number | Date | string) => {
    const date = new Date(input)
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const hr = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${d}/${m}/${y} ${hr}:${min}`;
}

export const formatBlockDate = (block: ethers.providers.Block | undefined) => {
    if (!block) return '';
    return formatDate(block.timestamp * 1000);
}
