import './layout.css'
import { ReactNode } from 'react';

export const Layout = ({children}: {children: ReactNode}) => {
    return <div className="layout">{children}</div>
}