import { Tabs, Calendar } from '@planingo/ditto';
import './details.css'

export const Details = ({entityName, events}: {entityName?: string, events?: {title: string, start: unknown, end: unknown}[]}) => {
    return <div className='layout-details'>
        <Tabs
            defaultActiveKey="3"
            items={[
                {
                    key: "1",
                    label: entityName,
                    children: <>{entityName}</>
                },
                {
                    key: "2",
                    label: "Contraintes",
                    children: <>Contraintes</>,
                    disabled: true,
                },
                {
                    key: "3",
                    label: "Calendrier",
                    children: <div className='tabs-container'><Calendar events={events} /></div>
                },
                {
                    key: "4",
                    label: "Historique",
                    children: <>Historique</>,
                    disabled: true,
                }
            ]}
        />
    </div>
}